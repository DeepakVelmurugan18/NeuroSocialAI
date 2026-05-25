"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Sidebar from "../../../components/Sidebar";
import Topbar from "../../../components/Topbar";
import { PlayCircle, Camera, MessageCircle, Users, Link as LinkIcon, CheckCircle2, ShieldAlert, Eye } from "lucide-react";

function SettingsContent() {
  const [expanded, setExpanded] = useState(false);

  const [connected, setConnected] = useState({
    instagram: false,
    youtube: false,
    twitter: false,
    facebook: false,
  });

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // 1. Fetch initial states from database so they persist after refresh
    const fetchStatus = async () => {
      try {
        const userStr = localStorage.getItem("user");
        const userId = userStr ? JSON.parse(userStr).id : "";
        const res = await fetch(`https://neurosocialai.onrender.com/api/stats${userId ? `?userId=${userId}` : ''}`);
        if (res.ok) {
          const data = await res.json();
          setConnected((prev) => ({
            ...prev,
            youtube: data.youtube?.connected || false,
            facebook: data.facebook?.connected || false,
            instagram: data.instagram?.connected || false,
          }));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchStatus();

    // 2. Also check URL parameters in case we just came back from an OAuth redirect
    const ytStatus = searchParams.get("youtube");
    const fbStatus = searchParams.get("facebook");
    const igStatus = searchParams.get("instagram");
    
    let updated = false;
    const nextConnected = { ...connected };

    if (ytStatus === "connected") {
      nextConnected.youtube = true;
      updated = true;
    } else if (ytStatus === "error") {
      alert("Failed to connect YouTube account.");
    }

    if (fbStatus === "connected") {
      nextConnected.facebook = true;
      updated = true;
    } else if (fbStatus === "error") {
      alert("Failed to connect Facebook account.");
    }

    if (igStatus === "connected") {
      nextConnected.instagram = true;
      updated = true;
    } else if (igStatus === "error") {
      alert("Failed to connect Instagram account.");
    }

    if (updated) {
      setConnected((prev) => ({ ...prev, ...nextConnected }));
    }
  }, [searchParams, router, pathname]);

  const toggleConnection = async (platform: keyof typeof connected) => {
    // If we are disconnecting
    if (connected[platform]) {
      try {
        const userStr = localStorage.getItem("user");
        const userId = userStr ? JSON.parse(userStr).id : "";
        await fetch(`https://neurosocialai.onrender.com/api/auth/disconnect/${platform}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId })
        });
      } catch (err) {
        console.error(err);
      }
    }
    
    setConnected((prev) => ({
      ...prev,
      [platform]: !prev[platform],
    }));
  };

  const handleConnect = async (platform: string) => {
    if (!connected[platform as keyof typeof connected]) {
      const userStr = localStorage.getItem("user");
      const userId = userStr ? JSON.parse(userStr).id : "";
      window.location.href = `https://neurosocialai.onrender.com/api/auth/${platform}?userId=${userId}&t=${Date.now()}`;
    } else {
      toggleConnection(platform as keyof typeof connected);
    }
  };

  const platforms = [
    {
      id: "facebook",
      name: "Facebook Page",
      icon: Users,
      description: "Connect Facebook to track Page Followers and engagement.",
      color: "from-blue-500 to-blue-600",
      iconColor: "text-blue-400",
    },
    {
      id: "instagram",
      name: "Instagram Professional",
      icon: Eye,
      description: "Connect Instagram via Meta Graph API to track followers and media.",
      color: "from-fuchsia-500 to-pink-500",
      iconColor: "text-pink-400",
    },
    {
      id: "youtube",
      name: "YouTube",
      icon: PlayCircle,
      description: "Connect to track Subscribers, Watch Time, and Video retention.",
      color: "from-red-500 to-rose-500",
      iconColor: "text-red-400",
    },
    {
      id: "twitter",
      name: "Twitter / X",
      icon: MessageCircle,
      description: "Connect to track Impressions, Retweets, and Thread performance.",
      color: "from-zinc-400 to-zinc-600",
      iconColor: "text-zinc-300",
    },
  ] as const;

  return (
    <main className="min-h-screen flex relative overflow-hidden">
      {/* BACKGROUND GLOW */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
        <div className="absolute top-[-200px] right-[-150px] w-[500px] h-[500px] bg-purple-500/10 blur-[140px] rounded-full" />
        <div className="absolute bottom-[-250px] left-[-200px] w-[500px] h-[500px] bg-cyan-500/10 blur-[160px] rounded-full" />
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
            <div className="mb-10">
              <p className="theme-muted uppercase tracking-[0.25em] text-sm mb-4">
                Configuration
              </p>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight theme-text mb-4">
                Platform Integrations
              </h1>
              <p className="theme-muted text-base max-w-2xl leading-relaxed">
                Connect your official social media accounts to enable live, real-time tracking. Our AI requires read-only access to analyze your analytics correctly.
              </p>
            </div>

            {/* INTEGRATIONS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {platforms.map((platform) => {
                const Icon = platform.icon;
                const isConnected = connected[platform.id as keyof typeof connected];

                return (
                  <div
                    key={platform.id}
                    className={`
                      relative overflow-hidden rounded-3xl border p-6 transition-all duration-300
                      ${isConnected ? "bg-black/5 dark:bg-white/[0.04] border-emerald-500/30" : "bg-black/5 dark:bg-white/[0.02] border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/[0.04]"}
                    `}
                  >
                    {/* Background gradient if connected */}
                    {isConnected && (
                      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${platform.color} opacity-10 blur-3xl`} />
                    )}

                    <div className="flex items-start justify-between mb-4 relative z-10">
                      <div className={`w-14 h-14 rounded-2xl bg-black/5 dark:bg-black/40 border border-black/10 dark:border-white/5 flex items-center justify-center shadow-lg`}>
                        <Icon size={28} className={platform.iconColor} />
                      </div>
                      
                      {isConnected ? (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                          <CheckCircle2 size={14} className="text-emerald-400" />
                          <span className="text-xs font-semibold text-emerald-400">Connected</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-500/10 border border-zinc-500/20">
                          <ShieldAlert size={14} className="text-zinc-400" />
                          <span className="text-xs font-semibold text-zinc-400">Not Connected</span>
                        </div>
                      )}
                    </div>

                    <h3 className="text-xl font-bold theme-text mb-2 relative z-10">
                      {platform.name}
                    </h3>
                    <p className="text-sm theme-muted leading-relaxed mb-6 h-10 relative z-10">
                      {platform.description}
                    </p>

                    <button
                      onClick={() => handleConnect(platform.id)}
                      className={`
                        w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 relative z-10
                        ${isConnected 
                          ? "bg-black/5 dark:bg-white/5 theme-muted hover:bg-red-500/10 hover:text-red-500 dark:hover:text-red-400 border border-black/10 dark:border-white/5" 
                          : `bg-gradient-to-r ${platform.color} text-white shadow-lg hover:scale-[1.02]`}
                      `}
                    >
                      {isConnected ? "Disconnect Account" : (
                        <>
                          <LinkIcon size={16} />
                          Connect {platform.name}
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* UPGRADE PROMPT */}
            <div className="mt-12 p-8 rounded-3xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold theme-text mb-2">Need more platforms?</h3>
                <p className="theme-muted text-sm max-w-md leading-relaxed">
                  Upgrade to the NeuroSocial Enterprise plan to unlock TikTok, LinkedIn, and Pinterest AI tracking.
                </p>
              </div>
              <button className="px-6 py-3 rounded-xl bg-black dark:bg-white text-white dark:text-black font-bold text-sm hover:scale-105 transition-all shadow-xl shrink-0">
                Upgrade to Enterprise
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center theme-text">Loading settings...</div>}>
      <SettingsContent />
    </Suspense>
  );
}
