import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { X, Plus } from "lucide-react";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { PageLayout } from "@/components/PageLayout";
import { usePublicModels } from "@/hooks/useDbModels";

const BASE_URL = "https://proototipomotos.lovable.app";

const searchSchema = z.object({
  a: fallback(z.string().optional(), undefined),
  b: fallback(z.string().optional(), undefined),
  c: fallback(z.string().optional(), undefined),
});

export const Route = createFileRoute("/comparar")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "Comparar Modelos — Klug Motors" },
      { name: "description", content: "Compare motos e scooters elétricas da Klug Motors lado a lado: autonomia, velocidade, potência, bateria e preço. Escolha o modelo ideal." },
      { property: "og:title", content: "Comparar Modelos — Klug Motors" },
      { property: "og:description", content: "Tabela comparativa: autonomia, velocidade, potência, preço. Compare até 3 modelos ao mesmo tempo." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${BASE_URL}/comparar` },
    ],
    links: [{ rel: "canonical", href: `${BASE_URL}/comparar` }],
  }),
  component: CompararPage,
});

const SPEC_KEYS = ["Autonomia", "Velocidade", "Potência", "Bateria", "Capacidade", "Habilitação"];

function CompararPage() {
  const { items: models } = usePublicModels();
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/comparar" });

  const selected = useMemo(() => {
    const wanted = [search.a, search.b, search.c].filter(Boolean) as string[];
    const valid = wanted.filter((s) => models.some((m) => m.slug === s));
    if (valid.length) return valid;
    return models.slice(0, 3).map((m) => m.slug);
  }, [search.a, search.b, search.c, models]);

  const chosen = selected
    .map((s) => models.find((m) => m.slug === s))
    .filter(Boolean) as typeof models;

  function updateUrl(next: (string | undefined)[]) {
    const [a, b, c] = next;
    navigate({ search: { a, b, c }, replace: true });
  }

  function setAt(i: number, slug: string) {
    const next = [...selected];
    next[i] = slug;
    updateUrl(next);
  }

  function removeAt(i: number) {
    updateUrl(selected.filter((_, idx) => idx !== i));
  }

  function addSlot() {
    if (selected.length >= 3) return;
    const first = models.find((m) => !selected.includes(m.slug));
    if (first) updateUrl([...selected, first.slug]);
  }

  return (
    <PageLayout
      eyebrow="Ferramenta"
      title="Compare"
      titleAccent="modelos"
      intro="Escolha até 3 modelos para comparar lado a lado. Ideal para decidir entre potência, autonomia e categoria."
      maxWidth="max-w-6xl"
    >
      <div className="overflow-x-auto -mx-5 sm:mx-0">
        <table className="w-full min-w-[600px] border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="text-left p-4 text-[10px] uppercase tracking-widest text-white/40 font-display font-black align-top w-40">
                Especificação
              </th>
              {chosen.map((m, i) => (
                <th key={`${m.slug}-${i}`} className="p-4 align-top border-l border-border">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <select
                      value={m.slug}
                      onChange={(e) => setAt(i, e.target.value)}
                      className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-white font-display font-black uppercase tracking-wider flex-1 focus:border-primary focus:outline-none"
                      aria-label={`Modelo ${i + 1}`}
                    >
                      {models.map((opt) => (
                        <option key={opt.slug} value={opt.slug}>{opt.name}</option>
                      ))}
                    </select>
                    {chosen.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeAt(i)}
                        aria-label={`Remover ${m.name}`}
                        className="w-8 h-8 grid place-items-center rounded-lg border border-border text-white/60 hover:text-primary hover:border-primary transition-colors"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                  {m.colors[0]?.image && (
                    <img
                      src={m.colors[0].image}
                      alt={m.name}
                      loading="lazy"
                      className="w-full aspect-square object-contain bg-background rounded-lg border border-border"
                    />
                  )}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {m.colors.slice(0, 6).map((c) => (
                      <span
                        key={c.name}
                        title={c.name}
                        className="w-5 h-5 rounded-full border border-white/20"
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                    {m.colors.length > 6 && (
                      <span className="text-[10px] text-white/40 self-center">+{m.colors.length - 6}</span>
                    )}
                  </div>
                </th>
              ))}
              {chosen.length < 3 && (
                <th className="p-4 align-top border-l border-border">
                  <button
                    type="button"
                    onClick={addSlot}
                    className="w-full h-full min-h-[200px] grid place-items-center gap-2 border-2 border-dashed border-border rounded-lg text-white/40 hover:border-primary hover:text-primary transition-colors"
                    aria-label="Adicionar modelo para comparar"
                  >
                    <Plus size={24} />
                    <span className="text-xs uppercase tracking-widest font-display font-black">Adicionar</span>
                  </button>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            <Row label="Preço a partir de">
              {chosen.map((m, i) => (
                <td key={`${m.slug}-${i}`} className="p-4 border-t border-l border-border text-primary font-display font-black text-lg">
                  {m.price}
                </td>
              ))}
            </Row>
            <Row label="Categoria">
              {chosen.map((m, i) => (
                <td key={`${m.slug}-${i}`} className="p-4 border-t border-l border-border text-sm text-white/80">
                  {m.tag}
                </td>
              ))}
            </Row>
            <Row label="Cores">
              {chosen.map((m, i) => (
                <td key={`${m.slug}-${i}`} className="p-4 border-t border-l border-border text-sm text-white/80">
                  {m.colors.map((c) => c.name).join(", ") || "—"}
                </td>
              ))}
            </Row>
            {SPEC_KEYS.map((label) => (
              <Row key={label} label={label}>
                {chosen.map((m, i) => {
                  const key = label.toLowerCase().split(" ")[0];
                  const found = m.specs.find((s) => s.label.toLowerCase().includes(key));
                  return (
                    <td key={`${m.slug}-${i}`} className="p-4 border-t border-l border-border text-sm text-white/80">
                      {found?.value ?? "—"}
                    </td>
                  );
                })}
              </Row>
            ))}
            <Row label="Ficha completa">
              {chosen.map((m, i) => (
                <td key={`${m.slug}-${i}`} className="p-4 border-t border-l border-border">
                  <Link
                    to="/modelos/$slug"
                    params={{ slug: m.slug }}
                    className="inline-flex items-center gap-1 text-primary hover:underline text-xs font-display font-black uppercase tracking-widest"
                  >
                    Ver detalhes
                  </Link>
                </td>
              ))}
            </Row>
          </tbody>
        </table>
      </div>
    </PageLayout>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <tr>
      <td className="p-4 border-t border-border text-[10px] uppercase tracking-widest text-white/40 font-display font-black align-top">
        {label}
      </td>
      {children}
    </tr>
  );
}
