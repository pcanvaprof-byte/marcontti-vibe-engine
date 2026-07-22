import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { LogOut, ArrowLeft, RefreshCw, ExternalLink, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/_authenticated/whatsapp")({
  head: () => ({
    meta: [
      { title: "WhatsApp — Klug Motors" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: WhatsappPage,
});

type EventRow = {
  id: string;
  event_name: string;
  source: string | null;
  page: string | null;
  model_slug: string | null;
  meta: Record<string, unknown> | null;
  user_agent: string | null;
  created_at: string;
};

function pickString(meta: Record<string, unknown> | null, key: string): string | null {
  if (!meta) return null;
  const v = meta[key];
  return typeof v === "string" && v.length > 0 ? v : null;
}

function WhatsappPage() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState<string>("all");

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: u }) => {
      if (!u.user) return;
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", u.user.id);
      setIsAdmin(!!roles?.some((r: any) => r.role === "admin"));
    });
  }, []);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("analytics_events")
      .select("*")
      .in("event_name", ["whatsapp_redirected", "whatsapp_click"])
      .order("created_at", { ascending: false })
      .limit(1000);
    setLoading(false);
    if (error) return toast.error(error.message);
    setEvents((data ?? []) as unknown as EventRow[]);
  }

  useEffect(() => { if (isAdmin) load(); }, [isAdmin]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const rows = useMemo(() => {
    return events.filter((e) => {
      if (sourceFilter !== "all" && (e.source ?? "") !== sourceFilter) return false;
      if (!filter) return true;
      const f = filter.toLowerCase();
      const name = (pickString(e.meta, "name") ?? "").toLowerCase();
      const phone = (pickString(e.meta, "phone") ?? "").toLowerCase();
      const email = (pickString(e.meta, "email") ?? "").toLowerCase();
      const model = (pickString(e.meta, "model") ?? e.model_slug ?? "").toLowerCase();
      return name.includes(f) || phone.includes(f) || email.includes(f) || model.includes(f);
    });
  }, [events, filter, sourceFilter]);

  const stats = useMemo(() => {
    const bySource = new Map<string, number>();
    events.forEach((e) => {
      const k = e.source ?? "—";
      bySource.set(k, (bySource.get(k) ?? 0) + 1);
    });
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = events.filter((e) => new Date(e.created_at) >= today).length;
    return { total: events.length, todayCount, bySource: Array.from(bySource.entries()) };
  }, [events]);

  const sources = useMemo(() => {
    const s = new Set<string>();
    events.forEach((e) => { if (e.source) s.add(e.source); });
    return Array.from(s).sort();
  }, [events]);

  if (isAdmin === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-neutral-100 p-8 text-center">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Sem permissão</h1>
          <Button variant="outline" onClick={handleSignOut}>Sair</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <header className="border-b border-neutral-800 px-6 py-4 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Link to="/admin"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-1" /> Modelos</Button></Link>
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-[#25D366]" />
              Redirecionamentos WhatsApp
            </h1>
            <p className="text-xs text-neutral-500">
              {stats.total} clique(s) · {stats.todayCount} hoje
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link to="/leads"><Button variant="ghost" size="sm">Leads</Button></Link>
          <Link to="/analytics"><Button variant="ghost" size="sm">Analytics</Button></Link>
          <Button variant="ghost" size="sm" onClick={load}><RefreshCw className="w-4 h-4" /></Button>
          <Button variant="ghost" size="sm" onClick={handleSignOut}><LogOut className="w-4 h-4" /></Button>
        </div>
      </header>

      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="border border-neutral-800 rounded-xl p-4">
            <p className="text-xs text-neutral-500 uppercase">Total</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="border border-neutral-800 rounded-xl p-4">
            <p className="text-xs text-neutral-500 uppercase">Hoje</p>
            <p className="text-2xl font-bold">{stats.todayCount}</p>
          </div>
          {stats.bySource.slice(0, 2).map(([src, n]) => (
            <div key={src} className="border border-neutral-800 rounded-xl p-4">
              <p className="text-xs text-neutral-500 uppercase truncate">{src}</p>
              <p className="text-2xl font-bold">{n}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <Input
            placeholder="Buscar por nome, telefone, e-mail ou modelo..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="max-w-md"
          />
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="bg-neutral-900 border border-neutral-800 text-sm rounded-md px-3"
          >
            <option value="all">Todas as origens</option>
            {sources.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {loading ? (
          <p className="text-neutral-500">Carregando...</p>
        ) : rows.length === 0 ? (
          <p className="text-neutral-500 text-sm">Nenhum clique de WhatsApp registrado ainda.</p>
        ) : (
          <div className="border border-neutral-800 rounded-xl overflow-x-auto">
            <table className="w-full text-sm min-w-[900px]">
              <thead className="bg-neutral-900 text-neutral-400">
                <tr>
                  <th className="text-left p-3">Data</th>
                  <th className="text-left p-3">Nome</th>
                  <th className="text-left p-3">WhatsApp</th>
                  <th className="text-left p-3">Modelo</th>
                  <th className="text-left p-3">Origem</th>
                  <th className="text-left p-3">Página</th>
                  <th className="text-left p-3">Detalhes</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((e) => {
                  const name = pickString(e.meta, "name");
                  const phone = pickString(e.meta, "phone");
                  const email = pickString(e.meta, "email");
                  const model = pickString(e.meta, "model") ?? e.model_slug;
                  const payment = pickString(e.meta, "payment_type");
                  const digits = phone ? phone.replace(/\D/g, "") : null;
                  return (
                    <tr key={e.id} className="border-t border-neutral-800 hover:bg-neutral-900/60 align-top">
                      <td className="p-3 text-xs text-neutral-400 whitespace-nowrap">
                        {new Date(e.created_at).toLocaleString("pt-BR")}
                      </td>
                      <td className="p-3">
                        <div className="font-medium">{name ?? <span className="text-neutral-600">—</span>}</div>
                        {email && <div className="text-xs text-neutral-500 mt-0.5">{email}</div>}
                      </td>
                      <td className="p-3">
                        {phone && digits ? (
                          <a
                            href={`https://wa.me/55${digits}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline inline-flex items-center gap-1"
                          >
                            {phone}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-neutral-600">—</span>
                        )}
                      </td>
                      <td className="p-3">{model ?? <span className="text-neutral-600">—</span>}</td>
                      <td className="p-3 text-xs uppercase text-neutral-400">
                        {e.source ?? "—"}
                        <div className="text-[10px] text-neutral-600 normal-case mt-0.5">{e.event_name}</div>
                      </td>
                      <td className="p-3 text-xs text-neutral-500 max-w-[200px] truncate" title={e.page ?? ""}>
                        {e.page ?? "—"}
                      </td>
                      <td className="p-3 text-xs text-neutral-400">
                        {payment && <div><span className="text-neutral-600">Pagamento:</span> {payment}</div>}
                        {pickString(e.meta, "credit") && <div><span className="text-neutral-600">Crédito:</span> {pickString(e.meta, "credit")}</div>}
                        {pickString(e.meta, "budget") && <div><span className="text-neutral-600">Parcela:</span> {pickString(e.meta, "budget")}</div>}
                        {pickString(e.meta, "entry") && <div><span className="text-neutral-600">Entrada:</span> {pickString(e.meta, "entry")}</div>}
                        {pickString(e.meta, "term") && <div><span className="text-neutral-600">Prazo:</span> {pickString(e.meta, "term")}</div>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
