"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Camera,
  PlaySquare,
  Globe,
  LayoutDashboard,
} from "lucide-react";

const platforms = [

  {
    name: "Overview",
    icon: LayoutDashboard,
    activeGlow: "from-purple-500 to-indigo-500",
    border: "border-purple-500/20",
    href: "/dashboard",
  },
  {
    name: "Instagram",
    icon: Camera,
    activeGlow: "from-pink-500 to-purple-500",
    border: "border-pink-500/20",
    href: "/dashboard/instagram",
  },
  {
    name: "YouTube",
    icon: PlaySquare,
    activeGlow: "from-red-500 to-rose-500",
    border: "border-red-500/20",
    href: "/dashboard/youtube",
  },
  {
    name: "Twitter/X",
    icon: null,
    activeGlow: "from-zinc-700 to-zinc-900",
    border: "border-white/10",
    href: "/dashboard/twitter",
  },
  {
    name: "Facebook",
    icon: Globe,
    activeGlow: "from-blue-500 to-cyan-500",
    border: "border-blue-500/20",
    href: "/dashboard/facebook",
  },

];

export default function PlatformTabs() {
  const pathname = usePathname();

  return (

    <div
      className="
        flex
        gap-4
        mb-10
        flex-wrap
      "
    >

      {platforms.map(
        (
          platform,
          index
        ) => {

          const Icon =
            platform.icon;

          const isActive = pathname === platform.href;

          return (

            <Link
              key={index}
              href={platform.href}
              className={`
                relative
                overflow-hidden
                px-4
                md:px-6
                py-2.5
                md:py-3.5
                rounded-xl
                md:rounded-2xl
                border
                backdrop-blur-xl
                transition-all
                duration-300
                flex
                items-center
                gap-3
                font-medium
                shadow-lg
                hover:scale-[1.03]

                ${
                  isActive

                    ? `
                      bg-gradient-to-r
                      ${platform.activeGlow}
                      text-white
                      border-transparent
                      shadow-[0_0_30px_rgba(59,130,246,0.25)]
                    `

                    : `
                      theme-card
                      ${platform.border}
                      theme-muted
                      hover:border-cyan-500/30
                      hover:text-white
                    `
                }
              `}
            >

              {isActive && (

                <div
                  className="
                    absolute
                    inset-0
                    bg-white/10
                    pointer-events-none
                  "
                />

              )}

              {Icon ? (

                <Icon
                  size={18}
                  className="
                    relative
                    z-10
                  "
                />

              ) : (

                <span
                  className="
                    relative
                    z-10
                    text-sm
                    font-bold
                  "
                >

                  X

                </span>

              )}

              <span
                className="
                  relative
                  z-10
                  text-sm
                "
              >

                {platform.name}

              </span>

              {isActive && (

                <div
                  className="
                    relative
                    z-10
                    w-2
                    h-2
                    rounded-full
                    bg-white
                  "
                />

              )}

            </Link>

          );

        }
      )}

    </div>

  );

}