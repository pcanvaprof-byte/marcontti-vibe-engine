import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { LogOut, Trash2, ArrowLeft, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/_authenticated/analytics")({
  head: () => ({
    meta: [
      { title: "Conversões — Klug Motors" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AnalyticsPage,
});

type Ev = {
  id: string;
  event_name: string;
  source: string | null;
  page: string | null;
  model_slug: string | null;
  created_at: string;
};

function AnalyticsPage() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [events, setEvents] = useState<Ev[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<7 | 30 | 90>(30);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: u }) => {
      if (!u.user) return;
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", u.user.id);
      setIsAdmin(!!roles?.some((r: any) => r.role === "admin"));
    });
  }, []);

  async function load() {
    setLoading(true);
    const since = new Date(Date.now() - range * 86400000).toISOString();
    const { data, error } = await supabase
      .from("analytics_events")
      .select("id,event_name,source,page,model_slug,created_at")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(1000);
    setLoading(false);
    if (error) return toast.error(error.message);
    setEvents((data ?? []) as Ev[]);
  }

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin, range]);

  async function clearAll() {
    if (!confirm(`Apagar TODOS os eventos dos últimos ${range} dias?`)) return;
    const since = new Date(Date.now() - range * 86400000).toISOString();
    const { error } = await supabase.from("analytics_events").delete().gte("created_at", since);
    if (error) return toast.error(error.message);
    toast.success("Eventos apagados");
    load();
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const e of events) map.set(e.event_name, (map.get(e.event_name) ?? 0) + 1);
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [events]);

  const bySource = useMemo(() => {
    const map = new Map<string, number>();
    for (const e of events) {
      const k = `${e.event_name} · ${e.source ?? "—"}`;
      map.set(k, (map.get(k) ?? 0) + 1);
    }
    return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 20);
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
          <Link to="/leads"><Button variant="ghost" size="sm">Leads</Button></Link>
          <div>
            <h1 className="text-xl font-bold">Conversões</h1>
            <p className="text-xs text-neutral-500">{events.length} eventos nos últimos {range} dias</p>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          {[7, 30, 90].map((n) => (
            <Button
              key={n}
              size="sm"
              variant={range === n ? "default" : "ghost"}
              onClick={() => setRange(n as 7 | 30 | 90)}
            >
              {n}d
            </Button>
          ))}
          <Button variant="ghost" size="sm" onClick={load}><RefreshCw className="w-4 h-4" /></Button>
          <Button variant="ghost" size="sm" onClick={clearAll} title="Apagar período"><Trash2 className="w-4 h-4 text-red-400" /></Button>
          <Button variant="ghost" size="sm" onClick={handleSignOut}><LogOut className="w-4 h-4" /></Button>
        </div>
      </header>

      <div className="p-6 space-y-8">
        {loading ? (
          <p className="text-neutral-500">Carregando...</p>
        ) : (
          <>
            <section>
              <h2 className="text-sm uppercase tracking-widest text-neutral-400 mb-3">Totais por evento</h2>
              {counts.length === 0 ? (
                <p className="text-neutral-500 text-sm">Nenhum evento no período.</p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {counts.map(([name, n]) => (
                    <div key={name} className="border border-neutral-800 rounded-xl p-4 bg-neutral-900/50">
                      <div className="text-xs uppercase tracking-widest text-neutral-400">{name}</div>
                      <div className="text-3xl font-bold mt-1">{n}</div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section>
              <h2 className="text-sm uppercase tracking-widest text-neutral-400 mb-3">Top origens</h2>
              <div className="border border-neutral-800 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-neutral-900 text-neutral-400">
                    <tr><th className="text-left p-3">Evento · Origem</th><th className="text-right p-3">Cliques</th></tr>
                  </thead>
                  <tbody>
                    {bySource.map(([k, n]) => (
                      <tr key={k} className="border-t border-neutral-800">
                        <td className="p-3 text-xs">{k}</td>
                        <td className="p-3 text-right font-medium">{n}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-sm uppercase tracking-widest text-neutral-400 mb-3">Últimos eventos</h2>
              <div className="border border-neutral-800 rounded-xl overflow-x-auto">
                <table className="w-full text-sm min-w-[720px]">
                  <thead className="bg-neutral-900 text-neutral-400">
                    <tr>
                      <th className="text-left p-3">Data</th>
                      <th className="text-left p-3">Evento</th>
                      <th className="text-left p-3">Origem</th>
                      <th className="text-left p-3">Modelo</th>
                      <th className="text-left p-3">Página</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.slice(0, 200).map((e) => (
                      <tr key={e.id} className="border-t border-neutral-800 hover:bg-neutral-900/60">
                        <td className="p-3 text-xs text-neutral-400 whitespace-nowrap">{new Date(e.created_at).toLocaleString("pt-BR")}</td>
                        <td className="p-3 text-xs uppercase">{e.event_name}</td>
                        <td className="p-3 text-xs text-neutral-400">{e.source ?? "—"}</td>
                        <td className="p-3 text-xs text-neutral-400">{e.model_slug ?? "—"}</td>
                        <td className="p-3 text-xs text-neutral-400 truncate max-w-xs">{e.page ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
