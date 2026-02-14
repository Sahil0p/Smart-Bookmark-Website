"use client";

import { supabase } from "@/lib/supabaseClient";
import ThemeToggle from "./ThemeToggle";
import toast from "react-hot-toast";

interface Props {
  email: string;
}

export default function Navbar({ email }: Props) {
  const logout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    window.location.href = "/";
  };

  return (
    <nav className="sticky top-0 z-50 px-6 pt-6">
      <div className="glass-card px-6 py-4 flex items-center justify-between">
        {/* 🔥 FIX: Dark mode text */}
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          🚀 Smart Bookmark
        </h1>

        <div className="flex items-center gap-4">
          {/* 🔥 FIX: Email text visible in dark */}
          <span className="text-sm opacity-80 hidden md:block text-slate-700 dark:text-slate-300">
            {email}
          </span>

          <ThemeToggle />

          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 
            px-4 py-2 rounded-xl text-white
            transition hover:scale-105 shadow-lg"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
