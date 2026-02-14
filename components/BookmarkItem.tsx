"use client";

import { useState, useMemo } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import type { Bookmark } from "@/types/bookmark";

interface Props {
  bookmark: Bookmark;
}

export default function BookmarkItem({ bookmark }: Props) {
  const [deleting, setDeleting] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    // 🛑 Prevent card click when deleting
    e.preventDefault();
    e.stopPropagation();

    if (deleting) return;

    try {
      setDeleting(true);

      const { error } = await supabase
        .from("bookmarks")
        .delete()
        .eq("id", bookmark.id);

      if (error) throw error;

      toast.success("Bookmark deleted successfully 🗑️");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete bookmark");
    } finally {
      setDeleting(false);
    }
  };

  // 🎥 Smart Thumbnail (YouTube + fallback)
  const previewImage = useMemo(() => {
    try {
      const url = new URL(bookmark.url);
      const hostname = url.hostname;

      if (
        hostname.includes("youtube.com") ||
        hostname.includes("youtu.be")
      ) {
        let videoId = "";

        if (hostname.includes("youtu.be")) {
          videoId = url.pathname.slice(1);
        } else {
          videoId = url.searchParams.get("v") || "";
        }

        if (videoId) {
          return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        }
      }

      return `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;
    } catch {
      return "https://www.google.com/favicon.ico";
    }
  }, [bookmark.url]);

  let domain = "";
  try {
    domain = new URL(bookmark.url).hostname;
  } catch {
    domain = bookmark.url;
  }

  return (
    // 🔥 ENTIRE CARD CLICKABLE (Mobile + Desktop)
    <a
      href={bookmark.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      <div
        className="
        group relative
        backdrop-blur-xl bg-white/60 dark:bg-white/5
        border border-white/20 dark:border-white/10
        rounded-2xl
        p-4 sm:p-5
        shadow-lg hover:shadow-2xl
        transition-all duration-300
        hover:-translate-y-1
        cursor-pointer
        "
      >
        <div className="flex items-center justify-between gap-3">
          {/* LEFT CONTENT */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Thumbnail */}
            <img
              src={previewImage}
              alt="preview"
              className="
              w-14 h-14 sm:w-16 sm:h-16
              object-cover
              rounded-xl
              shrink-0
              shadow-md
              "
              onError={(e) => {
                if (!imageError) {
                  setImageError(true);
                  (e.currentTarget as HTMLImageElement).src =
                    `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
                }
              }}
            />

            {/* TEXT */}
            <div className="min-w-0">
              {/* Title (Always visible) */}
              <h4
                className="
                text-base sm:text-lg
                font-semibold
                text-slate-800 dark:text-white
                truncate
                "
              >
                {bookmark.title}
              </h4>

              {/* URL: Hidden on Mobile, Visible on Desktop */}
              <p
                className="
                hidden sm:block
                text-xs sm:text-sm
                text-blue-600 dark:text-blue-400
                break-all
                "
              >
                {bookmark.url}
              </p>
            </div>
          </div>

          {/* DELETE BUTTON (Does NOT trigger card click) */}
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="
            text-red-500 text-sm font-medium
            opacity-100 sm:opacity-0
            sm:group-hover:opacity-100
            transition
            disabled:opacity-40 disabled:cursor-not-allowed
            "
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </a>
  );
}
