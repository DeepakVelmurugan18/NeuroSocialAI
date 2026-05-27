const express = require("express");
const cors = require("cors");
const axios = require("axios");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const { PrismaClient } = require("@prisma/client");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { google } = require("googleapis");
const googleTrends = require("google-trends-api");

require("dotenv").config({ override: true });

const prisma = new PrismaClient();

const oauth2Client = new google.auth.OAuth2(
  process.env.YOUTUBE_CLIENT_ID,
  process.env.YOUTUBE_CLIENT_SECRET,
  process.env.YOUTUBE_REDIRECT_URI
);

const app = express();

/* MIDDLEWARE */

app.use(cors());

app.use(express.json());

/* HOME */

app.get("/", (req, res) => {

  res.json({

    message:
      "NeuroSocial AI Backend Running",

  });

});

/* STATS API */

app.get("/api/stats", async (req, res) => {
  try {
    const userId = req.query.userId;
    let where = {};
    if (userId) {
      where.userId = userId;
    }
    
    const analyses = await prisma.analysis.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    const totalAnalyses = analyses.length;
    
    let totalScore = 0;
    let scoreCount = 0;
    let positiveCount = 0;

    analyses.forEach(a => {
      // Extract numeric score from string like "92%"
      const match = a.viralScore.match(/(\d+)/);
      if (match) {
        totalScore += parseInt(match[1]);
        scoreCount++;
      }
      
      if (a.sentiment.toLowerCase().includes("positive")) {
        positiveCount++;
      }
    });

    const avgViralScore = scoreCount > 0 ? Math.round(totalScore / scoreCount) + "%" : "0%";
    const positiveSentiment = totalAnalyses > 0 ? Math.round((positiveCount / totalAnalyses) * 100) + "%" : "0%";

    let userStats = null;
    if (userId) {
      userStats = await prisma.user.findUnique({ where: { id: userId } });
    } else {
      userStats = await prisma.user.findFirst();
    }

    res.json({
      totalAnalyses: totalAnalyses.toString(),
      avgViralScore: avgViralScore,
      positiveSentiment: positiveSentiment,
      youtube: {
        connected: userStats?.youtubeConnected || false,
        subscribers: userStats?.youtubeSubs || "0",
        views: userStats?.youtubeViews || "0",
        videos: userStats?.youtubeVideos || "0"
      },
      facebook: {
        connected: userStats?.facebookConnected || false,
        followers: userStats?.facebookFollowers || "0"
      },
      instagram: {
        connected: userStats?.instagramConnected || false,
        followers: userStats?.instagramFollowers || "0"
      },
      twitter: {
        connected: userStats?.twitterConnected || false,
        followers: userStats?.twitterFollowers || "0"
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to load stats" });
  }
});

/* SYNC REAL-TIME STATS */
app.get("/api/stats/sync", async (req, res) => {
  try {
    const { userId } = req.query;
    let userStats = null;
    
    if (userId) {
      userStats = await prisma.user.findUnique({ where: { id: userId } });
    } else {
      userStats = await prisma.user.findFirst();
    }

    if (!userStats) return res.status(404).json({ error: "User not found" });

    let updated = false;

    // Sync YouTube if we have a refresh token
    if (userStats.youtubeConnected && userStats.youtubeRefreshToken) {
      try {
        oauth2Client.setCredentials({
          refresh_token: userStats.youtubeRefreshToken,
          access_token: userStats.youtubeAccessToken
        });
        const youtube = google.youtube({ version: "v3", auth: oauth2Client });
        const response = await youtube.channels.list({ part: "snippet,statistics", mine: true });
        
        if (response.data.items && response.data.items.length > 0) {
          const stats = response.data.items[0].statistics;
          
          userStats = await prisma.user.update({
            where: { id: userStats.id },
            data: {
              youtubeSubs: stats.subscriberCount,
              youtubeViews: stats.viewCount,
              youtubeVideos: stats.videoCount
            }
          });
          updated = true;
        }
      } catch (err) {
        console.error("YouTube Live Sync Failed:", err.message);
      }
    }

    // REAL Sync Facebook and Instagram via Meta Graph API
    if (userStats.facebookConnected && userStats.facebookAccessToken) {
      try {
        const pagesResponse = await axios.get(`https://graph.facebook.com/v18.0/me/accounts?access_token=${userStats.facebookAccessToken}`);
        const pages = pagesResponse.data.data;
        
        if (pages && pages.length > 0) {
          const firstPage = pages[0];
          
          // 1. Fetch Real Facebook Page Followers
          const pageDetails = await axios.get(`https://graph.facebook.com/v18.0/${firstPage.id}?fields=followers_count,instagram_business_account&access_token=${firstPage.access_token}`);
          
          let updateData = {};
          
          if (pageDetails.data.followers_count !== undefined) {
            updateData.facebookFollowers = pageDetails.data.followers_count.toString();
          }

          // 2. Fetch Real Linked Instagram Professional Account Followers
          if (pageDetails.data.instagram_business_account) {
            const igAccountId = pageDetails.data.instagram_business_account.id;
            const igDetails = await axios.get(`https://graph.facebook.com/v18.0/${igAccountId}?fields=followers_count&access_token=${firstPage.access_token}`);
            
            if (igDetails.data.followers_count !== undefined) {
              updateData.instagramFollowers = igDetails.data.followers_count.toString();
              updateData.instagramConnected = true;
            }
          }

          if (Object.keys(updateData).length > 0) {
            userStats = await prisma.user.update({
              where: { id: userStats.id },
              data: updateData
            });
            updated = true;
          }
        }
      } catch (err) {
        console.error("Meta Graph API Live Sync Failed:", err.message);
      }
    }

    // Sync Instagram if we have an access token
    if (userStats.instagramConnected && userStats.instagramAccessToken) {
      try {
        const profileResponse = await axios.get(`https://graph.instagram.com/me?fields=id,username,media_count&access_token=${userStats.instagramAccessToken}`);
        if (profileResponse.data.media_count !== undefined) {
          userStats = await prisma.user.update({
            where: { id: userStats.id },
            data: { instagramFollowers: profileResponse.data.media_count.toString() }
          });
          updated = true;
        }
      } catch (err) {
        console.error("Instagram Live Sync Failed:", err.message);
      }
    }

    res.json({ success: true, updated, message: "Real-time sync complete" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to sync real-time stats" });
  }
});

/* GLOBAL TRENDS API */
app.get("/api/trends", async (req, res) => {
  try {
    const rssResponse = await axios.get("https://trends.google.com/trending/rss?geo=US");
    const xml = rssResponse.data;

    // Simple regex parsing to extract titles and traffic from RSS items
    const items = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    let rank = 1;

    while ((match = itemRegex.exec(xml)) !== null && rank <= 5) {
      const itemXml = match[1];
      const titleMatch = itemXml.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || itemXml.match(/<title>(.*?)<\/title>/);
      const trafficMatch = itemXml.match(/<ht:approx_traffic>(.*?)<\/ht:approx_traffic>/);
      
      if (titleMatch) {
        items.push({
          rank: rank++,
          tag: "#" + titleMatch[1].replace(/[\s\W]+/g, ""),
          volume: trafficMatch ? trafficMatch[1] : "10K+",
          trend: "Rising",
          platform: "Global Web"
        });
      }
    }

    res.json(items.length > 0 ? items : [
      { rank: 1, tag: "#AIagents", volume: "2.4M+", trend: "Rising", platform: "Global Web" },
      { rank: 2, tag: "#TechStartups", volume: "1.8M+", trend: "Rising", platform: "Global Web" },
      { rank: 3, tag: "#WebDevelopment", volume: "1.2M+", trend: "Rising", platform: "Global Web" }
    ]);
  } catch (error) {
    console.error("Error fetching global trends:", error);
    res.status(500).json({ error: "Failed to fetch trends" });
  }
});

/* REGISTER */

app.post(
  "/api/register",
  async (req, res) => {

    try {

      const {
        name,
        email,
        password,
      } = req.body;

      /* CHECK USER */

      const existingUser =
        await prisma.user.findUnique({

          where: { email },

        });

      if (existingUser) {

        return res.status(400).json({

          message:
            "User already exists",

        });

      }

      /* HASH PASSWORD */

      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

      /* CREATE USER */

      const user =
        await prisma.user.create({

          data: {

            name,

            email,

            password:
              hashedPassword,

          },

        });

      res.status(201).json({

        message:
          "User registered successfully",

        user: {

          id: user.id,

          name: user.name,

          email: user.email,

        },

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          "Server Error",

      });

    }

  }
);

/* LOGIN */

app.post(
  "/api/login",
  async (req, res) => {

    try {

      const {
        email,
        password,
      } = req.body;

      /* FIND USER */

      const user =
        await prisma.user.findUnique({

          where: { email },

        });

      if (!user) {

        return res.status(400).json({

          message:
            "User not found",

        });

      }

      /* CHECK PASSWORD */

      const isMatch =
        await bcrypt.compare(
          password,
          user.password
        );

      if (!isMatch) {

        return res.status(400).json({

          message:
            "Invalid credentials",

        });

      }

      /* TOKEN */

      const token = jwt.sign(

        {
          userId: user.id,
        },

        process.env.JWT_SECRET ||

          "secret",

        {
          expiresIn: "7d",
        }

      );

      res.json({

        message:
          "Login successful",

        token,

        user: {

          id: user.id,

          name: user.name,

          email: user.email,

        },

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          "Server Error",

      });

    }

  }
);

/* ANALYSES HISTORY */

app.get(
  "/api/analyses",
  async (req, res) => {
    try {
      const userId = req.query.userId;
      let where = {};
      if (userId) {
        where.userId = userId;
      }
      
      const analyses = await prisma.analysis.findMany({
        where,
        orderBy: { createdAt: "desc" },
      });
      
      res.json(analyses);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to fetch analyses" });
    }
  }
);

/* AI ANALYZE */

app.post(
  "/api/analyze",
  async (req, res) => {

    try {

      const { content, userId, platform } = req.body;

      if (!content) {
        return res.status(400).json({
          error: "No content provided",
        });
      }

      // Initialize Gemini AI
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      let prompt = `You are an expert social media AI analyst. Analyze the following social media content and provide a concise report. You MUST exactly follow this format:

🔥 Viral Potential: [0-100]%
✅ Sentiment: [Positive/Neutral/Negative]
📈 Engagement Prediction: [One short sentence prediction]
🚀 Recommendation: [One short actionable advice]
# Suggested Hashtags: [3 to 5 relevant hashtags]

Content to analyze: "${content}"`;

      if (platform === "instagram") {
        prompt = `You are an expert Instagram algorithm analyst. Analyze the following Instagram caption/hook and provide a concise report specifically optimized for Reels and Instagram engagement. You MUST exactly follow this format:

🔥 IG Viral Potential: [0-100]%
✅ Audience Sentiment: [Positive/Neutral/Negative]
📈 Reel/Post Prediction: [One short sentence prediction]
🚀 Instagram Strategy: [One actionable tip for IG growth]
# Top IG Hashtags: [3 to 5 highly searchable Instagram hashtags]

Instagram Content to analyze: "${content}"`;
      } else if (platform === "youtube") {
        prompt = `You are an expert YouTube algorithm analyst. Analyze the following YouTube video script/title and provide a concise report specifically optimized for retention and click-through rates. You MUST exactly follow this format:

🔥 YT Viral Potential: [0-100]%
✅ Viewer Sentiment: [Positive/Neutral/Negative]
📈 Retention Prediction: [One short sentence prediction]
🚀 YouTube Strategy: [One actionable tip for YT growth]
# Top YT Tags: [3 to 5 highly searchable YouTube tags]

YouTube Content to analyze: "${content}"`;
      } else if (platform === "twitter") {
        prompt = `You are an expert Twitter/X algorithm analyst. Analyze the following tweet/thread and provide a concise report specifically optimized for retweets and replies. You MUST exactly follow this format:

🔥 Tweet Viral Potential: [0-100]%
✅ Reply Sentiment: [Positive/Neutral/Negative]
📈 Impression Prediction: [One short sentence prediction]
🚀 Twitter Strategy: [One actionable tip for X growth]
# Trending Tags: [3 to 5 highly relevant Twitter hashtags]

Twitter Content to analyze: "${content}"`;
      } else if (platform === "facebook") {
        prompt = `You are an expert Facebook algorithm analyst. Analyze the following Facebook post and provide a concise report specifically optimized for shares and community engagement. You MUST exactly follow this format:

🔥 FB Viral Potential: [0-100]%
✅ Community Sentiment: [Positive/Neutral/Negative]
📈 Reach Prediction: [One short sentence prediction]
🚀 Facebook Strategy: [One actionable tip for FB growth]
# Top FB Hashtags: [3 to 5 relevant Facebook hashtags]

Facebook Content to analyze: "${content}"`;
      }

      const aiResult = await model.generateContent(prompt);
      const analysisText = aiResult.response.text().trim();

      // Extract metrics for the database
      const viralMatch = analysisText.match(/Viral Potential:\s*(\d+%)/i) || 
                         analysisText.match(/IG Viral Potential:\s*(\d+%)/i) ||
                         analysisText.match(/YT Viral Potential:\s*(\d+%)/i) ||
                         analysisText.match(/Tweet Viral Potential:\s*(\d+%)/i) ||
                         analysisText.match(/FB Viral Potential:\s*(\d+%)/i);
                         
      const sentimentMatch = analysisText.match(/Sentiment:\s*([A-Za-z]+)/i) || 
                             analysisText.match(/Audience Sentiment:\s*([A-Za-z]+)/i) ||
                             analysisText.match(/Viewer Sentiment:\s*([A-Za-z]+)/i) ||
                             analysisText.match(/Reply Sentiment:\s*([A-Za-z]+)/i) ||
                             analysisText.match(/Community Sentiment:\s*([A-Za-z]+)/i);
                             
      const engagementMatch = analysisText.match(/Engagement Prediction:\s*([^\n]+)/i) || 
                              analysisText.match(/Reel\/Post Prediction:\s*([^\n]+)/i) ||
                              analysisText.match(/Retention Prediction:\s*([^\n]+)/i) ||
                              analysisText.match(/Impression Prediction:\s*([^\n]+)/i) ||
                              analysisText.match(/Reach Prediction:\s*([^\n]+)/i);

      const viralScore = viralMatch ? viralMatch[1] : "N/A";
      const sentiment = sentimentMatch ? sentimentMatch[1] : "N/A";
      const engagement = engagementMatch ? engagementMatch[1] : "N/A";

      let user = null;
      if (userId) {
        user = await prisma.user.findUnique({ where: { id: userId } });
      }
      if (!user) {
        user = await prisma.user.findFirst();
      }

      if (user) {
        await prisma.analysis.create({
          data: {
            content: content,
            viralScore: viralScore,
            sentiment: sentiment,
            engagement: engagement,
            userId: user.id
          }
        });
      }

      res.json({
        analysis: analysisText,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        error:
          "AI analysis failed",

      });

    }

  }
);

/* YOUTUBE OAUTH ROUTES */

app.get("/api/auth/youtube", (req, res) => {
  const { userId } = req.query;
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent", // Forces Google to ALWAYS return a refresh_token
    scope: ["https://www.googleapis.com/auth/youtube.readonly"],
    state: userId ? userId.toString() : undefined
  });
  res.redirect(url);
});

app.get("/api/auth/youtube/callback", async (req, res) => {
  const { code } = req.query;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Test fetching YouTube channel info
    const youtube = google.youtube({
      version: "v3",
      auth: oauth2Client,
    });

    const response = await youtube.channels.list({
      part: "snippet,statistics",
      mine: true,
    });

    const stats = response.data.items[0].statistics;

    // Save tokens and data to the database
    const stateUserId = req.query.state;
    const user = stateUserId ? await prisma.user.findUnique({ where: { id: stateUserId.toString() } }) : await prisma.user.findFirst();
    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          youtubeConnected: true,
          youtubeSubs: stats.subscriberCount,
          youtubeViews: stats.viewCount,
          youtubeVideos: stats.videoCount,
          youtubeAccessToken: tokens.access_token,
          youtubeRefreshToken: tokens.refresh_token
        }
      });
    }

    res.redirect("https://client-seven-woad-29.vercel.app/dashboard/settings?youtube=connected");
  } catch (error) {
    console.error("Error retrieving YouTube access token:", error);
    res.redirect("https://client-seven-woad-29.vercel.app/dashboard/settings?youtube=error");
  }
});

