"use client";

import { useState, useEffect } from "react";

import axios from "axios";

import Sidebar from "../../../components/Sidebar";
import AnalyticsCard from "../../../components/AnalyticsCard";
import GrowthChart from "../../../components/GrowthChart";
import Topbar from "../../../components/Topbar";
import AIInsights from "../../../components/AIInsights";

import PlatformTabs from "../../../components/PlatformTabs";
import AIAnalyzer from "../../../components/AIAnalyzer";

export default function InstagramDashboardPage() {

  const [expanded, setExpanded] =
    useState(false);

  const [stats, setStats] =
    useState({

      totalAnalyses: "...",
      avgViralScore: "...",
      positiveSentiment: "...",
    });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const userStr = localStorage.getItem("user");
        const userId = userStr ? JSON.parse(userStr).id : "";
        const res = await axios.get(
          `https://neurosocialai.onrender.com/api/stats${userId ? `?userId=${userId}` : ''}`
        );
        setStats(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchStats();
    
    // Also refresh stats when a new analysis is made
    window.addEventListener("analysis-updated", fetchStats);
    return () => window.removeEventListener("analysis-updated", fetchStats);
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
                Instagram Specific Analytics
              </p>
              <h1
                className="
                  text-4xl
                  md:text-6xl
                  font-bold
                  leading-tight
                  text-transparent
                  bg-clip-text
                  bg-gradient-to-r
                  from-pink-500
                  to-purple-500
                  pb-2
                "
              >
                Instagram Dashboard
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
                Monitor your reel growth, track post engagement, and generate AI-driven captions optimized specifically for the Instagram algorithm.
              </p>

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
                    "
                  >

                    Aggregated audience and reach metrics.

                  </p>

                </div>

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
                  title="Instagram Followers"
                  value={(stats as any).instagram?.connected ? (stats as any).instagram?.followers : "0"}
                />

                <AnalyticsCard
                  title="Reel Engagement"
                  value={(stats as any).instagram?.connected ? "Tracking..." : "0%"}
                />

                <AnalyticsCard
                  title="Profile Visits"
                  value={(stats as any).instagram?.connected ? "Tracking..." : "0"}
                />

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



            {/* CHART SECTION */}

            <div
              className="
                mt-10
                pt-10
                border-t
                border-white/5
              "
            >

              <GrowthChart platform="instagram" />

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

              <AIAnalyzer platform="instagram" />

            </div>

          </div>

        </div>

      </section>

    </main>

  );

}