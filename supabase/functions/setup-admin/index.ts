import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async () => {
  try {
    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { data } = await admin.auth.admin.listUsers();
    const user = data?.users?.find((u) => u.email === "afia@snapsitee.com" || u.email === "admin@corestudioss.com");
    if (!user) throw new Error("Admin user not found");
    const { error } = await admin.auth.admin.updateUserById(user.id, {
      email: "admin@corestudioss.com",
      password: "Core$$309",
      email_confirm: true,
    });
    if (error) throw error;
    return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ success: false, error: e instanceof Error ? e.message : "error" }), { status: 500 });
  }
});
