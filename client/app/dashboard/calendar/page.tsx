"use client";

import { useState, useEffect } from "react";
import Sidebar from "../../../components/Sidebar";
import Topbar from "../../../components/Topbar";
import { Sparkles, Calendar as CalendarIcon, Clock, Wand2, Zap, PlayCircle, Camera, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

type ScheduledPost = {
  id: string;
  platform: string;
  time: string;
  type: string;
  title: string;
  optimal: boolean;
};

type WeeklySchedule = {
  [key: string]: ScheduledPost[];
};

const emptySchedule: WeeklySchedule = {
  "Mon": [],
  "Tue": [],
  "Wed": [],
  "Thu": [],
  "Fri": [],
  "Sat": [],
  "Sun": [],
};

const generatedSchedule: WeeklySchedule = {
  "Mon": [
    { id: "1", platform: "instagram", time: "10:30 AM", type: "Reel", title: "3 Tips for AI Agents", optimal: true },
    { id: "2", platform: "twitter", time: "02:00 PM", type: "Thread", title: "How I built NeuroSocial", optimal: false },
  ],
  "Tue": [
    { id: "3", platform: "youtube", time: "04:15 PM", type: "Shorts", title: "Future of AI UI/UX", optimal: true },
  ],
  "Wed": [
    { id: "4", platform: "twitter", time: "09:00 AM", type: "Tweet", title: "Morning motivation", optimal: false },
    { id: "5", platform: "instagram", time: "06:00 PM", type: "Carousel", title: "My Tech Stack 2026", optimal: true },
  ],
  "Thu": [],
  "Fri": [
    { id: "6", platform: "youtube", time: "12:00 PM", type: "Video", title: "Full Stack Masterclass", optimal: true },
  ],
  "Sat": [
    { id: "7", platform: "instagram", time: "01:30 PM", type: "Story", title: "Behind the scenes", optimal: false },
  ],
  "Sun": [
    { id: "8", platform: "twitter", time: "11:00 AM", type: "Thread", title: "Weekly recap & thoughts", optimal: true },
  ],
};

const getPlatformIcon = (platform: string) => {
  switch (platform) {
    case "instagram": return <Camera size={14} className="text-pink-400" />;
    case "youtube": return <PlayCircle size={14} className="text-red-400" />;
    case "twitter": return <MessageCircle size={14} className="text-zinc-300" />;
    default: return <Zap size={14} className="text-cyan-400" />;
  }
};

const getPlatformColor = (platform: string) => {
  switch (platform) {
    case "instagram": return "border-pink-500/30 bg-pink-500/10";
    case "youtube": return "border-red-500/30 bg-red-500/10";
    case "twitter": return "border-zinc-500/30 bg-zinc-500/10";
    default: return "border-cyan-500/30 bg-cyan-500/10";
  }
};

export default function CalendarPage() {
  const [expanded, setExpanded] = useState(false);
  const [schedule, setSchedule] = useState<WeeklySchedule>(emptySchedule);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from database on mount
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const userStr = localStorage.getItem("user");
        const userId = userStr ? JSON.parse(userStr).id : "";
        const res = await fetch(`https://neurosocialai.onrender.com/api/schedule${userId ? `?userId=${userId}` : ''}`);
        if (res.ok) {
          const data = await res.json();
          setSchedule(data);
        }
      } catch (err) {
        console.error("Failed to fetch schedule:", err);
      } finally {
        setIsLoaded(true);
      }
    };
    fetchSchedule();
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setSchedule(emptySchedule); // Clear current
    try {
      const userStr = localStorage.getItem("user");
      const userId = userStr ? JSON.parse(userStr).id : "";
      const res = await fetch(`https://neurosocialai.onrender.com/api/schedule/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId })
      });
      if (res.ok) {
        const data = await res.json();
        setSchedule(data);
      }
    } catch (err) {
      console.error("Failed to generate schedule:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="min-h-screen flex relative overflow-hidden">
      {/* BACKGROUND GLOW */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
        <div className="absolute top-[-200px] left-[-150px] w-[500px] h-[500px] bg-emerald-500/10 blur-[140px] rounded-full" />
        <div className="absolute bottom-[-250px] right-[-200px] w-[500px] h-[500px] bg-blue-500/10 blur-[160px] rounded-full" />
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
            
            {/* HEADER */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
              <div>
                <p className="theme-muted uppercase tracking-[0.25em] text-sm mb-4 flex items-center gap-2">
                  <CalendarIcon size={16} /> Automation
                </p>
                <h1 className="text-4xl md:text-5xl font-bold leading-tight theme-text mb-4">
                  AI Content Scheduler
                </h1>
                <p className="theme-muted text-base max-w-2xl leading-relaxed">
                  Let the AI determine the absolute optimal times to post your content across platforms based on your audience's historical activity.
                </p>
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold flex items-center gap-3 hover:scale-105 transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] disabled:opacity-50 disabled:hover:scale-100"
              >
                {isGenerating ? (
                  <>
                    <Zap size={20} className="animate-pulse" /> Optimizing Timeline...
                  </>
                ) : (
                  <>
                    <Wand2 size={20} /> Generate AI Schedule
                  </>
                )}
              </button>
            </div>

            {/* WEEKLY GRID */}
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
              {Object.keys(schedule).map((day) => (
                <div key={day} className="flex flex-col gap-4">
                  {/* Day Header */}
                  <div className="text-center p-3 rounded-xl bg-black/5 dark:bg-white/[0.02] border border-black/10 dark:border-white/5">
                    <h3 className="font-bold theme-text tracking-wide">{day}</h3>
                  </div>

                  {/* Posts Container */}
                  <div className="flex flex-col gap-3 min-h-[300px] p-2 rounded-2xl bg-black/20 border border-white/[0.02]">
                    {schedule[day].length === 0 && !isGenerating && (
                      <div className="flex-1 flex items-center justify-center">
                        <span className="theme-muted text-sm font-mono">- Empty -</span>
                      </div>
                    )}
                    
                    {schedule[day].map((post) => (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={post.id}
                        className={`p-3 rounded-xl border ${getPlatformColor(post.platform)} backdrop-blur-md shadow-lg relative group overflow-hidden`}
                      >
                        {post.optimal && (
                          <div className="absolute top-0 right-0 p-1 bg-emerald-500/20 rounded-bl-lg">
                            <Sparkles size={10} className="text-emerald-400" />
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2 mb-2">
                          {getPlatformIcon(post.platform)}
                          <span className="text-xs font-bold theme-text capitalize">{post.type}</span>
                        </div>
                        
                        <p className="text-sm theme-muted font-medium mb-3 truncate" title={post.title}>
                          {post.title}
                        </p>
                        
                        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-black/70 dark:text-zinc-400 bg-white/40 dark:bg-black/40 px-2 py-1 rounded-md w-fit">
                          <Clock size={12} />
                          {post.time}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* LEGEND */}
            <div className="mt-8 flex items-center gap-6 pt-8 border-t border-black/10 dark:border-white/5">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-emerald-400" />
                <span className="text-sm theme-muted">AI Optimal Time</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-pink-500/50" />
                <span className="text-sm theme-muted">Instagram</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <span className="text-sm theme-muted">YouTube</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-zinc-500/50" />
                <span className="text-sm theme-muted">Twitter / X</span>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
