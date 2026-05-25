"use client";

import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  Sparkles,
  Clock3,
} from "lucide-react";

export default function AnalysisHistory() {

  const [analyses, setAnalyses] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    fetchAnalyses();

    const handleUpdate = () => {
      fetchAnalyses();
    };

    window.addEventListener("analysis-updated", handleUpdate);

    return () => {
      window.removeEventListener("analysis-updated", handleUpdate);
    };

  }, []);

  const fetchAnalyses =
    async () => {

      try {

        const userStr = localStorage.getItem("user");
        const userId = userStr ? JSON.parse(userStr).id : "";

        const res =
          await axios.get(
            `http://${window.location.hostname}:5000/api/analyses${userId ? `?userId=${userId}` : ''}`
          );

        setAnalyses(
          res.data
        );

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };

  return (

    <div
      className="
        sticky
        top-8
      "
    >

      {/* CONTAINER */}

      <div
        className="
          theme-card
          rounded-3xl
          border
          border-black/10
          dark:border-white/10
          p-6
          shadow-xl
        "
      >

        {/* HEADER */}

        <div
          className="
            flex
            items-center
            justify-between
            mb-6
          "
        >

          <div>

            <h2
              className="
                text-2xl
                font-bold
                theme-text
              "
            >

              Recent Activity

            </h2>

            <p
              className="
                theme-muted
                text-sm
                mt-1
              "
            >

              Latest AI analyses

            </p>

          </div>

          <div
            className="
              w-12
              h-12
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
              size={20}
              className="
                text-cyan-400
              "
            />

          </div>

        </div>

        {/* LOADING */}

        {loading && (

          <div
            className="
              space-y-4
            "
          >

            {[1, 2, 3].map((i) => (

              <div
                key={i}
                className="
                  h-28
                  rounded-2xl
                  bg-white/[0.03]
                  animate-pulse
                "
              />

            ))}

          </div>

        )}

        {/* EMPTY */}

        {!loading &&
          analyses.length === 0 && (

          <div
            className="
              py-16
              text-center
            "
          >

            <div
              className="
                w-16
                h-16
                rounded-3xl
                bg-black/5
                dark:bg-white/[0.03]
                border
                border-black/10
                dark:border-white/10
                flex
                items-center
                justify-center
                mx-auto
                mb-5
              "
            >

              <Clock3
                size={28}
                className="
                  text-zinc-500
                "
              />

            </div>

            <h3
              className="
                text-lg
                font-semibold
                theme-text
                mb-2
              "
            >

              No analyses yet

            </h3>

            <p
              className="
                text-zinc-500
                text-sm
              "
            >

              Your AI reports will appear here.

            </p>

          </div>

        )}

        {/* LIST */}

        {!loading &&
          analyses.length > 0 && (

          <div
            className="
              space-y-4
              max-h-[700px]
              overflow-y-auto
              pr-1
            "
          >

            {analyses.map(
              (analysis) => (

                <div
                  key={analysis.id}
                  className="
                    rounded-3xl
                    p-5
                    bg-black/5
                    dark:bg-white/[0.03]
                    border
                    border-black/10
                    dark:border-white/10
                    hover:border-cyan-500/30
                    dark:hover:border-cyan-400/20
                    transition-all
                    duration-300
                  "
                >

                  {/* CONTENT */}

                  <p
                    className="
                      text-sm
                      leading-relaxed
                      theme-text
                      line-clamp-4
                    "
                  >

                    {analysis.content}

                  </p>

                  {/* TAGS */}

                  <div
                    className="
                      flex
                      flex-wrap
                      gap-2
                      mt-5
                    "
                  >

                    <div
                      className="
                        px-3
                        py-1
                        rounded-xl
                        bg-cyan-500/10
                        border
                        border-cyan-500/10
                        text-cyan-400
                        text-xs
                        font-medium
                      "
                    >

                      {analysis.viralScore}

                    </div>

                    <div
                      className="
                        px-3
                        py-1
                        rounded-xl
                        bg-black/10
                        dark:bg-white/[0.04]
                        border
                        border-black/10
                        dark:border-white/5
                        text-xs
                        theme-text
                      "
                    >

                      {analysis.sentiment}

                    </div>

                  </div>

                  {/* DATE */}

                  <p
                    className="
                      theme-muted
                      text-xs
                      mt-5
                    "
                  >

                    {new Date(
                      analysis.createdAt
                    ).toLocaleDateString()}

                  </p>

                </div>

              )
            )}

          </div>

        )}

      </div>

    </div>

  );

}