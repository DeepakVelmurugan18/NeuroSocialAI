"use client";

import { useState } from "react";
import Sidebar from "../../../components/Sidebar";
import Topbar from "../../../components/Topbar";
import { CreditCard, Zap, CheckCircle2, Shield, Download, Star } from "lucide-react";
import { jsPDF } from "jspdf";

export default function BillingPage() {
  const [expanded, setExpanded] = useState(false);

  const downloadInvoice = (date: string, amount: string) => {
    const doc = new jsPDF();
    
    doc.setFontSize(22);
    doc.text("NEUROSOCIAL AI - INVOICE", 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Date: ${date}`, 20, 40);
    doc.text(`Status: PAID`, 20, 50);
    doc.text(`Amount: ${amount}`, 20, 60);
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Description:", 20, 80);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text("NeuroSocial Premium Tier Subscription (1 Month)", 20, 90);
    doc.text("API Token Usage - 1,000,000 Limit", 20, 100);

    doc.save(`NeuroSocial_Invoice_${date.replace(/, /g, "_").replace(/ /g, "_")}.pdf`);
  };

  return (
    <main className="min-h-screen flex relative overflow-hidden">
      {/* BACKGROUND GLOW */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
        <div className="absolute top-[-200px] right-[-150px] w-[500px] h-[500px] bg-indigo-500/10 blur-[140px] rounded-full" />
        <div className="absolute bottom-[-250px] left-[-200px] w-[500px] h-[500px] bg-purple-500/10 blur-[160px] rounded-full" />
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
              <p className="theme-muted uppercase tracking-[0.25em] text-sm mb-4 flex items-center gap-2">
                <CreditCard size={16} /> Subscription
              </p>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight theme-text mb-4">
                Billing & Usage
              </h1>
              <p className="theme-muted text-base max-w-2xl leading-relaxed">
                Manage your NeuroSocial AI subscription, view your monthly token usage, and download past invoices.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* LEFT COLUMN: CURRENT PLAN & USAGE */}
              <div className="lg:col-span-2 flex flex-col gap-8">
                
                {/* Current Plan Card */}
                <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-3xl rounded-full pointer-events-none" />
                  
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider mb-4">
                        <Star size={14} /> Current Plan
                      </div>
                      <h2 className="text-3xl font-bold theme-text mb-2">Premium Tier</h2>
                      <p className="theme-muted">Advanced AI analytics & 5 platform integrations.</p>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-4xl font-black theme-text">$49<span className="text-lg theme-muted font-normal">/mo</span></div>
                      <p className="text-sm theme-muted mt-1">Renews on June 12, 2026</p>
                    </div>
                  </div>
                </div>

                {/* Usage Card */}
                <div className="p-8 rounded-3xl bg-black/5 dark:bg-white/[0.02] border border-black/10 dark:border-white/5">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold theme-text flex items-center gap-2">
                      <Zap size={20} className="text-yellow-400" /> API Token Usage
                    </h3>
                    <span className="text-sm font-bold theme-muted">82% Used</span>
                  </div>
                  
                  <div className="w-full h-4 bg-black/40 rounded-full overflow-hidden mb-4 border border-white/5">
                    <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full w-[82%] relative">
                      <div className="absolute top-0 right-0 bottom-0 left-0 bg-[url('/grid.svg')] opacity-20"></div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="theme-muted">820,000 tokens</span>
                    <span className="theme-muted">Limit: 1,000,000</span>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-black/10 dark:border-white/5">
                    <button className="text-sm font-bold theme-text hover:text-indigo-500 transition-colors">
                      + Buy extra 500k tokens ($10)
                    </button>
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN: INVOICES */}
              <div className="flex flex-col gap-6">
                <div className="p-8 rounded-3xl bg-black/5 dark:bg-white/[0.02] border border-black/10 dark:border-white/5 h-full">
                  <h3 className="text-xl font-bold theme-text mb-6 flex items-center gap-2">
                    <Shield size={20} className="theme-muted" /> Billing History
                  </h3>
                  
                  <div className="flex flex-col gap-4">
                    {[
                      { date: "May 12, 2026", amount: "$49.00", status: "Paid" },
                      { date: "Apr 12, 2026", amount: "$49.00", status: "Paid" },
                      { date: "Mar 12, 2026", amount: "$49.00", status: "Paid" },
                      { date: "Feb 12, 2026", amount: "$49.00", status: "Paid" },
                    ].map((invoice, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-black/5 dark:bg-black/20 border border-black/10 dark:border-white/5 group hover:border-indigo-500/30 transition-all">
                        <div>
                          <p className="text-sm font-bold theme-text">{invoice.date}</p>
                          <p className="text-xs text-emerald-500 dark:text-emerald-400 flex items-center gap-1 mt-1">
                            <CheckCircle2 size={12} /> {invoice.status}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-bold theme-text">{invoice.amount}</span>
                          <button 
                            onClick={() => downloadInvoice(invoice.date, invoice.amount)}
                            className="p-2 rounded-lg bg-black/5 dark:bg-white/5 theme-muted hover:text-indigo-500 hover:bg-indigo-500/10 dark:hover:text-indigo-400 dark:hover:bg-indigo-500/10 transition-all"
                          >
                            <Download size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
