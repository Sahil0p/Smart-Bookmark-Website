
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";
import Navbar from "@/components/Navbar";
import BookmarkForm from "@/components/BookmarkForm";
import BookmarkList from "@/components/BookmarkList";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🔥 CRITICAL: Use getSession instead of getUser (fixes blank screen)
    const getSessionUser = async () => {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        // No session → go back to login
        window.location.href = "/";
        return;
      }

      setUser(data.session.user);
      setLoading(false);
    };

    getSessionUser();

    // Optional: listen for auth changes (very professional)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        window.location.href = "/";
      } else {
        setUser(session.user);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-lg font-semibold animate-pulse">
          Loading your dashboard...
        </div>
      </div>
    );
  }

  if (!user) return null;

//   return (
//     <main className="min-h-screen">
//       {/* Navbar */}
//       <div className="border-b bg-white sticky top-0 z-10">
//         <div className="max-w-6xl mx-auto px-6 py-4">
//           <Navbar email={user.email ?? "User"} />
//         </div>
//       </div>

//       {/* Content */}
//       <div className="max-w-6xl mx-auto px-6 py-10">
//         <div className="mb-10">
//           <h2 className="text-4xl font-bold tracking-tight">
//             Your Smart Bookmarks
//           </h2>
//           <p className="text-slate-500 mt-2 text-lg">
//             Private • Secure • Real-time Synced
//           </p>
//         </div>

//         <BookmarkForm userId={user.id} />

//         <div className="mt-8">
//           <BookmarkList userId={user.id} />
//         </div>
//       </div>
//     </main>
//   );
return (
  <main className="min-h-screen">
    {/* Premium Glass Navbar */}
    <Navbar email={user.email ?? "User"} />

    {/* Content Container */}
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="glass-card p-8">
        {/* Header */}
        <div className="mb-10">
          <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
  Your Smart Bookmarks
</h2>
<p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
  Private • Secure • Real-time Synced
</p>

        </div>

        {/* Form */}
        <BookmarkForm userId={user.id} />

        {/* List */}
        <div className="mt-8">
          <BookmarkList userId={user.id} />
        </div>
      </div>
    </div>
  </main>
);


}