/* FACEBOOK & INSTAGRAM (META GRAPH API) ROUTES */

app.get("/api/auth/facebook", (req, res) => {
  const { userId } = req.query;
  // REAL Meta API Scopes required for Facebook Pages and Linked Instagram Accounts
  const scopes = "public_profile,pages_show_list,pages_read_engagement,instagram_basic,instagram_manage_insights";
  const FACEBOOK_CLIENT_ID = process.env.FACEBOOK_CLIENT_ID;
  const url = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${FACEBOOK_CLIENT_ID}&redirect_uri=https://neurosocialai.onrender.com/api/auth/facebook/callback&state=${userId ? userId.toString() : 'facebook'}&scope=${scopes}`;
  res.redirect(url);
});

app.get("/api/auth/facebook/callback", async (req, res) => {
  const { code } = req.query;
  if (!code) return res.redirect("https://client-seven-woad-29.vercel.app/dashboard/settings?facebook=error");

  try {
    // 1. Exchange code for REAL Access Token
    const FACEBOOK_CLIENT_ID = process.env.FACEBOOK_CLIENT_ID;
    const FACEBOOK_CLIENT_SECRET = process.env.FACEBOOK_CLIENT_SECRET;
    const tokenUrl = `https://graph.facebook.com/v18.0/oauth/access_token?client_id=${FACEBOOK_CLIENT_ID}&redirect_uri=https://neurosocialai.onrender.com/api/auth/facebook/callback&client_secret=${FACEBOOK_CLIENT_SECRET}&code=${code}`;
    const tokenResponse = await axios.get(tokenUrl);
    const accessToken = tokenResponse.data.access_token;

    // 2. Fetch REAL Facebook Pages owned by this user
    const pagesResponse = await axios.get(`https://graph.facebook.com/v18.0/me/accounts?access_token=${accessToken}`);
    const pages = pagesResponse.data.data;
    
    let fbFollowers = "0";
    let igFollowers = "0";
    let igConnected = false;
    
    // 3. Fetch Data for both Facebook and Linked Instagram
    if (pages && pages.length > 0) {
      const firstPage = pages[0];
      const pageDetails = await axios.get(`https://graph.facebook.com/v18.0/${firstPage.id}?fields=followers_count,instagram_business_account&access_token=${firstPage.access_token}`);
      
      fbFollowers = pageDetails.data.followers_count ? pageDetails.data.followers_count.toString() : "0";

      if (pageDetails.data.instagram_business_account) {
        const igAccountId = pageDetails.data.instagram_business_account.id;
        const igDetails = await axios.get(`https://graph.facebook.com/v18.0/${igAccountId}?fields=followers_count&access_token=${firstPage.access_token}`);
        igFollowers = igDetails.data.followers_count ? igDetails.data.followers_count.toString() : "0";
        igConnected = true;
      }
    }

    const stateUserId = req.query.state;
    const user = stateUserId && stateUserId !== 'facebook' ? await prisma.user.findUnique({ where: { id: stateUserId.toString() } }) : await prisma.user.findFirst();
    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          facebookConnected: true,
          facebookFollowers: fbFollowers,
          facebookAccessToken: accessToken,
          ...(igConnected && {
            instagramConnected: true,
            instagramFollowers: igFollowers,
            instagramAccessToken: accessToken // They share the same graph API token scope
          })
        }
      });
    }
    res.redirect("https://client-seven-woad-29.vercel.app/dashboard/settings?facebook=connected");
  } catch (error) {
    console.error("Error retrieving REAL Facebook data:", error.response?.data || error.message);
    res.redirect("https://client-seven-woad-29.vercel.app/dashboard/settings?facebook=error");
  }
});

