import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2?target=deno";


serve(async (req) => {
  try {
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ reason: "METHOD_NOT_ALLOWED" }),
        {
          headers: { "Content-Type": "application/json" },
          status: 405,
        }
      );
    }

    const { username, password } = await req.json();

    if (!username || !password) {
      return new Response(
        JSON.stringify({ reason: "MISSING_USERNAME_OR_PASSWORD" }),
        {
          headers: { "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // 1. Get email by username using Edge Function
    console.log("URL IS: ", Deno.env.get("EDGE_URL"));
    const res = await fetch(
      `${Deno.env.get("EDGE_URL")}/getEmailByUsername`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      }
    );

    if (!res.ok) {
      const raw = await res.text();
      return new Response(
        JSON.stringify({ reason: "USERNAME_NOT_FOUND", details: raw }),
        {
          headers: { "Content-Type": "application/json" },
          status: 404,
        }
      );
    }

    const { email } = await res.json();

    // 2. Login with email + password
    const {
      data: authData,
      error: loginError,
    } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError || !authData?.session) {
      return new Response(
        JSON.stringify({
          reason: "INVALID_CREDENTIALS",
          error: loginError?.message,
        }),
        {
          headers: { "Content-Type": "application/json" },
          status: 401,
        }
      );
    }

    // 3. Get full user data
    const { data: fullUser, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .single();

    if (fetchError || !fullUser) {
      return new Response(
        JSON.stringify({
          reason: "FAILED_TO_LOAD_USER",
          error: fetchError?.message,
        }),
        {
          headers: { "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    return new Response(
      JSON.stringify({ success: true, user: fullUser, session: authData.session }),
      {
        headers: { "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (err) {
    console.error("🔥 Edge Function Crash:", err.message);
    return new Response(
      JSON.stringify({
        reason: "INTERNAL_EDGE_FUNCTION_ERROR",
        error: err.message,
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
