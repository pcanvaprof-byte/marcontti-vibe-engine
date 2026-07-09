import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { X, Plus } from "lucide-react";
import { PageLayout } from "@/components/PageLayout";
import { models } from "@/lib/models";

const BASE_URL = "https://proototipomotos.lovable.app";

export const Route = createFileRoute("/comparar")({
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

const SPEC_KEYS = ["Autonomia", "Velocidade máx.", "Potência", "Bateria", "Capacidade", "Habilitação"];

function CompararPage() {
  const [selected, setSelected] = useState<string[]>([
    models[0]?.slug,
    models[1]?.slug,
    models[2]?.slug,
  ].filter(Boolean) as string[]);

  const chosen = selected.map((s) => models.find((m) => m.slug === s)).filter(Boolean) as typeof models;

  function setAt(i: number, slug: string) {
    const next = [...selected];
    next[i] = slug;
    setSelected(next);
  }

  function removeAt(i: number) {
    setSelected(selected.filter((_, idx) => idx !== i));
  }

  function addSlot() {
    if (selected.length >= 3) return;
    const first = models.find((m) => !selected.includes(m.slug));
    if (first) setSelected([...selected, first.slug]);
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
                <th key={m.slug} className="p-4 align-top border-l border-border">
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
              {chosen.map((m) => (
                <td key={m.slug} className="p-4 border-t border-l border-border text-primary font-display font-black text-lg">
                  {m.price}
                </td>
              ))}
            </Row>
            <Row label="Categoria">
              {chosen.map((m) => (
                <td key={m.slug} className="p-4 border-t border-l border-border text-sm text-white/80">
                  {m.tag}
                </td>
              ))}
            </Row>
            {SPEC_KEYS.map((label) => (
              <Row key={label} label={label}>
                {chosen.map((m) => {
                  const found = m.specs.find((s) => s.label.toLowerCase().includes(label.toLowerCase().split(" ")[0]));
                  return (
                    <td key={m.slug} className="p-4 border-t border-l border-border text-sm text-white/80">
                      {found?.value ?? "—"}
                    </td>
                  );
                })}
              </Row>
            ))}
            <Row label="Ficha completa">
              {chosen.map((m) => (
                <td key={m.slug} className="p-4 border-t border-l border-border">
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
