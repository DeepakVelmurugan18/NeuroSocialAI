"use client";

import { useState } from "react";

import Sidebar from "../../../components/Sidebar";
import Topbar from "../../../components/Topbar";
import AnalysisHistory from "../../../components/AnalysisHistory";
import { jsPDF } from "jspdf";
import axios from "axios";

export default function HistoryPage() {

  const [expanded, setExpanded] =
    useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportHistory = async () => {
    setIsExporting(true);
    try {
      const userStr = localStorage.getItem("user");
      const userId = userStr ? JSON.parse(userStr).id : "";
      const res = await axios.get(
        `https://neurosocialai.onrender.com/api/analyses${userId ? `?userId=${userId}` : ''}`
      );
      
      const history = res.data;
      
      const doc = new jsPDF();
      doc.setFontSize(22);
      doc.text("NEUROSOCIAL AI", 105, 20, { align: "center" });
      doc.setFontSize(16);
      doc.text("Complete Analysis History", 105, 30, { align: "center" });
      
      doc.setLineWidth(0.5);
      doc.line(20, 35, 190, 35);
      
      doc.setFontSize(10);
      let y = 45;
      
      history.slice(0, 15).forEach((item: any, index: number) => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        
        doc.setFont("helvetica", "bold");
        doc.text(`[${index + 1}] Date: ${new Date(item.createdAt).toLocaleString()}`, 20, y);
        y += 6;
        
        doc.setFont("helvetica", "normal");
        const splitText = doc.splitTextToSize(`Content: ${item.content}`, 170);
        doc.text(splitText, 20, y);
        y += (splitText.length * 5) + 2;
        
        doc.setFont("helvetica", "italic");
        doc.text(`Viral Score: ${item.viralScore} | Sentiment: ${item.sentiment}`, 20, y);
        y += 12;
      });

      doc.save(`NeuroSocial_History_Report_${new Date().getTime()}.pdf`);
    } catch (error) {
      console.error(error);
      alert("Failed to export history.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <main className="min-h-screen flex">

      <Sidebar
        expanded={expanded}
        setExpanded={setExpanded}
      />

      <section
        className="
          flex-1
          p-4
          md:p-8
          transition-all
          duration-300
          max-lg:!ml-0
        "
        style={{
          marginLeft:
            expanded
              ? "250px"
              : "88px",
        }}
      >

        <Topbar />

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 theme-text">
              Analysis History
            </h1>
            <p className="theme-muted">
              All AI-generated reports.
            </p>
          </div>

          <button
            onClick={handleExportHistory}
            disabled={isExporting}
            className="px-6 py-3 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 border border-black/10 dark:border-white/20 theme-text font-bold transition-all shadow-lg flex items-center gap-2 shrink-0 disabled:opacity-50"
          >
            {isExporting ? "Exporting PDF..." : "Download History PDF"}
          </button>
        </div>

        <AnalysisHistory />

      </section>

    </main>
  );
}