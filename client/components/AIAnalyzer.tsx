"use client";

import { useState } from "react";

import axios from "axios";

import {
  Sparkles,
  Wand2,
  BrainCircuit,
  TrendingUp,
  MessageSquareText,
  Rocket,
} from "lucide-react";

export default function AIAnalyzer({ platform = "general" }: { platform?: string }) {

  const [content, setContent] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [result, setResult] =
    useState("");

  const analyzeContent =
    async () => {

      if (!content.trim()) {

        return alert(
          "Please enter content first."
        );

      }

      try {

        setLoading(true);

        setResult("");

        const userStr = localStorage.getItem("user");
        const userId = userStr ? JSON.parse(userStr).id : undefined;

        const res =
          await axios.post(
            `http://${window.location.hostname}:5000/api/analyze`,
            {
              content,
              userId,
              platform
            }
          );

        setResult(
          res.data.analysis
        );

        window.dispatchEvent(new Event("analysis-updated"));

      } catch (error) {

        console.log(error);

        alert(
          "AI analysis failed"
        );

      } finally {

        setLoading(false);

      }

    };

  return (

    <div
      className="
        relative
        overflow-hidden
        theme-card
        rounded-[24px]
        md:rounded-[36px]
        border
        border-white/10
        p-5
        md:p-8
        shadow-[0_0_60px_rgba(0,255,255,0.04)]
      "
    >

      {/* BACKGROUND GLOW */}

      <div
        className="
          absolute
          top-[-120px]
          right-[-120px]
          w-[260px]
          h-[260px]
          bg-cyan-500/10
          blur-3xl
          rounded-full
          pointer-events-none
        "
      />

      {/* HEADER */}

      <div
        className="
          flex
          flex-col
          md:flex-row
          items-start
          md:items-center
          justify-between
          gap-4
          md:gap-6
          relative
          z-10
        "
      >

        {/* LEFT */}

        <div
          className="
            flex
            items-center
            gap-4
          "
        >

          {/* ICON */}

          <div
            className="
              w-14
              h-14
              shrink-0
              rounded-3xl
              bg-cyan-500/10
              border
              border-cyan-500/20
              flex
              items-center
              justify-center
              shadow-lg
            "
          >

            <BrainCircuit
              size={28}
              className="
                text-cyan-400
              "
            />

          </div>

          {/* TEXT */}

          <div>

            <h2
              className="
                text-2xl
                md:text-3xl
                font-black
                theme-text
              "
            >
              {
                platform === "instagram" ? "Instagram Content Analyzer" : 
                platform === "youtube" ? "YouTube Script Analyzer" :
                platform === "twitter" ? "Twitter Thread Analyzer" :
                platform === "facebook" ? "Facebook Post Analyzer" :
                "AI Content Analyzer"
              }
            </h2>

            <p
              className="
                theme-muted
                mt-2
                text-sm
              "
            >

              Analyze captions, tweets,
              reels, hooks, and viral
              social content instantly.

            </p>

          </div>

        </div>

        {/* STATUS */}

        <div
          className="
            hidden
            md:flex
            items-center
            gap-2
            px-4
            py-2
            rounded-2xl
            bg-emerald-500/10
            border
            border-emerald-500/20
          "
        >

          <div
            className="
              w-2.5
              h-2.5
              rounded-full
              bg-emerald-400
              animate-pulse
            "
          />

          <span
            className="
              text-sm
              font-medium
              text-emerald-400
            "
          >

            AI Active

          </span>

        </div>

      </div>

      {/* ANALYZER BOX */}

      <div
        className="
          mt-8
          relative
          z-10
        "
      >

        {/* TEXTAREA */}

        <div
          className="
            relative
          "
        >

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              platform === "instagram" ? "Paste your Instagram caption, Reel hook, or carousel text here..." : 
              platform === "youtube" ? "Paste your YouTube video script, title, or Shorts idea here..." :
              platform === "twitter" ? "Paste your tweet, thread, or idea here..." :
              platform === "facebook" ? "Paste your Facebook post or ad copy here..." :
              "Paste your social media content here..."
            }
            className="
              w-full
              h-[220px]
              rounded-[24px]
              bg-black/20
              border-2
              border-white/10
              focus:border-cyan-500/50
              focus:bg-black/40
              focus:shadow-[0_0_30px_rgba(6,182,212,0.15)]
              transition-all
              duration-300
              p-5
              md:p-7
              theme-text
              placeholder:text-zinc-600
              outline-none
              resize-none
              leading-8
              text-[16px]
              backdrop-blur-xl
            "
          />



        </div>

        {/* ACTIONS */}

        <div
          className="
            flex
            items-center
            justify-between
            mt-6
            gap-4
            flex-wrap
          "
        >

          {/* FEATURES */}

          <div
            className="
              flex
              items-center
              gap-3
              flex-wrap
            "
          >

            <div
              className="
                px-4
                py-2
                rounded-2xl
                bg-white/[0.03]
                border
                border-white/10
                flex
                items-center
                gap-2
              "
            >

              <TrendingUp
                size={16}
                className="
                  text-cyan-400
                "
              />

              <span
                className="
                  text-sm
                  theme-muted
                "
              >

                Viral Score

              </span>

            </div>

            <div
              className="
                px-4
                py-2
                rounded-2xl
                bg-white/[0.03]
                border
                border-white/10
                flex
                items-center
                gap-2
              "
            >

              <MessageSquareText
                size={16}
                className="
                  text-purple-400
                "
              />

              <span
                className="
                  text-sm
                  theme-muted
                "
              >

                Hook Analysis

              </span>

            </div>

            <div
              className="
                px-4
                py-2
                rounded-2xl
                bg-white/[0.03]
                border
                border-white/10
                flex
                items-center
                gap-2
              "
            >

              <Rocket
                size={16}
                className="
                  text-emerald-400
                "
              />

              <span
                className="
                  text-sm
                  theme-muted
                "
              >

                Growth Insights

              </span>

            </div>

          </div>

          {/* BUTTON */}

          <button
            onClick={
              analyzeContent
            }
            disabled={loading}
            className="
              w-full
              md:w-auto
              px-6
              md:px-8
              py-4
              rounded-2xl
              bg-gradient-to-r
              from-cyan-500
              to-blue-500
              text-white
              font-semibold
              flex
              items-center
              gap-3
              hover:scale-[1.02]
              transition-all
              duration-300
              shadow-lg
              shadow-cyan-500/20
              disabled:opacity-50
            "
          >

            <Wand2 size={18} />

            {loading
              ? "Analyzing..."
              : "Analyze with AI"}

          </button>

        </div>

      </div>

      {/* RESULT */}

      {result && (

        <div
          className="
            mt-10
            relative
            z-10
            rounded-[32px]
            bg-white/[0.03]
            border
            border-white/10
            p-7
            overflow-hidden
          "
        >

          {/* RESULT GLOW */}

          <div
            className="
              absolute
              top-[-100px]
              right-[-100px]
              w-[220px]
              h-[220px]
              bg-cyan-500/10
              blur-3xl
              rounded-full
              pointer-events-none
            "
          />

          {/* HEADER */}

          <div
            className="
              flex
              items-center
              gap-3
              mb-6
              relative
              z-10
            "
          >

            <div
              className="
                w-12
                h-12
                shrink-0
                rounded-2xl
                bg-cyan-500/10
                border
                border-cyan-500/20
                flex
                items-center
                justify-center
              "
            >

              <Sparkles
                size={22}
                className="
                  text-cyan-400
                "
              />

            </div>

            <div>

              <h3
                className="
                  text-2xl
                  font-bold
                  theme-text
                "
              >

                AI Analysis Result

              </h3>

              <p
                className="
                  theme-muted
                  text-sm
                  mt-1
                "
              >

                Generated by NeuroSocial AI

              </p>

            </div>

          </div>

          {/* RESULT CONTENT */}

          <div
            className="
              relative
              z-10
              theme-text
              leading-8
              whitespace-pre-line
            "
          >

            {result}

          </div>

        </div>

      )}

    </div>

  );

}