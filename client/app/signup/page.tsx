"use client";

import { useState } from "react";

import axios from "axios";

import Link from "next/link";

import { useRouter } from "next/navigation";

import {
  Sparkles,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";

export default function SignupPage() {

  const router = useRouter();

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({

      name: "",

      email: "",

      password: "",

    });

  const handleChange = (e: any) => {

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value,

    });

  };

  const handleSignup =
    async (e: any) => {

      e.preventDefault();

      try {

        setLoading(true);

        const res =
          await axios.post(

            `http://${window.location.hostname}:5000/api/register`,

            formData

          );

        alert(
          res.data.message
        );

        router.push(
          "/login"
        );

      } catch (error: any) {

        alert(

          error.response?.data
            ?.message ||

            "Signup failed"

        );

      } finally {

        setLoading(false);

      }

    };

  return (

    <main
      className="
        relative
        min-h-screen
        flex
        items-center
        justify-center
        overflow-hidden
        bg-black
        px-6
      "
    >

      {/* BACKGROUND GLOW */}

      <div
        className="
          absolute
          top-[-120px]
          left-[-120px]
          w-[420px]
          h-[420px]
          rounded-full
          bg-cyan-500/10
          blur-3xl
        "
      />

      <div
        className="
          absolute
          bottom-[-120px]
          right-[-120px]
          w-[420px]
          h-[420px]
          rounded-full
          bg-purple-500/10
          blur-3xl
        "
      />

      {/* CARD */}

      <div
        className="
          relative
          z-10
          w-full
          max-w-md
          rounded-[24px]
          md:rounded-[36px]
          border
          border-white/10
          bg-white/[0.03]
          backdrop-blur-2xl
          p-6
          md:p-10
          shadow-2xl
        "
      >

        {/* HEADER */}

        <div className="mb-10">

          <div
            className="
              w-16
              h-16
              rounded-3xl
              bg-gradient-to-r
              from-cyan-400
              to-blue-500
              flex
              items-center
              justify-center
              shadow-lg
              shadow-cyan-500/20
              mb-6
            "
          >

            <Sparkles
              size={30}
              className="
                text-white
              "
            />

          </div>

          <h1
            className="
              text-3xl
              md:text-4xl
              font-black
              text-white
              mb-3
            "
          >

            Create Account

          </h1>

          <p
            className="
              text-zinc-500
              leading-relaxed
            "
          >

            Join NeuroSocial AI and
            unlock intelligent social
            media analytics.

          </p>

        </div>

        {/* FORM */}

        <form
          onSubmit={handleSignup}
          className="
            space-y-5
          "
        >

          {/* NAME */}

          <div>

            <label
              className="
                text-sm
                text-zinc-400
                mb-2
                block
              "
            >

              Full Name

            </label>

            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              onChange={handleChange}
              className="
                w-full
                h-[58px]
                px-5
                rounded-2xl
                bg-white/[0.03]
                border
                border-white/10
                text-white
                placeholder:text-zinc-500
                outline-none
                focus:border-cyan-500/40
                transition-all
              "
            />

          </div>

          {/* EMAIL */}

          <div>

            <label
              className="
                text-sm
                text-zinc-400
                mb-2
                block
              "
            >

              Email Address

            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              onChange={handleChange}
              className="
                w-full
                h-[58px]
                px-5
                rounded-2xl
                bg-white/[0.03]
                border
                border-white/10
                text-white
                placeholder:text-zinc-500
                outline-none
                focus:border-cyan-500/40
                transition-all
              "
            />

          </div>

          {/* PASSWORD */}

          <div>

            <label
              className="
                text-sm
                text-zinc-400
                mb-2
                block
              "
            >

              Password

            </label>

            <div className="relative">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                placeholder="Create password"
                onChange={handleChange}
                className="
                  w-full
                  h-[58px]
                  px-5
                  rounded-2xl
                  bg-white/[0.03]
                  border
                  border-white/10
                  text-white
                  placeholder:text-zinc-500
                  outline-none
                  focus:border-cyan-500/40
                  transition-all
                "
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                className="
                  absolute
                  top-1/2
                  right-5
                  -translate-y-1/2
                  text-zinc-500
                "
              >

                {showPassword ? (

                  <EyeOff size={20} />

                ) : (

                  <Eye size={20} />

                )}

              </button>

            </div>

          </div>

          {/* BUTTON */}

          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              h-[60px]
              rounded-2xl
              bg-gradient-to-r
              from-cyan-500
              to-blue-500
              text-white
              font-semibold
              flex
              items-center
              justify-center
              gap-3
              hover:scale-[1.02]
              transition-all
              duration-300
              shadow-lg
              shadow-cyan-500/20
              disabled:opacity-50
            "
          >

            {loading
              ? "Creating Account..."
              : "Create Account"}

            <ArrowRight size={18} />

          </button>

        </form>

        {/* FOOTER */}

        <div
          className="
            mt-8
            text-center
          "
        >

          <p
            className="
              text-zinc-500
              text-sm
            "
          >

            Already have an account?{" "}

            <Link
              href="/login"
              className="
                text-cyan-400
                hover:text-cyan-300
                transition-all
              "
            >

              Login

            </Link>

          </p>

        </div>

      </div>

    </main>

  );

}