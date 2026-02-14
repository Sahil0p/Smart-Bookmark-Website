"use client";

import { supabase } from "@/lib/supabaseClient";

export default function HomePage() {
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  return (
    <main
      className="
      relative
      min-h-screen
      w-full
      flex items-center justify-center
      px-4 sm:px-6
      overflow-x-hidden
      "
    >
      {/* 🔥 Animated Gradient Background (Overflow Safe) */}
      <div
        className="
        pointer-events-none
        absolute inset-0 -z-10
        w-full h-full
        bg-gradient-to-br
        from-indigo-500 via-purple-500 to-pink-500
        opacity-20
        blur-3xl
        animate-pulse
        "
      />

      {/* Glass Card */}
      <div
        className="
        backdrop-blur-2xl
        bg-white/70 dark:bg-white/5
        border border-white/20 dark:border-white/10
        shadow-2xl
        rounded-3xl
        w-full
        max-w-md
        mx-auto
        p-7 sm:p-10
        transition-all duration-300
        "
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <h1
            className="
            text-3xl sm:text-4xl
            font-bold tracking-tight
            text-slate-800 dark:text-white
            "
          >
            🔖 Smart Bookmark
          </h1>

          <p
            className="
            text-slate-500 dark:text-slate-400
            mt-3
            text-sm sm:text-base
            "
          >
            Save, manage & sync your links in real-time
          </p>
        </div>

        {/* Features */}
        <div
          className="
          mb-8 space-y-3
          text-sm
          text-slate-600 dark:text-slate-300
          "
        >
          <p>✨ Google Sign-in (Secure)</p>
          <p>⚡ Real-time sync across tabs</p>
          <p>🔒 Private bookmarks per user</p>
        </div>

        {/* Google Button */}
        <button
          onClick={handleGoogleLogin}
          className="
          w-full
          flex items-center justify-center gap-3
          py-3
          rounded-xl
          font-semibold text-white
          bg-gradient-to-r from-indigo-500 to-pink-500
          hover:scale-[1.02] hover:shadow-xl
          transition-all duration-300
          active:scale-[0.98]
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            className="w-5 h-5"
          >
            <path
              fill="#FFC107"
              d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35 24 35c-6.1 
              0-11-4.9-11-11s4.9-11 11-11c2.8 0 5.3 1 7.4 
              2.6l5.7-5.7C33.5 6.5 29 5 24 5 12.9 5 4 13.9 4 
              25s8.9 20 20 20 20-8.9 20-20c0-1.6-.2-3.1-.4-4.5z"
            />
          </svg>
          Continue with Google
        </button>

        <p className="text-xs text-center text-slate-400 mt-6">
          Built with Next.js + Supabase + Realtime
        </p>
      </div>
    </main>
  );
}
