"use client";

import { useEffect, useState, useRef } from "react";
import { Terminal, Activity, AlertCircle, TrendingUp, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SYSTEM_MESSAGES = [
  { type: "AI", text: "New viral trend matched in your niche.", icon: TrendingUp, color: "text-cyan-400" },
  { type: "SYS", text: "Spiking positive sentiment detected on latest Reel...", icon: Activity, color: "text-emerald-400" },
  { type: "ALERT", text: "Competitor engagement dropping by 14%.", icon: AlertCircle, color: "text-rose-400" },
  { type: "AI", text: "Optimal posting window detected in 45 mins.", icon: Zap, color: "text-purple-400" },
  { type: "SYS", text: "Aggregating multi-platform reach data...", icon: Terminal, color: "text-zinc-400" },
  { type: "AI", text: "Generating 3 personalized content hooks.", icon: BrainCircuit, color: "text-blue-400" },
];

// Helper to avoid importing BrainCircuit at the top if it causes issues, but we can just use Zap or another icon if needed.
import { BrainCircuit } from "lucide-react";

export default function ActivityFeed() {
  const [messages, setMessages] = useState<any[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial load
    setMessages([
      { id: 1, ...SYSTEM_MESSAGES[4], time: new Date().toLocaleTimeString() },
      { id: 2, ...SYSTEM_MESSAGES[1], time: new Date().toLocaleTimeString() }
    ]);

    // Randomly add messages to simulate live feed
    const interval = setInterval(() => {
      const randomMsg = SYSTEM_MESSAGES[Math.floor(Math.random() * SYSTEM_MESSAGES.length)];
      setMessages(prev => {
        const newMsgs = [...prev, { id: Date.now(), ...randomMsg, time: new Date().toLocaleTimeString() }];
        if (newMsgs.length > 5) return newMsgs.slice(newMsgs.length - 5);
        return newMsgs;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="theme-card rounded-3xl p-6 border border-white/5 bg-black/40 backdrop-blur-xl h-full flex flex-col relative overflow-hidden">
      {/* Background Grid/Glow */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10 relative z-10">
        <div className="flex items-center gap-3">
          <Terminal className="text-cyan-400" size={20} />
          <h3 className="font-mono text-sm tracking-wider uppercase text-cyan-400 font-bold">
            Live AI Feed
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-xs text-emerald-400 font-mono">MONITORING</span>
        </div>
      </div>

      {/* Feed Container */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-hidden flex flex-col justify-end relative z-10"
      >
        <div className="flex flex-col gap-3">
          <AnimatePresence initial={false}>
            {messages.map((msg) => {
              const Icon = msg.icon;
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, x: -20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5"
                >
                  <Icon size={16} className={`mt-0.5 ${msg.color} shrink-0`} />
                  <div className="flex-1 font-mono text-sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-bold ${msg.color}`}>[{msg.type}]</span>
                      <span className="text-[10px] text-zinc-500">{msg.time}</span>
                    </div>
                    <p className="text-zinc-300 leading-relaxed text-xs">
                      {msg.text}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
