"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner"; // 🔔 NEW: Toast notifications

interface Props {
  userId: string;
}

export default function BookmarkForm({ userId }: Props) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddBookmark = async () => {
    // 🧠 Better validation (pro UX)
    if (!title.trim() || !url.trim()) {
      toast.error("Please enter both title and URL");
      return;
    }

    if (!userId) {
      toast.error("User not authenticated");
      return;
    }

    try {
      setLoading(true);

      const formattedUrl = url.startsWith("http")
        ? url
        : `https://${url}`;

      const { error } = await supabase.from("bookmarks").insert([
        {
          title: title.trim(),
          url: formattedUrl,
          user_id: userId,
        },
      ]);

      if (error) {
        throw error;
      }

      // 🔔 SUCCESS TOAST (startup-grade UX)
      toast.success("Bookmark added successfully 🚀");

      // Reset fields
      setTitle("");
      setUrl("");
    } catch (error) {
      console.error("Add bookmark error:", error);

      // 🔔 ERROR TOAST (production UX)
      toast.error("Failed to add bookmark. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ⌨️ PRO FEATURE: Submit on Enter key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading) {
      handleAddBookmark();
    }
  };

  return (
    <div
      className="
      backdrop-blur-xl bg-white/70 dark:bg-white/5
      border border-white/20 dark:border-white/10
      rounded-2xl
      p-5 sm:p-6
      shadow-xl
      "
    >
      <h3 className="text-xl font-semibold mb-4 text-slate-800 dark:text-white">
        Add New Bookmark
      </h3>

      <div className="grid sm:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Website Title (e.g. YouTube)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown} // 🆕 Enter submit
          className="
          w-full px-4 py-3 rounded-xl
          bg-white/80 dark:bg-white/10
          border border-slate-200 dark:border-white/10
          outline-none focus:ring-2 focus:ring-indigo-500
          text-slate-800 dark:text-white
          placeholder:text-slate-400
          "
        />

        <input
          type="text"
          placeholder="URL (e.g. youtube.com)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={handleKeyDown} // 🆕 Enter submit
          className="
          w-full px-4 py-3 rounded-xl
          bg-white/80 dark:bg-white/10
          border border-slate-200 dark:border-white/10
          outline-none focus:ring-2 focus:ring-pink-500
          text-slate-800 dark:text-white
          placeholder:text-slate-400
          "
        />
      </div>

      <button
        onClick={handleAddBookmark}
        disabled={loading}
        className="
        mt-5 w-full py-3 rounded-xl font-semibold text-white
        bg-gradient-to-r from-indigo-500 to-pink-500
        hover:scale-[1.01] hover:shadow-xl
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        "
      >
        {loading ? "Adding..." : "Add Bookmark"}
      </button>
    </div>
  );
}
