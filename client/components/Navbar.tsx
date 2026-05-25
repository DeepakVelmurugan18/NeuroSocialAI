"use client";

import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <div className="fixed top-6 left-0 w-full z-50 flex justify-center pointer-events-none">
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-[95%] max-w-7xl backdrop-blur-2xl bg-black/40 border border-white/10 rounded-full shadow-[0_4px_30px_rgba(0,0,0,0.1)] pointer-events-auto"
      >
      <div className="px-6 py-3 flex items-center justify-between">

        {/* Logo */}
        <h1 className="text-xl md:text-2xl font-black tracking-tighter">
          <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">NeuroSocial AI</span>
        </h1>

        {/* Navigation */}
        <div className="flex items-center gap-6 text-sm text-zinc-300 font-medium">

          <motion.a
            whileHover={{ y: -2, color: "#fff" }}
            href="#features"
            className="hidden md:block transition-colors"
          >
            Features
          </motion.a>

          <motion.a
            whileHover={{ y: -2, color: "#fff" }}
            href="/dashboard"
            className="hidden md:block transition-colors"
          >
            Analytics
          </motion.a>

          <motion.a
            whileHover={{ y: -2, color: "#fff" }}
            href="/dashboard/meta"
            className="hidden md:block transition-colors"
          >
            AI Tools
          </motion.a>

          {/* Button */}
          <motion.a
            href="/register"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2.5 rounded-full bg-white text-black font-bold shadow-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all ml-2"
          >
            Get Started
          </motion.a>

        </div>
      </div>
      </motion.nav>
    </div>
  );
}