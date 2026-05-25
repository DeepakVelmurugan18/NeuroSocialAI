"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import {
  TrendingUp,
  Sparkles,
} from "lucide-react";

const data = [

  {
    day: "Mon",
    followers: 400,
    views: 1200,
  },
  {
    day: "Tue",
    followers: 800,
    views: 1800,
  },
  {
    day: "Wed",
    followers: 1200,
    views: 2900,
  },
  {
    day: "Thu",
    followers: 900,
    views: 2100,
  },
  {
    day: "Fri",
    followers: 1700,
    views: 4200,
  },
  {
    day: "Sat",
    followers: 2400,
    views: 5800,
  },
  {
    day: "Sun",
    followers: 3200,
    views: 7400,
  },
  {
    day: "Mon (Est)",
    predictedFollowers: 4500,
    predictedViews: 10200,
  },
  {
    day: "Tue (Est)",
    predictedFollowers: 6200,
    predictedViews: 14500,
  },
];

export default function GrowthChart({ 
  showFollowers = true,
  platform = "general"
}: { 
  showFollowers?: boolean;
  platform?: string;
}) {

  return (

    <div
      className="
        theme-card
        rounded-[34px]
        border
        border-white/10
        p-5
        md:p-8
        shadow-[0_0_50px_rgba(168,85,247,0.06)]
        overflow-hidden
        relative
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
          bg-purple-500/10
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
          md:gap-0
          mb-6
          md:mb-10
          relative
          z-10
        "
      >

        {/* LEFT */}

        <div>

          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            <div
              className="
                w-12
                h-12
                shrink-0
                rounded-2xl
                bg-purple-500/10
                border
                border-purple-500/20
                flex
                items-center
                justify-center
              "
            >

              <TrendingUp
                size={22}
                className="
                  text-purple-400
                "
              />

            </div>

            <div>

              <h2
                className="
                  text-2xl
                  font-bold
                  theme-text
                "
              >

                Weekly Growth Analytics

              </h2>

              <p
                className="
                  theme-muted
                  mt-1
                  text-sm
                "
              >

                AI powered audience tracking

              </p>

            </div>

          </div>

        </div>

        {/* RIGHT */}

        <div
          className="
            px-4
            py-2
            rounded-2xl
            bg-emerald-500/10
            border
            border-emerald-500/20
            flex
            items-center
            gap-2
          "
        >

          <Sparkles
            size={16}
            className="
              text-emerald-400
            "
          />

          <span
            className="
              text-sm
              font-medium
              text-emerald-400
            "
          >

            +28.4%

          </span>

        </div>

      </div>

      {/* CHART */}

      <div
        className="
          h-[250px]
          md:h-[360px]
          relative
          z-10
        "
      >

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <LineChart
            data={data}
          >

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.05)"
              vertical={false}
            />

            <XAxis
              dataKey="day"
              stroke="#71717a"
              tickLine={false}
              axisLine={false}
              dy={10}
              interval={0}
            />

            <YAxis
              stroke="#71717a"
              tickLine={false}
              axisLine={false}
              dx={-10}
            />

            <Tooltip
              contentStyle={{
                background: "rgba(15,15,15,0.95)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "18px",
                color: "#fff",
              }}
            />

            {showFollowers && (
              <>
                <Line
                  type="monotone"
                  dataKey="followers"
                  name={
                    platform === "instagram" ? "Instagram Followers" : 
                    platform === "youtube" ? "YouTube Subscribers" : 
                    platform === "twitter" ? "Twitter Followers" :
                    platform === "facebook" ? "Page Likes" :
                    "Audience Growth"
                  }
                  stroke="#a855f7"
                  strokeWidth={4}
                  dot={false}
                  activeDot={{ r: 7, fill: "#a855f7", stroke: "#ffffff", strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="predictedFollowers"
                  name="Predicted Audience"
                  stroke="#a855f7"
                  strokeWidth={4}
                  strokeDasharray="8 8"
                  dot={false}
                  opacity={0.6}
                />
              </>
            )}

            <Line
              type="monotone"
              dataKey="views"
              name={
                platform === "instagram" ? "Reel Views" : 
                platform === "youtube" ? "Shorts Views" :
                platform === "twitter" ? "Tweet Impressions" :
                platform === "facebook" ? "Post Reach" :
                "Content Views"
              }
              stroke="#06b6d4"
              strokeWidth={4}
              dot={false}
              activeDot={{ r: 7, fill: "#06b6d4", stroke: "#ffffff", strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="predictedViews"
              name="Predicted Reach"
              stroke="#06b6d4"
              strokeWidth={4}
              strokeDasharray="8 8"
              dot={false}
              opacity={0.6}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>

  );

}