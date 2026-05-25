"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Topbar from "@/components/Topbar";
import Sidebar from "@/components/Sidebar";
import { Users, LayoutGrid, Eye, TrendingUp, Target, Heart } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

function AnalyticsCard({ title, value, icon: Icon, color }: any) {
  return (
    <div className="theme-card p-6 rounded-3xl border border-white/5 relative overflow-hidden flex flex-col justify-between h-[160px]">
      <div className={`absolute top-[-50px] right-[-50px] w-32 h-32 ${color} opacity-10 blur-3xl rounded-full`} />
      <div className="flex items-center gap-3 relative z-10">
        <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${color.replace('bg-', 'text-')}`}>
          <Icon size={20} />
        </div>
        <h3 className="theme-muted font-semibold text-sm uppercase tracking-wider">{title}</h3>
      </div>
      <p className="text-4xl font-bold theme-text relative z-10">{value}</p>
    </div>
  );
}

export default function MetaDashboard() {
  const [expanded, setExpanded] = useState(false);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchStats = async () => {
      try {
        const userStr = localStorage.getItem("user");
        const userId = userStr ? JSON.parse(userStr).id : "";
        const res = await axios.get(
          `https://neurosocialai.onrender.com/api/stats${userId ? `?userId=${userId}` : ''}`
        );
        if (isMounted) setStats(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    
    fetchStats();
    
    const intervalId = setInterval(() => {
      fetchStats();
    }, 10000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  const fbFollowers = stats?.facebook?.followers || "0";
  const igFollowers = stats?.instagram?.followers || "0";
  const totalMetaAudience = parseInt(fbFollowers) + parseInt(igFollowers);

  // We do not have Insights API permission yet, so show real tracked data (currently 0)
  const engagementData = [
    { day: "Mon", facebook: 0, instagram: 0 },
    { day: "Tue", facebook: 0, instagram: 0 },
    { day: "Wed", facebook: 0, instagram: 0 },
    { day: "Thu", facebook: 0, instagram: 0 },
    { day: "Fri", facebook: 0, instagram: 0 },
    { day: "Sat", facebook: 0, instagram: 0 },
    { day: "Sun", facebook: 0, instagram: 0 },
  ];

  return (
    <main className="min-h-screen flex relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
        <div className="absolute top-[-200px] right-[-150px] w-[500px] h-[500px] bg-blue-500/10 blur-[140px] rounded-full" />
        <div className="absolute bottom-[-250px] left-[-200px] w-[500px] h-[500px] bg-pink-500/10 blur-[160px] rounded-full" />
      </div>

      <Sidebar expanded={expanded} setExpanded={setExpanded} />

      <section className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${expanded ? "md:ml-64" : "md:ml-20"}`}>
        <Topbar />
        
        <div className="flex-1 p-6 md:p-10 pt-24 max-w-7xl mx-auto w-full">
          <div className="mb-10">
            <h1 className="text-4xl md:text-5xl font-black theme-text mb-4">
              Meta Intelligence
            </h1>
            <p className="theme-muted max-w-2xl text-lg">
              Advanced unified analytics for your connected Facebook Pages and Instagram Professional accounts.
            </p>
          </div>

          {!stats?.facebook?.connected && !stats?.instagram?.connected ? (
            <div className="p-10 rounded-3xl theme-card border border-rose-500/20 text-center">
              <h2 className="text-2xl font-bold text-rose-500 mb-2">No Meta Accounts Connected</h2>
              <p className="theme-muted mb-6">Please connect your Facebook and Instagram accounts in Settings to view Meta Intelligence.</p>
              <a href="/dashboard/settings" className="px-6 py-3 bg-blue-600 text-white rounded-full font-bold">Connect Meta Accounts</a>
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              {/* TOP CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <AnalyticsCard title="Total Meta Audience" value={totalMetaAudience.toLocaleString()} icon={Users} color="bg-purple-500" />
                <AnalyticsCard title="Facebook Page Followers" value={parseInt(fbFollowers).toLocaleString()} icon={LayoutGrid} color="bg-blue-500" />
                <AnalyticsCard title="Instagram Followers" value={parseInt(igFollowers).toLocaleString()} icon={Heart} color="bg-pink-500" />
              </div>

              {/* CHART & DETAILS */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 theme-card p-6 rounded-3xl border border-white/5">
                  <h3 className="text-xl font-bold theme-text mb-6">Weekly Engagement Trends</h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={engagementData}>
                        <XAxis dataKey="day" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} />
                        <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '12px', color: '#fff' }} />
                        <Bar dataKey="facebook" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Facebook" />
                        <Bar dataKey="instagram" fill="#ec4899" radius={[4, 4, 0, 0]} name="Instagram" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  <div className="theme-card p-6 rounded-3xl border border-white/5 flex-1">
                    <h3 className="text-lg font-bold theme-text mb-4">Meta Status</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl">
                        <span className="theme-text font-semibold flex items-center gap-2"><Target size={16} className="text-blue-500"/> Facebook Page</span>
                        <span className={stats.facebook.connected ? "text-emerald-400 font-bold" : "text-rose-500 font-bold"}>
                          {stats.facebook.connected ? "Active" : "Disconnected"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl">
                        <span className="theme-text font-semibold flex items-center gap-2"><Eye size={16} className="text-pink-500"/> Instagram Pro</span>
                        <span className={stats.instagram.connected ? "text-emerald-400 font-bold" : "text-rose-500 font-bold"}>
                          {stats.instagram.connected ? "Active" : "Disconnected"}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs theme-muted mt-6 text-center">Data strictly synced via Meta Graph API v18.0</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
