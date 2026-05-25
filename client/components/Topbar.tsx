"use client";

import {
  Bell,
  Moon,
  Sun,
  Menu,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

export default function Topbar() {

  const [lightMode, setLightMode] =
    useState(false);

  useEffect(() => {

    const savedTheme =
      localStorage.getItem(
        "theme"
      );

    if (savedTheme === "light") {

      document.body.classList.add(
        "light-theme"
      );

      setLightMode(true);

    }

  }, []);


  const toggleTheme = () => {

    if (lightMode) {

      document.body.classList.remove(
        "light-theme"
      );

      localStorage.setItem(
        "theme",
        "dark"
      );

    } else {

      document.body.classList.add(
        "light-theme"
      );

      localStorage.setItem(
        "theme",
        "light"
      );

    }

    setLightMode(!lightMode);

  };


  return (

    <div
      className="
        flex
        flex-col-reverse
        md:flex-row
        items-stretch
        md:items-center
        justify-between
        gap-4
        md:gap-0
        mb-6
      "
    >

      {/* SEARCH */}

      <div
        className="
          theme-card
          h-[52px]
          md:h-[64px]
          w-full
          md:w-[320px]
          rounded-2xl
          md:rounded-3xl
          px-4
          md:px-6
          flex
          items-center
          gap-4
          border
          border-white/10
          shadow-lg
        "
      >

        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="theme-muted"
        >

          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
          />

        </svg>

        <input
          type="text"
          placeholder="Search analytics..."
          className="
            bg-transparent
            outline-none
            w-full
            theme-text
            placeholder:text-zinc-500
          "
        />

      </div>

      {/* RIGHT */}

      <div
        className="
          flex
          items-center
          justify-between
          w-full
          md:w-auto
          gap-2
          md:gap-3
        "
      >

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => window.dispatchEvent(new Event("open-mobile-sidebar"))}
          className="
            md:hidden
            theme-card
            w-[44px]
            h-[44px]
            rounded-2xl
            flex
            shrink-0
            items-center
            justify-center
            border
            border-white/10
            shadow-lg
            hover:scale-105
            transition-all
            duration-300
          "
        >
          <Menu size={20} className="theme-text" />
        </button>

        {/* ICONS WRAPPER */}
        <div className="flex items-center justify-end gap-2 md:gap-3 w-full md:w-auto">

        {/* AI STATUS */}

        <div
          className="
            hidden
            md:flex
            theme-card
            h-[52px]
            px-5
            rounded-2xl
            items-center
            gap-3
            border
            border-emerald-500/10
            shadow-lg
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
              text-emerald-400
              text-sm
              font-medium
            "
          >

            AI Engine Active

          </span>

        </div>

        {/* THEME */}

        <button
          onClick={toggleTheme}
          className="
            theme-card
            w-[44px]
            h-[44px]
            md:w-[52px]
            md:h-[52px]
            rounded-2xl
            flex
            shrink-0
            items-center
            justify-center
            border
            border-white/10
            shadow-lg
            hover:scale-105
            transition-all
            duration-300
          "
        >

          {lightMode ? (

            <Moon
              size={20}
              className="theme-text"
            />

          ) : (

            <Sun
              size={20}
              className="text-yellow-400"
            />

          )}

        </button>

        {/* NOTIFICATION */}

        <button
          className="
            theme-card
            w-[44px]
            h-[44px]
            md:w-[52px]
            md:h-[52px]
            rounded-2xl
            flex
            shrink-0
            items-center
            justify-center
            border
            border-white/10
            shadow-lg
            hover:scale-105
            transition-all
            duration-300
          "
        >

          <Bell
            size={20}
            className="theme-text"
          />

        </button>


        </div>

      </div>

    </div>

  );

}