"use client";

import Link from "next/link";

import {
  LayoutDashboard,
  BarChart3,
  Brain,
  History,
  Settings,
  Menu,
  X,
  LogOut,
  CalendarDays,
  CreditCard,
  Flame,
  Activity,
  Compass
} from "lucide-react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const menuItems = [

  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    icon: Activity,
    label: "Meta Intelligence",
    href: "/dashboard/meta",
  },
  {
    icon: CalendarDays,
    label: "Scheduler",
    href: "/dashboard/calendar",
  },
  {
    icon: Flame,
    label: "Global Trends",
    href: "/dashboard/trends",
  },
  {
    icon: History,
    label: "History",
    href: "/dashboard/history",
  },
  {
    icon: CreditCard,
    label: "Billing",
    href: "/dashboard/billing",
  },

  {
    icon: Settings,
    label: "Settings",
    href: "/dashboard/settings",
  },

];

export default function Sidebar({
  expanded,
  setExpanded,
}: any) {

  const [mobileOpen, setMobileOpen] =
    useState(false);
  const [user, setUser] = useState<{name: string, email: string} | null>(null);

  useEffect(() => {
    const handleOpen = () => setMobileOpen(true);
    window.addEventListener("open-mobile-sidebar", handleOpen);
    
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    return () => window.removeEventListener("open-mobile-sidebar", handleOpen);
  }, []);

  const router = useRouter();
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (

    <>



      {/* MOBILE OVERLAY */}

      {mobileOpen && (

        <div
          onClick={() =>
            setMobileOpen(false)
          }
          className="
            lg:hidden
            fixed
            inset-0
            bg-black/50
            backdrop-blur-sm
            z-40
          "
        />

      )}

      {/* SIDEBAR */}

      <aside

        onMouseEnter={() =>
          window.innerWidth >= 1024 &&
          setExpanded(true)
        }

        onMouseLeave={() =>
          window.innerWidth >= 1024 &&
          setExpanded(false)
        }

        className={`
          theme-sidebar
          fixed
          top-0
          left-0
          h-screen
          z-50
          transition-all
          duration-300
          ease-in-out
          overflow-hidden
          flex
          flex-col
          justify-between
          backdrop-blur-2xl
          shadow-2xl
          border-r
          border-white/10

          ${
            expanded
              ? "lg:w-[250px]"
              : "lg:w-[88px]"
          }

          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }

          w-[280px]
        `}
      >

        {/* TOP */}

        <div>

          {/* LOGO */}

          <div
            className="
              h-[88px]
              px-5
              flex
              items-center
              justify-between
              border-b
              border-white/5
            "
          >

            <div className="flex items-center">
              {/* ICON */}

              <div
                className="
                  min-w-[50px]
                  min-h-[50px]
                  w-[50px]
                  h-[50px]
                  rounded-2xl
                  bg-gradient-to-r
                  from-cyan-400
                  to-blue-500
                  flex
                  items-center
                  justify-center
                  text-white
                  font-bold
                  text-xl
                  shadow-lg
                  shadow-cyan-500/20
                  border
                  border-white/10
                  flex-shrink-0
                "
              >

                N

              </div>

              {/* TEXT */}

              <div
                className={`
                  ml-4
                  transition-all
                  duration-300

                  ${
                    expanded || mobileOpen

                      ? "opacity-100 translate-x-0"

                      : "opacity-0 -translate-x-4 pointer-events-none"
                  }
                `}
              >

                <h1
                  className="
                    font-bold
                    text-xl
                    whitespace-nowrap
                    bg-gradient-to-r
                    from-cyan-400
                    via-blue-500
                    to-purple-500
                    bg-clip-text
                    text-transparent
                  "
                >

                  NeuroSocial

                </h1>

                <p
                  className="
                    theme-muted
                    text-sm
                    whitespace-nowrap
                    mt-1
                  "
                >

                  AI Analytics

                </p>

              </div>
            </div>

            {/* MOBILE CLOSE */}
            {mobileOpen && (
              <button
                onClick={() => setMobileOpen(false)}
                className="lg:hidden p-2 text-zinc-400 hover:text-white"
              >
                <X size={24} />
              </button>
            )}

          </div>

          {/* MENU */}

          <div
            className="
              mt-8
              flex
              flex-col
              gap-2
              px-3
            "
          >

            {menuItems.map(
              (item, index) => {

                const Icon =
                  item.icon;

                return (

                  <Link

                    key={index}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="
                      sidebar-item
                      group
                      relative
                      flex
                      items-center
                      h-[58px]
                      px-4
                      rounded-2xl
                      transition-all
                      duration-300
                      hover:translate-x-1
                    "
                  >

                    {/* ICON */}

                    <div
                      className="
                        min-w-[24px]
                        flex
                        justify-center
                      "
                    >

                      <Icon
                        size={22}
                        className="
                          theme-text
                        "
                      />

                    </div>

                    {/* LABEL */}

                    <span
                      className={`
                        ml-4
                        whitespace-nowrap
                        transition-all
                        duration-300
                        text-sm
                        font-medium

                        ${
                          expanded || mobileOpen

                            ? "opacity-100 translate-x-0"

                            : "opacity-0 -translate-x-4"
                        }
                      `}
                    >

                      {item.label}

                    </span>

                  </Link>

                );

              }
            )}

          </div>

        </div>

        {/* BOTTOM */}

        <div
          className="
            p-5
            border-t
            border-white/5
          "
        >

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
                rounded-full
                bg-gradient-to-r
                from-cyan-400
                to-blue-500
                flex
                items-center
                justify-center
                text-white
                font-bold
                shadow-lg
                shadow-cyan-500/20
                flex-shrink-0
              "
            >

              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}

            </div>

            <div
              className={`
                transition-all
                duration-300

                ${
                  expanded || mobileOpen

                    ? "opacity-100"

                    : "opacity-0 hidden"
                }
              `}
            >

              <h3
                className="
                  theme-text
                  font-semibold
                  text-sm
                  truncate
                  max-w-[150px]
                "
              >

                {user?.name || "User"}

              </h3>

              <p
                className="
                  theme-muted
                  text-xs
                  mt-1
                "
              >

                Premium Plan

              </p>

            </div>

          </div>

          <button
            onClick={handleLogout}
            className={`
              mt-4
              flex
              items-center
              gap-3
              text-red-400
              hover:bg-red-500/10
              rounded-xl
              transition-all
              duration-300
              ${expanded || mobileOpen ? "px-3 py-2" : "justify-center py-2"}
            `}
            title="Logout"
          >
            <LogOut size={22} />
            <span
              className={`
                whitespace-nowrap
                text-sm
                font-medium
                ${expanded || mobileOpen ? "opacity-100 block" : "opacity-0 hidden"}
              `}
            >
              Logout
            </span>
          </button>

        </div>

      </aside>

    </>

  );

}