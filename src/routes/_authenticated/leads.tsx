import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Trash2, RefreshCw, Users, Search } from "lucide-react";
import { AdminShell, RowSkeleton, EmptyState } from "@/components/admin/AdminShell";

export const Route = createFileRoute("/_authenticated/leads")({
  head: () => ({
    meta: [
      { title: "Leads — Klug Motors" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: LeadsPage,
});

type Lead = {
  id: string;
  name: string;
  phone: string;
  model: string | null;
  entry: string | null;
  term: string | null;
  message: string | null;
  source: string;
  created_at: string;
};

function LeadsPage() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

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
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    setLoading(false);
    if (error) return toast.error(error.message);
    setLeads((data ?? []) as Lead[]);
  }

  useEffect(() => { if (isAdmin) load(); }, [isAdmin]);

  async function handleDelete(l: Lead) {
    if (!confirm(`Excluir lead de "${l.name}"?`)) return;
    const { error } = await supabase.from("leads").delete().eq("id", l.id);
    if (error) return toast.error(error.message);
    toast.success("Lead removido");
    load();
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const rows = leads.filter((l) => {
    if (!filter) return true;
    const f = filter.toLowerCase();
    return (
      l.name.toLowerCase().includes(f) ||
      l.phone.toLowerCase().includes(f) ||
      (l.model ?? "").toLowerCase().includes(f)
    );
  });

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
      <header className="border-b border-neutral-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/admin"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-1" /> Modelos</Button></Link>
          <div>
            <h1 className="text-xl font-bold">Leads recebidos</h1>
            <p className="text-xs text-neutral-500">{leads.length} solicitações</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={load}><RefreshCw className="w-4 h-4" /></Button>
          <Button variant="ghost" size="sm" onClick={handleSignOut}><LogOut className="w-4 h-4" /></Button>
        </div>
      </header>

      <div className="p-6 space-y-4">
        <Input placeholder="Buscar por nome, telefone ou modelo..." value={filter} onChange={(e) => setFilter(e.target.value)} className="max-w-md" />

        {loading ? (
          <p className="text-neutral-500">Carregando...</p>
        ) : rows.length === 0 ? (
          <p className="text-neutral-500 text-sm">Nenhum lead ainda.</p>
        ) : (
          <div className="border border-neutral-800 rounded-xl overflow-x-auto">
            <table className="w-full text-sm min-w-[900px]">
              <thead className="bg-neutral-900 text-neutral-400">
                <tr>
                  <th className="text-left p-3">Data</th>
                  <th className="text-left p-3">Nome</th>
                  <th className="text-left p-3">WhatsApp</th>
                  <th className="text-left p-3">Modelo</th>
                  <th className="text-left p-3">Entrada</th>
                  <th className="text-left p-3">Prazo</th>
                  <th className="text-left p-3">Origem</th>
                  <th className="text-right p-3">Ações</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((l) => (
                  <tr key={l.id} className="border-t border-neutral-800 hover:bg-neutral-900/60 align-top">
                    <td className="p-3 text-xs text-neutral-400 whitespace-nowrap">
                      {new Date(l.created_at).toLocaleString("pt-BR")}
                    </td>
                    <td className="p-3">
                      <div className="font-medium">{l.name}</div>
                      {l.message && <div className="text-xs text-neutral-500 mt-1 max-w-xs">{l.message}</div>}
                    </td>
                    <td className="p-3">
                      <a
                        href={`https://wa.me/55${l.phone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {l.phone}
                      </a>
                    </td>
                    <td className="p-3">{l.model ?? "—"}</td>
                    <td className="p-3 text-xs">{l.entry ?? "—"}</td>
                    <td className="p-3 text-xs">{l.term ?? "—"}</td>
                    <td className="p-3 text-xs uppercase text-neutral-400">{l.source}</td>
                    <td className="p-3 text-right">
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(l)}>
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
