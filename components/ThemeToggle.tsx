"use client";

import { useState, useEffect } from "react";

function getInitialTheme(): boolean {
  if (typeof window === "undefined") return false;
  const saved = localStorage.getItem("theme");
  if (saved) return saved === "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export default function ThemeToggle() {
  const [dark, setDark] = useState<boolean>(getInitialTheme);

  useEffect(() => {
    const html = document.documentElement;
    if (dark) {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]); // ✅ ESLint SAFE (no sync setState)

  return (
    <button
      onClick={() => setDark((prev) => !prev)}
      className="px-3 py-2 rounded-xl glass-card 
      hover:scale-105 transition-all duration-200"
      aria-label="Toggle Theme"
    >
      {dark ? "🌙" : "☀️"}
    </button>
  );
}
