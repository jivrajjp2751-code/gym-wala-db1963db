// supabase/functions/admin-delete-user/index.ts

import { createClient } from "npm:@supabase/supabase-js@2";

const SUPER_ADMIN_EMAIL = "jiveshpatil0@gmail.com";

type Payload = {
  userId: string;
};

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    return new Response(JSON.stringify({ error: "Server misconfigured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const authHeader = req.headers.get("Authorization") ?? "";
  const jwt = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!jwt) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey);

  // Verify caller and enforce super-admin-only
  const { data: caller, error: callerErr } = await adminClient.auth.getUser(jwt);
  if (callerErr || !caller?.user?.email) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (caller.user.email.toLowerCase() !== SUPER_ADMIN_EMAIL) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!body.userId) {
    return new Response(JSON.stringify({ error: "Missing userId" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Safety: don't allow deleting the super admin account via UI.
  if (body.userId === caller.user.id) {
    return new Response(JSON.stringify({ error: "You cannot delete your own account." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Cleanup app tables first (since we don't have FKs)
  await adminClient.from("user_roles").delete().eq("user_id", body.userId);
  await adminClient.from("profiles").delete().eq("user_id", body.userId);

  const { error: delErr } = await adminClient.auth.admin.deleteUser(body.userId);
  if (delErr) {
    return new Response(JSON.stringify({ error: delErr.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
