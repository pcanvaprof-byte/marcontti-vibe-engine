import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/bootstrap-admin")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.json().catch(() => ({} as { email?: string; password?: string; token?: string }));
        if (body.token !== process.env.BOOTSTRAP_ADMIN_TOKEN) {
          return new Response("unauthorized", { status: 401 });
        }
        if (!body.email || !body.password) {
          return new Response("missing email/password", { status: 400 });
        }
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
          email: body.email,
          password: body.password,
          email_confirm: true,
        });
        if (error && !error.message.toLowerCase().includes("already")) {
          return new Response(error.message, { status: 500 });
        }
        let userId = created?.user?.id;
        if (!userId) {
          const { data: list } = await supabaseAdmin.auth.admin.listUsers();
          userId = list.users.find((u) => u.email === body.email)?.id;
        }
        if (!userId) return new Response("no user id", { status: 500 });

        const { error: roleErr } = await supabaseAdmin
          .from("user_roles")
          .upsert({ user_id: userId, role: "admin" }, { onConflict: "user_id,role" });
        if (roleErr) return new Response(roleErr.message, { status: 500 });

        return Response.json({ ok: true, userId });
      },
    },
  },
});
