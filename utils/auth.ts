"use client";

import { supabase } from "@/lib/supabaseClient";

/**
 * Google OAuth Login (Requirement #1)
 */
export const signInWithGoogle = async () => {
  try {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  } catch (error) {
    console.error("Google login error:", error);
  }
};

/**
 * Logout user
 */
export const logoutUser = async () => {
  try {
    await supabase.auth.signOut();
    window.location.href = "/";
  } catch (error) {
    console.error("Logout error:", error);
  }
};

/**
 * Get current logged-in user (typed)
 */
export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.error(error.message);
    return null;
  }

  return data.user;
};
