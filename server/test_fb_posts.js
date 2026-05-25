const { PrismaClient } = require('@prisma/client');
const axios = require('axios');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst({ where: { facebookConnected: true } });
  if (!user || !user.facebookAccessToken) return console.log("No FB token");

  try {
    const pagesRes = await axios.get(`https://graph.facebook.com/v18.0/me/accounts?access_token=${user.facebookAccessToken}`);
    const pageId = pagesRes.data.data[0].id;
    const pageToken = pagesRes.data.data[0].access_token;
    
    console.log("Fetching posts for page:", pageId);
    const postsRes = await axios.get(`https://graph.facebook.com/v18.0/${pageId}/published_posts?fields=message,created_time,permalink_url,id&access_token=${pageToken}`);
    console.log(postsRes.data);
  } catch (err) {
    console.log("Error:", err.response?.data || err.message);
  }
}
main().finally(() => prisma.$disconnect());
