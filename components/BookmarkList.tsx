"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { supabase } from "@/lib/supabaseClient";
import BookmarkItem from "./BookmarkItem";
import SkeletonCard from "./SkeletonCard";
import type { Bookmark } from "@/types/bookmark";

interface Props {
  userId: string;
}

export default function BookmarkList({ userId }: Props) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchBookmarks = useCallback(async () => {
    if (!userId) return;

    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setBookmarks(data);
    }

    setLoading(false);
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    Promise.resolve().then(fetchBookmarks);

    const channel = supabase.channel(`realtime-bookmarks-${userId}`);

    channel
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          fetchBookmarks();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [userId, fetchBookmarks]);

  // 🔍 Search Filter (unchanged logic)
  const filteredBookmarks = useMemo(() => {
    if (!search.trim()) return bookmarks;
    const query = search.toLowerCase();

    return bookmarks.filter(
      (b) =>
        b.title.toLowerCase().includes(query) ||
        b.url.toLowerCase().includes(query)
    );
  }, [bookmarks, search]);

  if (loading) {
    return (
      <div className="grid gap-4 w-full">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full overflow-x-hidden">
      {/* ✅ FIXED: ONE ROW STATS + SEARCH (MOBILE SAFE) */}
      <div
        className="
        glass-card
        p-4
        flex
        items-center
        justify-between
        gap-3
        w-full
        "
      >
        {/* Stats */}
        <div className="shrink-0">
          <p className="text-sm text-slate-400 dark:text-slate-400">
            Total Bookmarks
          </p>
          <p className="text-2xl font-bold text-slate-800 dark:text-white">
            {bookmarks.length}
          </p>
        </div>

        {/* 🔧 FIXED SEARCH (Always single row, responsive) */}
        <div className="w-full max-w-[200px] sm:max-w-xs">
          <input
            type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="
        w-full md:w-64 px-4 py-2 rounded-xl
        bg-white/70 dark:bg-white/10
        border border-slate-200 dark:border-white/10
        text-slate-800 dark:text-white
        placeholder:text-slate-400 dark:placeholder:text-slate-500
        outline-none focus:ring-2 focus:ring-indigo-500
        backdrop-blur-xl
        transition
            "
          />
        </div>
      </div>

      {/* Empty State */}
      {filteredBookmarks.length === 0 ? (
        <div className="glass-card p-10 text-center w-full">
          <h3 className="text-xl font-semibold mb-2 text-slate-800 dark:text-white">
            {bookmarks.length === 0
              ? "No bookmarks yet"
              : "No matching bookmarks"}
          </h3>
          <p className="text-slate-400">
            {bookmarks.length === 0
              ? "Add your first bookmark to see real-time sync 🚀"
              : "Try a different search keyword 🔍"}
          </p>
        </div>
      ) : (
        /* ✅ FIXED GRID (NO OVERFLOW, MOBILE PERFECT FIT) */
        <div className="grid gap-4 w-full grid-cols-1 md:grid-cols-2">
          {filteredBookmarks.map((bookmark) => (
            <div className="w-full min-w-0" key={bookmark.id}>
              <BookmarkItem bookmark={bookmark} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
