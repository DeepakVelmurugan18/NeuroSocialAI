"use client";

import { useState, useEffect } from "react";

import axios from "axios";
import { jsPDF } from "jspdf";

import Sidebar from "../../components/Sidebar";

import AnalyticsCard from "../../components/AnalyticsCard";

import GrowthChart from "../../components/GrowthChart";

import Topbar from "../../components/Topbar";

import AIInsights from "../../components/AIInsights";

import PlatformTabs from "../../components/PlatformTabs";

import AIAnalyzer from "../../components/AIAnalyzer";

import ActivityFeed from "../../components/ActivityFeed";

import CompetitorRadar from "../../components/CompetitorRadar";

export default function DashboardPage() {
  const [isExporting, setIsExporting] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [exportPlatforms, setExportPlatforms] = useState({
    instagram: true,
    youtube: true,
    twitter: true,
    facebook: true
  });
  const [stats, setStats] = useState({
    totalAnalyses: "...",
    avgViralScore: "...",
    positiveSentiment: "...",
    youtube: {
      connected: false,
      subscribers: "0",
      views: "0",
      videos: "0"
    },
    facebook: {
      connected: false,
      followers: "0"
    },
    instagram: {
      connected: false,
      followers: "0"
    },
    twitter: {
      connected: false,
      followers: "0"
    }
  });

  const formatNumber = (numStr: string) => {
    const num = parseInt(numStr);
    if (isNaN(num)) return "0";
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  // State for platform aggregation toggles
  const [activeFilters, setActiveFilters] = useState({
    youtube: true,
    facebook: true,
    instagram: true,
    twitter: true,
  });
  
  const [isLoaded, setIsLoaded] = useState(false);

  // Load filters from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("neuroSocialFilters");
    if (saved) {
      try {
        setActiveFilters(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse filters");
      }
    }
    setIsLoaded(true);
  }, []);

  // Save filters to localStorage when they change (only after initial load)
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("neuroSocialFilters", JSON.stringify(activeFilters));
    }
  }, [activeFilters, isLoaded]);

  // Calculate aggregated metrics based on active filters
  const getAggregatedStats = () => {
    let audience = 0;
    let views = 0;
    let content = 0;

    if (activeFilters.youtube && stats.youtube?.connected) {
      audience += parseInt(stats.youtube.subscribers) || 0;
      views += parseInt(stats.youtube.views) || 0;
      content += parseInt(stats.youtube.videos) || 0;
    }
    if (activeFilters.facebook && stats.facebook?.connected) {
      audience += parseInt(stats.facebook.followers) || 0;
      // We do not have Graph API permission for FB views yet, so strictly show real data (0)
    }
    if (activeFilters.instagram && stats.instagram?.connected) {
      audience += parseInt(stats.instagram.followers) || 0;
      content += parseInt(stats.instagram.followers) || 0; // mapped to media_count in our DB
    }
    if (activeFilters.twitter && stats.twitter?.connected) {
      audience += parseInt(stats.twitter.followers) || 0;
    }

    return { audience, views, content };
  };

  const aggregated = getAggregatedStats();

  const [analyses, setAnalyses] = useState<any[]>([]);

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      const doc = new jsPDF();
      
      // Modern Header Background
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(0, 0, 210, 40, 'F');
      
      // Header Text
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(24);
      doc.text("NEUROSOCIAL OS", 20, 22);
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(148, 163, 184); // slate-400
      doc.text("INTELLIGENCE REPORT", 20, 30);
      
      doc.setTextColor(255, 255, 255);
      doc.text(`DATE: ${new Date().toLocaleDateString()}`, 150, 22);
      
      // Body Content
      let yPos = 60;
      doc.setTextColor(15, 23, 42);

      // Selected Platforms Array
      const selected = Object.entries(exportPlatforms)
        .filter(([_, isSelected]) => isSelected)
        .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1));

      if (selected.length === 0) {
        throw new Error("Select at least one platform");
      }

      selected.forEach((platform) => {
        // Platform Card
        doc.setFillColor(248, 250, 252); // slate-50
        doc.roundedRect(20, yPos, 170, 45, 3, 3, 'F');
        
        doc.setDrawColor(226, 232, 240); // slate-200
        doc.roundedRect(20, yPos, 170, 45, 3, 3, 'S');

        // Platform Title
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(15, 23, 42);
        doc.text(`${platform} Analytics`, 25, yPos + 12);
        
        // Grab real dynamic data
        const pKey = platform.toLowerCase() as keyof typeof stats;
        const pStats = stats[pKey] as any;
        
        let pAudience = "0";
        let pViews = "0";
        let pEngagement = "0";
        
        if (pStats?.connected) {
           if (pKey === 'youtube') {
             pAudience = pStats.subscribers;
             pViews = pStats.views;
             pEngagement = pStats.videos;
           } else {
             pAudience = pStats.followers;
             pViews = "N/A";
             pEngagement = "N/A";
           }
        } else {
           pAudience = "Not Connected";
           pViews = "N/A";
           pEngagement = "N/A";
        }

        // Metrics line 1
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 116, 139); // slate-500
        
        doc.text("Total Audience", 25, yPos + 25);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(15, 23, 42);
        doc.text(pStats?.connected ? formatNumber(pAudience) : "Not Connected", 25, yPos + 32);

        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 116, 139);
        doc.text("Total Views / Reach", 80, yPos + 25);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(15, 23, 42);
        doc.text(pStats?.connected && pViews !== "N/A" ? formatNumber(pViews) : "N/A", 80, yPos + 32);

        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 116, 139);
        doc.text("Content Count", 140, yPos + 25);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(15, 23, 42);
        doc.text(pStats?.connected && pEngagement !== "N/A" ? formatNumber(pEngagement) : "N/A", 140, yPos + 32);

        yPos += 55;
        
        if (yPos > 250) {
          doc.addPage();
          yPos = 30;
        }
      });
      
      // Footer
      doc.setFontSize(9);
      doc.setTextColor(148, 163, 184);
      doc.text("Generated securely by NeuroSocial AI Engine", 105, 285, { align: "center" });

      doc.save(`NeuroSocial_Report_${new Date().getTime()}.pdf`);

      setShowExportMenu(false);
    } catch (err) {
      console.error("Failed to export", err);
      alert("Failed to generate report. Did you select a platform?");
    } finally {
      setIsExporting(false);
    }
  };

  const [expanded, setExpanded] =
    useState(false);


  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    const fetchStats = async (isBackground = false) => {
      try {
        const userStr = localStorage.getItem("user");
        const userId = userStr ? JSON.parse(userStr).id : "";
        
        if (!isBackground) setIsSyncing(true);
        
        // Step 1: Force a real-time sync with Google/Meta APIs
        await axios.get(
          `http://${window.location.hostname}:5000/api/stats/sync${userId ? `?userId=${userId}` : ''}`
        );

        // Step 2: Fetch the newly updated stats from the database
        const res = await axios.get(
          `http://${window.location.hostname}:5000/api/stats${userId ? `?userId=${userId}` : ''}`
        );
        
        if (isMounted) setStats(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        if (isMounted) setIsSyncing(false);
      }
    };
    
    fetchStats(false);
    
    // Live Polling every 10 seconds (silent background fetch)
    const intervalId = setInterval(() => {
      fetchStats(true);
    }, 10000);
    
    // Also refresh stats when a new analysis is made
    window.addEventListener("analysis-updated", () => fetchStats(false));
    return () => {
      isMounted = false;
      clearInterval(intervalId);
      window.removeEventListener("analysis-updated", () => fetchStats(false));
    };
  }, []);

  return (

    <main
      className="
        min-h-screen
        flex
        relative
        overflow-hidden
      "
    >

      {/* BACKGROUND GLOW */}

      <div
        className="
          absolute
          top-0
          left-0
          w-full
          h-full
          pointer-events-none
          opacity-40
        "
      >

        <div
          className="
            absolute
            top-[-200px]
            right-[-150px]
            w-[500px]
            h-[500px]
            bg-cyan-500/10
            blur-[140px]
            rounded-full
          "
        />

        <div
          className="
            absolute
            bottom-[-250px]
            left-[-200px]
            w-[500px]
            h-[500px]
            bg-blue-500/10
            blur-[160px]
            rounded-full
          "
        />

      </div>

      {/* SIDEBAR */}

      <Sidebar
        expanded={expanded}
        setExpanded={setExpanded}
      />

      {/* MAIN CONTENT */}

      <section
        className="
          flex-1
          relative
          z-10
          transition-all
          duration-500
          ease-in-out
          max-lg:!ml-0
        "
        style={{

          marginLeft:
            expanded
              ? "250px"
              : "88px",

        }}
      >

        {/* CONTENT WRAPPER */}

        <div
          className="
            p-4
            md:p-8
            min-h-screen
          "
        >

          {/* TOPBAR */}

          <Topbar />

          {/* DASHBOARD CONTAINER */}

          <div
            className="
              theme-card
              rounded-[24px]
              md:rounded-[36px]
              p-4
              md:p-8
              border
              border-white/5
              shadow-2xl
              backdrop-blur-2xl
            "
          >

            {/* PLATFORM TABS */}

            <PlatformTabs />

            {/* HEADING */}

            <div
              className="
                mt-10
                mb-10
              "
            >

              <p
                className="
                  theme-muted
                  uppercase
                  tracking-[0.25em]
                  text-sm
                  mb-4
                "
              >

                AI Powered Analytics

              </p>

              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <h1
                    className="
                      text-4xl
                      md:text-6xl
                      font-bold
                      leading-tight
                      theme-text
                    "
                  >

                    NeuroSocial Dashboard

                  </h1>

                  <p
                    className="
                      theme-muted
                      mt-4
                      text-base
                      md:text-lg
                      max-w-2xl
                      leading-relaxed
                    "
                  >

                    Monitor growth,
                    analyze content,
                    and generate AI-driven
                    social insights in
                    one powerful dashboard.

                  </p>
                </div>

                <div className="relative">
                  <button
                    onClick={() => setShowExportMenu(!showExportMenu)}
                    className="px-6 py-3 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 border border-black/10 dark:border-white/20 theme-text font-bold transition-all shadow-lg flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Export AI Report
                  </button>

                  {showExportMenu && (
                    <div className="absolute top-full right-0 mt-2 w-64 p-4 rounded-2xl theme-card border border-white/10 shadow-2xl z-50">
                      <h4 className="font-bold theme-text mb-3 text-sm">Select Platforms</h4>
                      <div className="flex flex-col gap-2 mb-4">
                        {Object.keys(exportPlatforms).map((platform) => (
                          <label key={platform} className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative flex items-center justify-center">
                              <input 
                                type="checkbox" 
                                className="peer appearance-none w-5 h-5 border border-black/20 dark:border-white/20 rounded-md checked:bg-cyan-500 checked:border-cyan-500 transition-all cursor-pointer"
                                checked={exportPlatforms[platform as keyof typeof exportPlatforms]}
                                onChange={(e) => setExportPlatforms({
                                  ...exportPlatforms,
                                  [platform]: e.target.checked
                                })}
                              />
                              <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            </div>
                            <span className="theme-muted group-hover:theme-text transition-colors capitalize text-sm font-medium">
                              {platform}
                            </span>
                          </label>
                        ))}
                      </div>
                      <button
                        onClick={handleExport}
                        disabled={isExporting}
                        className="w-full py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-white font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                      >
                        {isExporting ? "Generating PDF..." : "Generate PDF"}
                      </button>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* PLATFORM GROWTH SECTION */}

            <div
              className="
                relative
              "
            >

              <div
                className="
                  flex
                  items-center
                  justify-between
                  mb-6
                "
              >

                <div>

                  <h2
                    className="
                      text-2xl
                      font-semibold
                      theme-text
                    "
                  >

                    Platform Growth

                  </h2>

                  <p
                    className="
                      theme-muted
                      mt-2
                      flex items-center gap-2
                    "
                  >
                    Aggregated audience and reach metrics.
                    {isSyncing && (
                      <span className="text-xs text-cyan-500 animate-pulse font-semibold">
                        (Syncing Live Data...)
                      </span>
                    )}
                  </p>

                </div>
                
                {/* LIVE INDICATOR */}
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                  </span>
                  <span className="text-xs font-bold text-emerald-400 tracking-widest uppercase">Live Connection</span>
                </div>

              </div>

              <div className="flex flex-col gap-6">
                
                {/* PLATFORM FILTERS */}
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-sm font-semibold theme-muted mr-2">Include:</span>
                  
                  <button
                    onClick={() => setActiveFilters(prev => ({ ...prev, youtube: !prev.youtube }))}
                    disabled={!stats.youtube?.connected}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all border flex items-center gap-2 ${
                      !stats.youtube?.connected ? "opacity-30 cursor-not-allowed border-gray-500 text-gray-500" :
                      activeFilters.youtube 
                        ? "bg-red-500 border-red-500 text-white shadow-[0_0_10px_rgba(239,68,68,0.3)]" 
                        : "bg-transparent border-red-500/30 text-red-500 hover:bg-red-500/10"
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="white"></polygon></svg>
                    YouTube
                  </button>

                  <button
                    onClick={() => setActiveFilters(prev => ({ ...prev, facebook: !prev.facebook }))}
                    disabled={!stats.facebook?.connected}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all border flex items-center gap-2 ${
                      !stats.facebook?.connected ? "opacity-30 cursor-not-allowed border-gray-500 text-gray-500" :
                      activeFilters.facebook 
                        ? "bg-blue-600 border-blue-600 text-white shadow-[0_0_10px_rgba(37,99,235,0.3)]" 
                        : "bg-transparent border-blue-600/30 text-blue-600 hover:bg-blue-600/10"
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                    Facebook
                  </button>

                  <button
                    onClick={() => setActiveFilters(prev => ({ ...prev, instagram: !prev.instagram }))}
                    disabled={!stats.instagram?.connected}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all border flex items-center gap-2 ${
                      !stats.instagram?.connected ? "opacity-30 cursor-not-allowed border-gray-500 text-gray-500" :
                      activeFilters.instagram 
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 border-transparent text-white shadow-[0_0_10px_rgba(217,70,239,0.3)]" 
                        : "bg-transparent border-pink-500/30 text-pink-500 hover:bg-pink-500/10"
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                    Instagram
                  </button>

                  <button
                    onClick={() => setActiveFilters(prev => ({ ...prev, twitter: !prev.twitter }))}
                    disabled={!stats.twitter?.connected}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all border flex items-center gap-2 ${
                      !stats.twitter?.connected ? "opacity-30 cursor-not-allowed border-gray-500 text-gray-500" :
                      activeFilters.twitter 
                        ? "bg-black dark:bg-white border-black dark:border-white text-white dark:text-black shadow-[0_0_10px_rgba(255,255,255,0.3)]" 
                        : "bg-transparent border-gray-400/30 text-gray-400 hover:bg-black/5 dark:hover:bg-white/10"
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.004 4.076H5.036z"></path></svg>
                    X (Twitter)
                  </button>
                </div>

                <div
                  className="
                    grid
                    grid-cols-1
                    md:grid-cols-3
                    gap-6
                  "
                >
                  <AnalyticsCard
                    title="Total Audience"
                    value={formatNumber(aggregated.audience.toString())}
                  />

                  <AnalyticsCard
                    title="Total Content / Posts"
                    value={formatNumber(aggregated.content.toString())}
                  />

                  <AnalyticsCard
                    title="Total Views / Reach"
                    value={formatNumber(aggregated.views.toString())}
                  />
                </div>
              </div>

            </div>

            {/* ANALYTICS SECTION */}

            <div
              className="
                mt-10
                pt-10
                border-t
                border-white/5
              "
            >

              {/* SECTION LABEL */}

              <div
                className="
                  flex
                  items-center
                  justify-between
                  mb-6
                "
              >

                <div>

                  <h2
                    className="
                      text-2xl
                      font-semibold
                      theme-text
                    "
                  >

                    AI Analytics Overview

                  </h2>

                  <p
                    className="
                      theme-muted
                      mt-2
                    "
                  >

                    Real-time AI performance metrics.

                  </p>

                </div>

              </div>

              {/* CARDS */}

              <div
                className="
                  grid
                  grid-cols-1
                  md:grid-cols-3
                  gap-6
                "
              >

                <AnalyticsCard
                  title="Total Analyses"
                  value={stats.totalAnalyses}
                />

                <AnalyticsCard
                  title="Avg Viral Score"
                  value={stats.avgViralScore}
                />

                <AnalyticsCard
                  title="Positive Sentiment"
                  value={stats.positiveSentiment}
                />

              </div>

            </div>



            {/* CHART & FEED SECTION */}

            <div
              className="
                mt-10
                pt-10
                border-t
                border-white/5
                grid
                grid-cols-1
                xl:grid-cols-3
                gap-6
              "
            >
              
              {/* Left Chart */}
              <div className="xl:col-span-2">
                <GrowthChart showFollowers={false} />
              </div>

              {/* Right Feed */}
              <div className="h-full">
                <ActivityFeed />
              </div>

            </div>

            {/* INSIGHTS SECTION */}

            <div
              className="
                mt-10
                pt-10
                border-t
                border-white/5
              "
            >

              <AIInsights />

            </div>

            {/* ANALYZER SECTION */}

            <div
              className="
                mt-10
                pt-10
                border-t
                border-white/5
              "
            >

              <AIAnalyzer />

            </div>

            {/* COMPETITOR RADAR SECTION */}

            <div
              className="
                mt-10
                pt-10
                border-t
                border-white/5
              "
            >
              <CompetitorRadar />
            </div>

          </div>

        </div>

      </section>

    </main>

  );

}