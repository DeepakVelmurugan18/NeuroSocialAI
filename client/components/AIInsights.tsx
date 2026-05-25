"use client";

import { motion } from "framer-motion";

import {
  Sparkles,
  TrendingUp,
  Clock3,
  Film,
  Users,
} from "lucide-react";

const insights = [

  {
    title: "Engagement Surge",
    value: "+24%",
    description:
      "Your Instagram engagement increased significantly this week.",
    icon: TrendingUp,
    glow: "from-cyan-500/20 to-blue-500/5",
    iconColor: "text-cyan-400",
    border: "border-cyan-500/20",
  },

  {
    title: "Best Posting Time",
    value: "8:30 PM",
    description:
      "AI detected maximum audience activity during evening hours.",
    icon: Clock3,
    glow: "from-purple-500/20 to-pink-500/5",
    iconColor: "text-purple-400",
    border: "border-purple-500/20",
  },

  {
    title: "Reel Performance",
    value: "+41%",
    description:
      "Short-form video content is outperforming static posts.",
    icon: Film,
    glow: "from-emerald-500/20 to-green-500/5",
    iconColor: "text-emerald-400",
    border: "border-emerald-500/20",
  },

  {
    title: "Audience Growth",
    value: "+12%",
    description:
      "Your audience growth trend is accelerating this month.",
    icon: Users,
    glow: "from-orange-500/20 to-yellow-500/5",
    iconColor: "text-orange-400",
    border: "border-orange-500/20",
  },

];

export default function AIInsights() {

  return (

    <section className="mt-12">

      {/* HEADER */}

      <div
        className="
          flex
          items-center
          justify-between
          mb-8
        "
      >

        {/* LEFT */}

        <div>

          <div
            className="
              flex
              items-center
              gap-3
              mb-3
            "
          >

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
                size={22}
                className="
                  text-cyan-400
                "
              />

            </div>

            <div>

              <h2
                className="
                  text-3xl
                  font-bold
                  theme-text
                "
              >

                AI Insights

              </h2>

              <p
                className="
                  theme-muted
                  text-sm
                  mt-1
                "
              >

                Real-time intelligence powered by NeuroSocial AI

              </p>

            </div>

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

            Live AI Tracking

          </span>

        </div>

      </div>

      {/* INSIGHT CARDS */}

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-4
          gap-6
        "
      >

        {insights.map(
          (
            insight,
            index
          ) => {

            const Icon =
              insight.icon;

            return (

              <motion.div
                key={index}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay:
                    index * 0.1,
                }}
                whileHover={{
                  y: -6,
                }}
                className={`
                  relative
                  overflow-hidden
                  rounded-[30px]
                  border
                  ${insight.border}
                  theme-card
                  p-6
                  shadow-lg
                `}
              >

                {/* GLOW */}

                <div
                  className={`
                    absolute
                    inset-0
                    bg-gradient-to-br
                    ${insight.glow}
                    opacity-60
                    pointer-events-none
                  `}
                />

                {/* CONTENT */}

                <div className="relative z-10">

                  {/* TOP */}

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      mb-6
                    "
                  >

                    {/* ICON */}

                    <div
                      className={`
                        w-14
                        h-14
                        rounded-2xl
                        border
                        flex
                        items-center
                        justify-center
                        bg-black/20
                        ${insight.border}
                      `}
                    >

                      <Icon
                        size={24}
                        className={
                          insight.iconColor
                        }
                      />

                    </div>

                    {/* STATUS */}

                    <div
                      className="
                        flex
                        items-center
                        gap-2
                      "
                    >

                      <div
                        className="
                          w-2
                          h-2
                          rounded-full
                          bg-cyan-400
                          animate-pulse
                        "
                      />

                      <span
                        className="
                          text-xs
                          theme-muted
                        "
                      >

                        Live

                      </span>

                    </div>

                  </div>

                  {/* TITLE */}

                  <p
                    className="
                      theme-muted
                      text-sm
                      mb-3
                    "
                  >

                    {insight.title}

                  </p>

                  {/* VALUE */}

                  <h3
                    className="
                      text-3xl
                      md:text-4xl
                      font-black
                      mb-4
                      theme-text
                    "
                  >

                    {insight.value}

                  </h3>

                  {/* DESCRIPTION */}

                  <p
                    className="
                      theme-muted
                      text-sm
                      leading-7
                    "
                  >

                    {insight.description}

                  </p>

                </div>

              </motion.div>

            );

          }
        )}

      </div>

    </section>

  );

}