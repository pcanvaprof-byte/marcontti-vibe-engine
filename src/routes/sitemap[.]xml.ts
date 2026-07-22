import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { models } from "@/lib/models";

const BASE_URL = "https://althaciamoveis.shop";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/modelos", changefreq: "weekly", priority: "0.9" },
          { path: "/modelos?marca=yamaha", changefreq: "weekly", priority: "0.9" },
          { path: "/modelos?marca=sudu", changefreq: "weekly", priority: "0.9" },
          { path: "/modelos?marca=klug", changefreq: "weekly", priority: "0.9" },
          { path: "/modelos?cat=triciclo", changefreq: "weekly", priority: "0.8" },
          { path: "/comparar", changefreq: "monthly", priority: "0.7" },
          { path: "/financiamento", changefreq: "monthly", priority: "0.8" },
          { path: "/garantia", changefreq: "yearly", priority: "0.5" },
          { path: "/sobre", changefreq: "yearly", priority: "0.6" },
          { path: "/faq", changefreq: "monthly", priority: "0.7" },
          { path: "/contato", changefreq: "monthly", priority: "0.8" },
          { path: "/privacidade", changefreq: "yearly", priority: "0.3" },
          ...models.map((m) => ({
            path: `/modelos/${m.slug}`,
            changefreq: "monthly",
            priority: "0.8",
          })),
        ];

        const escapeXml = (s: string) =>
          s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

        const urls = entries
          .map(
            (e) =>
              `  <url>\n    <loc>${escapeXml(BASE_URL + e.path)}</loc>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`,
          )
          .join("\n");

        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
