"use client";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, BrainCircuit, TrendingUp, Zap, ChevronRight } from "lucide-react";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#030303] text-white overflow-hidden font-sans">
      <Navbar />

      {/* DYNAMIC BACKGROUND EFFECTS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-[40%] right-[-10%] w-[700px] h-[700px] bg-cyan-600/15 rounded-full blur-[150px]"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[140px]"
        />
      </div>

      {/* HERO SECTION */}
      <section className="relative z-10 pt-40 pb-24 md:pt-56 md:pb-40 px-4 max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-purple-500/30 bg-purple-500/10 backdrop-blur-xl text-purple-300 text-sm font-semibold mb-8 shadow-[0_0_20px_rgba(168,85,247,0.15)]"
        >
          <Sparkles size={18} className="animate-pulse" />
          <span>The Future of Social Media Intelligence</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          className="text-6xl md:text-8xl lg:text-[7rem] font-black tracking-tighter mb-8 leading-[1.1]"
        >
          Grow your audience <br className="hidden md:block" />
          with <span className="text-transparent bg-clip-text bg-gradient-to-br from-purple-400 via-pink-400 to-cyan-400 animate-gradient-x">NeuroSocial AI</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="text-xl md:text-2xl text-zinc-400 max-w-3xl mb-12 leading-relaxed font-light"
        >
          Stop guessing the algorithm. Use our advanced AI to analyze your content, predict virality, and optimize your strategy across Instagram, YouTube, and Twitter.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto"
        >
          <Link
            href="/register"
            className="group w-full sm:w-auto px-10 py-5 rounded-full bg-white text-black font-bold text-lg hover:bg-zinc-100 transition-all flex items-center justify-center gap-3 shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)]"
          >
            Start for free 
            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto px-10 py-5 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl text-white font-semibold text-lg hover:bg-white/10 transition-all flex items-center justify-center hover:border-white/30"
          >
            Sign In
          </Link>
        </motion.div>
      </section>

      {/* DASHBOARD PREVIEW / MOCKUP */}
      <section className="relative z-10 px-4 max-w-6xl mx-auto -mt-10 mb-32 hidden md:block">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="rounded-3xl border border-white/10 bg-black/40 backdrop-blur-2xl p-4 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />
          <div className="rounded-2xl border border-white/5 bg-[#0a0a0a] h-[400px] w-full flex items-center justify-center overflow-hidden relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
            <div className="flex flex-col items-center gap-4">
              <BrainCircuit className="text-purple-500/50 w-24 h-24" />
              <p className="text-zinc-500 font-medium tracking-widest uppercase">Advanced AI Analytics Dashboard</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="relative z-10 py-32 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold mb-6 tracking-tight"
          >
            Everything you need to go <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500">viral</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-zinc-400 text-xl font-light"
          >
            Powerful features designed for modern creators and brands.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {/* Feature 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -10 }}
            transition={{ duration: 0.4 }}
            className="group p-10 rounded-[2.5rem] border border-white/5 bg-white/[0.02] backdrop-blur-xl hover:bg-white/[0.04] transition-all overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="w-16 h-16 rounded-3xl bg-purple-500/20 flex items-center justify-center mb-8 border border-purple-500/30 group-hover:scale-110 transition-transform duration-500">
              <BrainCircuit className="text-purple-400" size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-4 group-hover:text-purple-300 transition-colors">AI Content Analysis</h3>
            <p className="text-zinc-400 leading-relaxed text-lg font-light">
              Paste your caption, script, or tweet and let our AI instantly predict its viral potential and sentiment.
            </p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -10 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="group p-10 rounded-[2.5rem] border border-white/5 bg-white/[0.02] backdrop-blur-xl hover:bg-white/[0.04] transition-all overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="w-16 h-16 rounded-3xl bg-cyan-500/20 flex items-center justify-center mb-8 border border-cyan-500/30 group-hover:scale-110 transition-transform duration-500">
              <TrendingUp className="text-cyan-400" size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-4 group-hover:text-cyan-300 transition-colors">Multi-Platform Tracking</h3>
            <p className="text-zinc-400 leading-relaxed text-lg font-light">
              Unified analytics tracking for Instagram, YouTube, Twitter, and Facebook all in one beautiful dashboard.
            </p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -10 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="group p-10 rounded-[2.5rem] border border-white/5 bg-white/[0.02] backdrop-blur-xl hover:bg-white/[0.04] transition-all overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 flex items-center justify-center mb-8 border border-emerald-500/30 group-hover:scale-110 transition-transform duration-500">
              <Zap className="text-emerald-400" size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-4 group-hover:text-emerald-300 transition-colors">Actionable Strategies</h3>
            <p className="text-zinc-400 leading-relaxed text-lg font-light">
              Receive highly specific, algorithm-tailored advice and top-performing hashtags for your exact niche.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="relative z-10 py-32 px-4 max-w-5xl mx-auto text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="p-12 md:p-20 rounded-[3rem] bg-gradient-to-br from-purple-900/40 via-black to-cyan-900/40 border border-white/10 backdrop-blur-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tight">Ready to scale your social?</h2>
            <p className="text-zinc-300 text-xl md:text-2xl mb-12 max-w-2xl mx-auto font-light">
              Join thousands of creators using NeuroSocial AI to dominate the algorithm.
            </p>
            <Link
              href="/register"
              className="inline-block px-12 py-5 rounded-full bg-white text-black font-bold text-xl hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)]"
            >
              Create Your Free Account
            </Link>
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/5 py-12 text-center text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 gap-6">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xl text-white tracking-tighter">NeuroSocial AI</span>
          </div>
          <p className="text-sm">© {new Date().getFullYear()} NeuroSocial AI. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}