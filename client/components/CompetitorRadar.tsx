"use client";

import { useState } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Crosshair, Target, Search } from "lucide-react";

const mockData = [
  { subject: "Reach", A: 85, B: 65, fullMark: 100 },
  { subject: "Engagement", A: 92, B: 75, fullMark: 100 },
  { subject: "Virality", A: 88, B: 60, fullMark: 100 },
  { subject: "Consistency", A: 70, B: 90, fullMark: 100 },
  { subject: "Sentiment", A: 80, B: 85, fullMark: 100 },
];

export default function CompetitorRadar() {
  const [competitor, setCompetitor] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasResult, setHasResult] = useState(true); // Default true to show the cool chart immediately

  const handleAnalyze = () => {
    if (!competitor.trim()) return;
    setIsAnalyzing(true);
    // Simulate AI analysis delay
    setTimeout(() => {
      setIsAnalyzing(false);
      setHasResult(true);
    }, 2000);
  };

  return (
    <div className="theme-card rounded-[24px] md:rounded-[36px] border border-white/10 p-5 md:p-8 shadow-[0_0_60px_rgba(255,0,128,0.04)] relative overflow-hidden">
      {/* BACKGROUND GLOW */}
      <div className="absolute top-[-100px] left-[-100px] w-[260px] h-[260px] bg-rose-500/10 blur-3xl rounded-full pointer-events-none" />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 shrink-0 rounded-3xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shadow-lg">
            <Target size={28} className="text-rose-400" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black theme-text">
              Competitor Radar
            </h2>
            <p className="theme-muted mt-1 text-sm">
              AI-driven multi-axis threat assessment.
            </p>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="w-full md:w-auto flex items-center gap-2">
          <div className="relative w-full md:w-[250px]">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="@username or URL..."
              value={competitor}
              onChange={(e) => setCompetitor(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-sm theme-text outline-none focus:border-rose-500/50 focus:bg-black/40 transition-all"
            />
          </div>
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="px-6 py-2.5 rounded-full bg-rose-500 text-white font-bold text-sm hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2 shrink-0"
          >
            {isAnalyzing ? (
              <span className="animate-pulse">Scanning...</span>
            ) : (
              <>
                <Crosshair size={16} /> Analyze
              </>
            )}
          </button>
        </div>
      </div>

      {/* CHART AREA */}
      {hasResult && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center relative z-10">
          
          {/* STATS LEFT */}
          <div className="flex flex-col gap-4">
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5">
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">Your Profile</p>
              <h3 className="text-xl font-bold text-cyan-400">Domination</h3>
              <p className="text-sm text-zinc-400 mt-2">You are currently outperforming in Reach and Engagement velocity.</p>
            </div>
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5">
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">Competitor Threat</p>
              <h3 className="text-xl font-bold text-rose-400">High Consistency</h3>
              <p className="text-sm text-zinc-400 mt-2">Competitor posts 3x more frequently, resulting in higher baseline retention.</p>
            </div>
          </div>

          {/* RADAR CHART */}
          <div className="h-[350px] lg:h-[400px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={mockData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "#a1a1aa", fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                
                {/* Your Data */}
                <Radar
                  name="You"
                  dataKey="A"
                  stroke="#22d3ee"
                  strokeWidth={2}
                  fill="#22d3ee"
                  fillOpacity={0.3}
                />
                
                {/* Competitor Data */}
                <Radar
                  name="Competitor"
                  dataKey="B"
                  stroke="#f43f5e"
                  strokeWidth={2}
                  fill="#f43f5e"
                  fillOpacity={0.3}
                />
                
                <Tooltip 
                  contentStyle={{
                    background: "rgba(15,15,15,0.95)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* LEGEND & ACTION RIGHT */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                <span className="font-semibold text-cyan-400 text-sm">Your Account</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <div className="w-3 h-3 rounded-full bg-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.8)]" />
                <span className="font-semibold text-rose-400 text-sm">Competitor Account</span>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-white font-bold mb-2">AI Strategy Recommendation</h4>
              <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                To crush this competitor, increase posting frequency by 15% and focus on high-retention hook formats to close the consistency gap.
              </p>
              <button className="w-full py-3 rounded-xl border border-white/10 hover:bg-white/[0.04] transition-all text-sm font-bold text-white">
                Generate Battle Plan
              </button>
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
}