/* INSTAGRAM OAUTH ROUTES */

app.get("/api/auth/instagram", (req, res) => {
  const { userId } = req.query;
  const scopes = "public_profile,pages_show_list,pages_read_engagement,instagram_basic,instagram_manage_insights";
  const FACEBOOK_CLIENT_ID = process.env.FACEBOOK_CLIENT_ID; 
  const url = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${FACEBOOK_CLIENT_ID}&redirect_uri=https://neurosocialai.onrender.com/api/auth/instagram/callback&state=${userId ? userId.toString() : 'instagram'}&scope=${scopes}`;
  res.redirect(url);
});

app.get("/api/auth/instagram/callback", async (req, res) => {
  const { code } = req.query;
  if (!code) return res.redirect("https://client-seven-woad-29.vercel.app/dashboard/settings?instagram=error");

  try {
    const FACEBOOK_CLIENT_ID = process.env.FACEBOOK_CLIENT_ID;
    const FACEBOOK_CLIENT_SECRET = process.env.FACEBOOK_CLIENT_SECRET;
    const tokenUrl = `https://graph.facebook.com/v18.0/oauth/access_token?client_id=${FACEBOOK_CLIENT_ID}&redirect_uri=https://neurosocialai.onrender.com/api/auth/instagram/callback&client_secret=${FACEBOOK_CLIENT_SECRET}&code=${code}`;
    const tokenResponse = await axios.get(tokenUrl);
    const accessToken = tokenResponse.data.access_token;

    const pagesResponse = await axios.get(`https://graph.facebook.com/v18.0/me/accounts?access_token=${accessToken}`);
    const pages = pagesResponse.data.data;
    
    let fbFollowers = "0";
    let igFollowers = "0";
    let igConnected = false;
    
    if (pages && pages.length > 0) {
      const firstPage = pages[0];
      const pageDetails = await axios.get(`https://graph.facebook.com/v18.0/${firstPage.id}?fields=followers_count,instagram_business_account&access_token=${firstPage.access_token}`);
      
      fbFollowers = pageDetails.data.followers_count ? pageDetails.data.followers_count.toString() : "0";

      if (pageDetails.data.instagram_business_account) {
        const igAccountId = pageDetails.data.instagram_business_account.id;
        const igDetails = await axios.get(`https://graph.facebook.com/v18.0/${igAccountId}?fields=followers_count&access_token=${firstPage.access_token}`);
        igFollowers = igDetails.data.followers_count ? igDetails.data.followers_count.toString() : "0";
        igConnected = true;
      }
    }

    const stateUserId = req.query.state;
    const user = stateUserId && stateUserId !== 'instagram' ? await prisma.user.findUnique({ where: { id: stateUserId.toString() } }) : await prisma.user.findFirst();
    
    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          facebookConnected: true,
          facebookFollowers: fbFollowers,
          facebookAccessToken: accessToken,
          ...(igConnected && {
            instagramConnected: true,
            instagramFollowers: igFollowers,
            instagramAccessToken: accessToken
          })
        }
      });
    }
    
    if (!igConnected) {
       console.log("No linked Instagram account found.");
    }

    res.redirect("https://client-seven-woad-29.vercel.app/dashboard/settings?instagram=connected");
  } catch (error) {
    console.error("Error retrieving Instagram data:", error.response?.data || error.message);
    res.redirect("https://client-seven-woad-29.vercel.app/dashboard/settings?instagram=error");
  }
});

