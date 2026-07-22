import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/model-images/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const path = (params as unknown as { _splat: string })._splat;
        if (!path) return new Response("Not found", { status: 404 });

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data, error } = await supabaseAdmin.storage.from("model-images").download(path);
        if (error || !data) return new Response("Not found", { status: 404 });

        return new Response(data, {
          headers: {
            "Content-Type": data.type || "image/jpeg",
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      },
    },
  },
});
