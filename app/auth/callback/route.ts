import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    // 🔥 MUST await (fixes your TypeScript error)
    const supabase = await createSupabaseServerClient();

    await supabase.auth.exchangeCodeForSession(code);
  }

  // Redirect to dashboard after login
  return NextResponse.redirect(`${requestUrl.origin}/dashboard`);
}
