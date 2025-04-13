import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ reason: "METHOD_NOT_ALLOWED" }),
      {
        headers: { "Content-Type": "application/json" },
        status: 405,
      }
    );
  }

  const { username } = await req.json();

  if (!username) {
    return new Response(
      JSON.stringify({ reason: "MISSING_USERNAME" }),
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

  const { data, error } = await supabase
    .from("users")
    .select("email")
    .eq("username", username)
    .single();

  if (error || !data) {
    return new Response(
      JSON.stringify({ reason: "USER_NOT_FOUND", error }),
      {
        headers: { "Content-Type": "application/json" },
        status: 404,
      }
    );
  }

  return new Response(JSON.stringify({ email: data.email }), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
});
