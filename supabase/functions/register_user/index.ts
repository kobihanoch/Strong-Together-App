import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const body = await req.json();
  const { email, password, username, fullName, gender } = body;

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    // 1. Check if username is taken via Edge Function
    const checkRes = await fetch(
      `${Deno.env.get("EDGE_URL")}/getEmailByUsername`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      }
    );

    const { email: existingEmail } = await checkRes.json();

    if (existingEmail) {
      return new Response(JSON.stringify({ success: false, reason: "USERNAME_TAKEN" }), { status: 400 });
    }

    // 2. Create Auth user
    const { data: authData, error: signUpError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (signUpError) {
      console.error("❌ signUpError:", signUpError);
      throw signUpError;
      return new Response(JSON.stringify({ success: false, reason: "SIGNUP_ERROR", error: signUpError.message }), { status: 500 });
    }

    const userId = authData.user?.id;

    if (!userId) {
      return new Response(JSON.stringify({ success: false, reason: "MISSING_USER_ID" }), { status: 500 });
    }

    // 3. Insert directly into users table
    const { error: insertError } = await supabase.from("users").insert({
      id: userId,
      email,
      username,
      name: fullName,
      gender,
    });

    if (insertError) {
      return new Response(JSON.stringify({ success: false, reason: "DB_INSERT_ERROR", error: insertError.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true, email, username }), { status: 200 });

  } catch (err) {
    console.error("❌ UNEXPECTED_ERROR object:", err);

    return new Response(JSON.stringify({
      success: false,
      reason: "UNEXPECTED_ERROR",
      error:
        typeof err === "string"
          ? err
          : err?.message || JSON.stringify(err),
    }), { status: 500 });
  }
});
