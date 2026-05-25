"use client";

import { useState } from "react";

import axios from "axios";

import { useRouter } from "next/navigation";

import Link from "next/link";

export default function LoginPage() {

  const router = useRouter();

  const [formData, setFormData] =
    useState({

      email: "",
      password: "",

    });

  const [loading, setLoading] =
    useState(false);

  const handleChange = (e: any) => {

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value,

    });

  };

  const handleLogin =
    async (e: any) => {

      e.preventDefault();

      try {

        setLoading(true);

        const res =
          await axios.post(

            `https://neurosocialai.onrender.com/api/login`,

            formData

          );

        localStorage.setItem(

          "token",

          res.data.token

        );

        localStorage.setItem(

          "user",

          JSON.stringify(
            res.data.user
          )

        );

        router.push(
          "/dashboard"
        );

      } catch (error: any) {

        alert(

          error.response?.data
            ?.message ||

            "Login failed"

        );

      } finally {

        setLoading(false);

      }

    };

  return (

    <main
      className="
        min-h-screen
        bg-black
        text-white
        flex
        items-center
        justify-center
        relative
        overflow-hidden
      "
    >

      {/* BACKGROUND GLOW */}

      <div
        className="
          absolute
          w-[500px]
          h-[500px]
          bg-cyan-500/10
          blur-[120px]
          rounded-full
        "
      />

      {/* LOGIN CARD */}

      <div
        className="
          relative
          z-10
          w-full
          max-w-md
          p-6
          md:p-10
          mx-4
          md:mx-0
          rounded-2xl
          md:rounded-3xl
          bg-white/[0.03]
          border
          border-white/10
          backdrop-blur-2xl
        "
      >

        {/* LOGO */}

        <div
          className="
            mb-10
            text-center
          "
        >

          <h1
            className="
              text-3xl
              md:text-4xl
              font-bold
              tracking-tight
            "
          >

            NeuroSocial AI

          </h1>

          <p
            className="
              text-zinc-500
              mt-3
            "
          >

            AI-powered social intelligence platform

          </p>

        </div>

        {/* FORM */}

        <form
          onSubmit={handleLogin}
          className="
            space-y-5
          "
        >

          {/* EMAIL */}

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="
              w-full
              p-4
              rounded-2xl
              bg-black/60
              border
              border-white/10
              outline-none
              focus:border-cyan-400
              transition
            "
          />

          {/* PASSWORD */}

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="
              w-full
              p-4
              rounded-2xl
              bg-black/60
              border
              border-white/10
              outline-none
              focus:border-cyan-400
              transition
            "
          />

          {/* BUTTON */}

          <button
            type="submit"
            className="
              w-full
              p-4
              rounded-2xl
              bg-white
              text-black
              font-semibold
              hover:opacity-90
              transition
            "
          >

            {loading

              ? "Authenticating..."

              : "Login"}

          </button>

        </form>

        {/* SIGNUP LINK */}

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

            Don’t have an account?{" "}

            <Link
              href="/signup"
              className="
                text-cyan-400
                hover:text-cyan-300
                transition-all
              "
            >

              Create Account

            </Link>

          </p>

        </div>

      </div>

    </main>

  );

}