/* TWITTER OAUTH ROUTES */

app.get("/api/auth/twitter", (req, res) => {
  // Simulating Twitter OAuth since X API v2 requires extensive developer portal setup
  res.redirect("https://neurosocialai.onrender.com/api/auth/twitter/callback");
});

app.get("/api/auth/twitter/callback", async (req, res) => {
  try {
    const user = await prisma.user.findFirst();
    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          twitterConnected: true,
          twitterFollowers: "12500" // Mock real-time data for Twitter
        }
      });
    }
    res.redirect("https://client-seven-woad-29.vercel.app/dashboard/settings?twitter=connected");
  } catch (error) {
    console.error("Error retrieving Twitter data:", error);
    res.redirect("https://client-seven-woad-29.vercel.app/dashboard/settings?twitter=error");
  }
});

/* DISCONNECT PLATFORM */
app.post("/api/auth/disconnect/:platform", async (req, res) => {
  try {
    const { platform } = req.params;
    const { userId } = req.body;
    let user = null;
    if (userId) {
      user = await prisma.user.findUnique({ where: { id: userId } });
    }
    if (!user) {
      user = await prisma.user.findFirst();
    }
    
    if (!user) return res.status(404).json({ error: "User not found" });

    let updateData = {};
    if (platform === "youtube") {
      updateData = { youtubeConnected: false, youtubeSubs: "0", youtubeViews: "0", youtubeVideos: "0" };
    } else if (platform === "facebook") {
      updateData = { facebookConnected: false, facebookFollowers: "0" };
    } else if (platform === "instagram") {
      updateData = { instagramConnected: false, instagramFollowers: "0" };
    } else if (platform === "twitter") {
      updateData = { twitterConnected: false, twitterFollowers: "0" };
    }

    await prisma.user.update({
      where: { id: user.id },
      data: updateData
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Disconnect error:", error);
    res.status(500).json({ error: "Failed to disconnect platform" });
  }
});

/* CALENDAR & SCHEDULING API */

app.get("/api/schedule", async (req, res) => {
  try {
    const userId = req.query.userId;
    let where = {};
    if (userId) {
      where.userId = userId;
    }
    
    const posts = await prisma.scheduledPost.findMany({
      where,
      orderBy: { createdAt: "asc" },
    });
    
    // Group by day for the frontend
    const schedule = {
      "Mon": [], "Tue": [], "Wed": [], "Thu": [], "Fri": [], "Sat": [], "Sun": []
    };
    
    posts.forEach(post => {
      if (schedule[post.day]) {
        schedule[post.day].push(post);
      }
    });
    
    res.json(schedule);
  } catch (error) {
    console.error("Fetch schedule error:", error);
    res.status(500).json({ error: "Failed to fetch schedule" });
  }
});

app.post("/api/schedule/generate", async (req, res) => {
  try {
    const { userId } = req.body;
    let user = null;
    if (userId) {
      user = await prisma.user.findUnique({ where: { id: userId } });
    } else {
      user = await prisma.user.findFirst();
    }
    
    if (!user) return res.status(404).json({ error: "User not found" });

    // AI Generated mock for now (could connect to Gemini later)
    const generatedPosts = [
      { day: "Mon", platform: "instagram", time: "10:30 AM", type: "Reel", title: "3 Tips for AI Agents", optimal: true, userId: user.id },
      { day: "Mon", platform: "twitter", time: "02:00 PM", type: "Thread", title: "How I built NeuroSocial", optimal: false, userId: user.id },
      { day: "Tue", platform: "youtube", time: "04:15 PM", type: "Shorts", title: "Future of AI UI/UX", optimal: true, userId: user.id },
      { day: "Wed", platform: "twitter", time: "09:00 AM", type: "Tweet", title: "Morning motivation", optimal: false, userId: user.id },
      { day: "Wed", platform: "instagram", time: "06:00 PM", type: "Carousel", title: "My Tech Stack 2026", optimal: true, userId: user.id },
      { day: "Fri", platform: "youtube", time: "12:00 PM", type: "Video", title: "Full Stack Masterclass", optimal: true, userId: user.id },
      { day: "Sat", platform: "instagram", time: "01:30 PM", type: "Story", title: "Behind the scenes", optimal: false, userId: user.id },
      { day: "Sun", platform: "twitter", time: "11:00 AM", type: "Thread", title: "Weekly recap & thoughts", optimal: true, userId: user.id },
    ];

    // Delete old schedule
    await prisma.scheduledPost.deleteMany({
      where: { userId: user.id }
    });

    // Save new schedule
    await prisma.scheduledPost.createMany({
      data: generatedPosts
    });
    
    // Fetch and return the grouped schedule
    const newPosts = await prisma.scheduledPost.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "asc" }
    });
    
    const schedule = {
      "Mon": [], "Tue": [], "Wed": [], "Thu": [], "Fri": [], "Sat": [], "Sun": []
    };
    newPosts.forEach(post => {
      if (schedule[post.day]) {
        schedule[post.day].push(post);
      }
    });

    res.json(schedule);
  } catch (error) {
    console.error("Generate schedule error:", error);
    res.status(500).json({ error: "Failed to generate schedule" });
  }
});

/* PORT */

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

});