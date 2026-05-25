"use client";

import { useState, useEffect } from "react";
import Sidebar from "../../../components/Sidebar";
import Topbar from "../../../components/Topbar";
import { Flame, TrendingUp, Globe2, Hash, Music, Zap, BarChart2 } from "lucide-react";

const trendingHashtags = [
  { rank: 1, tag: "#AIagents", volume: "2.4M", trend: "+124%", platform: "Twitter / X" },
  { rank: 2, tag: "#TechStartups", volume: "1.8M", trend: "+85%", platform: "LinkedIn" },
  { rank: 3, tag: "#WebDevelopment", volume: "1.2M", trend: "+42%", platform: "YouTube" },
  { rank: 4, tag: "#CodingLife", volume: "950K", trend: "+28%", platform: "Instagram" },
  { rank: 5, tag: "#FutureOfWork", volume: "820K", trend: "+15%", platform: "Twitter / X" },
];

const trendingAudio = [
  { rank: 1, name: "Cyberpunk Ambient Mix", uses: "4.2M", trend: "Viral", platform: "TikTok" },
  { rank: 2, name: "Lo-Fi Focus Beats", uses: "2.8M", trend: "Rising", platform: "Instagram Reels" },
  { rank: 3, name: "Dramatic Cinematic Bass", uses: "1.5M", trend: "Stable", platform: "YouTube Shorts" },
];

export default function TrendsPage() {
  const [expanded, setExpanded] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [hashtags, setHashtags] = useState(trendingHashtags);

  const fetchTrends = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/trends");
      if (res.ok) {
        const data = await res.json();
        setHashtags(data);
      }
    } catch (error) {
      console.error("Failed to fetch trends", error);
    }
  };

  const handleScan = async () => {
    setIsScanning(true);
    await fetchTrends();
    setIsScanning(false);
  };

  useEffect(() => {
    fetchTrends();
  }, []);

  return (
    <main className="min-h-screen flex relative overflow-hidden">
      {/* BACKGROUND GLOW */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
        <div className="absolute top-[-200px] left-[50%] -translate-x-1/2 w-[600px] h-[500px] bg-orange-500/10 blur-[150px] rounded-full" />
      </div>

      <Sidebar expanded={expanded} setExpanded={setExpanded} />

      <section
        className="flex-1 relative z-10 transition-all duration-500 ease-in-out max-lg:!ml-0"
        style={{ marginLeft: expanded ? "250px" : "88px" }}
      >
        <div className="p-4 md:p-8 min-h-screen">
          <Topbar />

          {/* DASHBOARD CONTAINER */}
          <div className="theme-card rounded-[24px] md:rounded-[36px] p-6 md:p-10 border border-white/5 shadow-2xl backdrop-blur-2xl">
            
            {/* HEADING */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
              <div>
                <p className="theme-muted uppercase tracking-[0.25em] text-sm mb-4 flex items-center gap-2">
                  <Flame size={16} className="text-orange-400" /> Global Discovery
                </p>
                <h1 className="text-4xl md:text-5xl font-bold leading-tight theme-text mb-4">
                  Trend Radar
                </h1>
                <p className="theme-muted text-base max-w-2xl leading-relaxed">
                  Real-time aggregation of viral hashtags, trending audio, and rising topics across the global internet.
                </p>
              </div>

              <button
                onClick={handleScan}
                disabled={isScanning}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold flex items-center gap-3 hover:scale-105 transition-all shadow-[0_0_30px_rgba(249,115,22,0.3)] disabled:opacity-50 disabled:hover:scale-100"
              >
                {isScanning ? (
                  <>
                    <Globe2 size={20} className="animate-spin" /> Scanning Web...
                  </>
                ) : (
                  <>
                    <Zap size={20} /> Force Live Scan
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              
              {/* LEFT COLUMN: HASHTAGS */}
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                    <Hash size={20} className="text-orange-400" />
                  </div>
                  <h2 className="text-2xl font-bold theme-text">Viral Hashtags</h2>
                </div>

                <div className="flex flex-col gap-4">
                  {hashtags.map((item) => (
                    <div key={item.rank} className="p-5 rounded-2xl bg-black/5 dark:bg-white/[0.02] border border-black/10 dark:border-white/5 flex items-center justify-between group hover:bg-black/10 dark:hover:bg-white/[0.04] transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-black/5 dark:bg-black/40 border border-black/10 dark:border-white/10 flex items-center justify-center text-sm font-bold theme-muted">
                          {item.rank}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold theme-text group-hover:text-orange-400 transition-colors">{item.tag}</h3>
                          <p className="text-xs theme-muted mt-1">{item.platform}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold theme-text mb-1">{item.volume}</p>
                        <p className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-1 rounded-md inline-block">{item.trend}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT COLUMN: AUDIO & TOPICS */}
              <div className="flex flex-col gap-8">
                
                {/* Trending Audio */}
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                      <Music size={20} className="text-rose-400" />
                    </div>
                    <h2 className="text-2xl font-bold theme-text">Trending Audio</h2>
                  </div>

                  <div className="flex flex-col gap-4">
                    {trendingAudio.map((item) => (
                      <div key={item.rank} className="p-4 rounded-2xl bg-black/5 dark:bg-gradient-to-r dark:from-black/40 dark:to-rose-900/10 border border-black/10 dark:border-white/5 flex items-center justify-between">
                        <div>
                          <h3 className="text-base font-bold theme-text mb-1">{item.name}</h3>
                          <p className="text-xs theme-muted">{item.platform} • {item.uses} uses</p>
                        </div>
                        <div className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20">
                          <span className="text-xs font-bold text-rose-400">{item.trend}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Market Insight */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-orange-500/10 to-rose-500/10 border border-orange-500/20 mt-auto">
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart2 size={18} className="text-orange-400" />
                    <h3 className="theme-text font-bold">AI Market Insight</h3>
                  </div>
                  <p className="theme-muted text-sm leading-relaxed mb-4">
                    The algorithm is currently favoring "Educational AI" content over "Entertainment" across LinkedIn and Twitter. We recommend pivoting your next 3 posts to tutorial-based content using the #AIagents tag to capture the 124% trend surge.
                  </p>
                  <button className="text-xs font-bold uppercase tracking-wider text-orange-400 hover:text-orange-300">
                    Apply to Scheduler →
                  </button>
                </div>

              </div>
              
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
