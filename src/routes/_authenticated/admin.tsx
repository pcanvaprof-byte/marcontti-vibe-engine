import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAdminModels, type DbModel } from "@/hooks/useDbModels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { LogOut, Plus, Pencil, Trash2, Upload } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Klug Motors" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminPage,
});

type Draft = Partial<DbModel> & { slug: string; name: string; brand: string };

const emptyDraft: Draft = {
  slug: "",
  brand: "klug",
  name: "",
  tag: "",
  price: "Consultar disponibilidade",
  price_number: 0,
  range_km: "",
  speed: "",
  power: "",
  short_description: "",
  description: "",
  colors: [],
  specs: [],
  features: [],
  gallery: [],
  is_active: true,
  sort_order: 0,
};

function AdminPage() {
  const navigate = useNavigate();
  const { data, isLoading, refetch } = useAdminModels();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [filter, setFilter] = useState("");
  const [editing, setEditing] = useState<Draft | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: u }) => {
      if (!u.user) return;
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", u.user.id);
      setIsAdmin(!!roles?.some((r: any) => r.role === "admin"));
    });
  }, []);

  const rows = useMemo(() => {
    const list = data ?? [];
    if (!filter) return list;
    const f = filter.toLowerCase();
    return list.filter((m) => m.name.toLowerCase().includes(f) || m.slug.toLowerCase().includes(f) || m.brand.toLowerCase().includes(f));
  }, [data, filter]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  async function handleDelete(m: DbModel) {
    if (!confirm(`Excluir "${m.name}"?`)) return;
    const { error } = await supabase.from("models").delete().eq("id", m.id);
    if (error) return toast.error(error.message);
    toast.success("Modelo removido");
    refetch();
  }

  async function handleToggle(m: DbModel) {
    const { error } = await supabase.from("models").update({ is_active: !m.is_active }).eq("id", m.id);
    if (error) return toast.error(error.message);
    refetch();
  }

  if (isAdmin === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-neutral-100 p-8 text-center">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Sem permissão</h1>
          <p className="text-neutral-400">Sua conta não tem papel de administrador.</p>
          <Button variant="outline" onClick={handleSignOut}>Sair</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <header className="border-b border-neutral-800 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Painel de Modelos</h1>
          <p className="text-xs text-neutral-500">{data?.length ?? 0} modelos no catálogo</p>
        </div>
        <div className="flex gap-2">
          <Link to="/"><Button variant="ghost" size="sm">Ver site</Button></Link>
          <Link to="/leads"><Button variant="ghost" size="sm">Leads</Button></Link>
          <Button size="sm" onClick={() => setEditing({ ...emptyDraft })}>
            <Plus className="w-4 h-4 mr-1" /> Novo modelo
          </Button>
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </header>

      <div className="p-6 space-y-4">
        <Input placeholder="Buscar por nome, slug ou marca..." value={filter} onChange={(e) => setFilter(e.target.value)} className="max-w-md" />

        {isLoading ? (
          <p className="text-neutral-500">Carregando...</p>
        ) : (
          <div className="border border-neutral-800 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-neutral-900 text-neutral-400">
                <tr>
                  <th className="text-left p-3">Modelo</th>
                  <th className="text-left p-3">Marca</th>
                  <th className="text-left p-3">Preço</th>
                  <th className="text-left p-3">Ativo</th>
                  <th className="text-right p-3">Ações</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((m) => (
                  <tr key={m.id} className="border-t border-neutral-800 hover:bg-neutral-900/60">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        {m.colors?.[0]?.image ? (
                          <img src={m.colors[0].image} alt="" className="w-12 h-12 rounded object-cover bg-neutral-800" />
                        ) : (
                          <div className="w-12 h-12 rounded bg-neutral-800" />
                        )}
                        <div>
                          <div className="font-medium">{m.name}</div>
                          <div className="text-xs text-neutral-500">/{m.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 uppercase text-xs">{m.brand}</td>
                    <td className="p-3">{m.price}</td>
                    <td className="p-3">
                      <Switch checked={m.is_active} onCheckedChange={() => handleToggle(m)} />
                    </td>
                    <td className="p-3 text-right">
                      <Button size="sm" variant="ghost" onClick={() => setEditing(m as any)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(m)}>
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

      {editing && (
        <EditDialog
          draft={editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); refetch(); }}
        />
      )}
    </div>
  );
}

function EditDialog({ draft, onClose, onSaved }: { draft: Draft; onClose: () => void; onSaved: () => void }) {
  const [d, setD] = useState<Draft>(draft);
  const [saving, setSaving] = useState(false);
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  function set<K extends keyof Draft>(k: K, v: Draft[K]) {
    setD((prev) => ({ ...prev, [k]: v }));
  }

  async function uploadFile(file: File): Promise<string> {
    const ext = file.name.split(".").pop() || "jpg";
    const safe = (d.slug || "novo").replace(/[^a-z0-9-]/gi, "-").toLowerCase();
    const path = `${safe}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from("model-images").upload(path, file, { upsert: true, contentType: file.type });
    if (error) throw error;
    return `/api/public/model-images/${path}`;
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingMain(true);
    try {
      const url = await uploadFile(file);
      const currentColors = d.colors ?? [];
      const newColors = currentColors.length > 0
        ? currentColors.map((c, i) => i === 0 ? { ...c, image: url } : c)
        : [{ name: "Padrão", hex: "#1a1a1a", image: url }];
      set("colors", newColors);
      toast.success("Imagem principal enviada");
    } catch (err: any) {
      toast.error(err.message ?? "Falha no upload");
    } finally {
      setUploadingMain(false);
      e.target.value = "";
    }
  }

  async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploadingGallery(true);
    try {
      const urls: string[] = [];
      for (const f of files) urls.push(await uploadFile(f));
      set("gallery", [...(d.gallery ?? []), ...urls]);
      toast.success(`${urls.length} imagem(ns) adicionada(s)`);
    } catch (err: any) {
      toast.error(err.message ?? "Falha no upload");
    } finally {
      setUploadingGallery(false);
      e.target.value = "";
    }
  }

  function removeGalleryItem(idx: number) {
    set("gallery", (d.gallery ?? []).filter((_, i) => i !== idx));
  }

  async function handleSave() {
    if (!d.slug || !d.name || !d.brand) {
      toast.error("Slug, nome e marca são obrigatórios");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        slug: d.slug,
        brand: d.brand,
        name: d.name,
        tag: d.tag ?? "",
        price: d.price ?? "Consultar disponibilidade",
        price_number: d.price_number ?? 0,
        range_km: d.range_km ?? "",
        speed: d.speed ?? "",
        power: d.power ?? "",
        short_description: d.short_description ?? "",
        description: d.description ?? "",
        colors: d.colors ?? [],
        specs: d.specs ?? [],
        features: d.features ?? [],
        gallery: d.gallery ?? [],
        is_active: d.is_active ?? true,
        sort_order: d.sort_order ?? 0,
      };
      const { error } = (d as any).id
        ? await supabase.from("models").update(payload).eq("id", (d as any).id)
        : await supabase.from("models").insert(payload);
      if (error) throw error;
      toast.success("Salvo");
      onSaved();
    } catch (err: any) {
      toast.error(err.message ?? "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  const preview = d.colors?.[0]?.image;

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-neutral-950 border-neutral-800 text-neutral-100">
        <DialogHeader>
          <DialogTitle>{(d as any).id ? "Editar modelo" : "Novo modelo"}</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Slug (URL)"><Input value={d.slug} onChange={(e) => set("slug", e.target.value)} /></Field>
          <Field label="Marca">
            <select value={d.brand} onChange={(e) => set("brand", e.target.value)}
              className="w-full h-10 rounded-md border border-neutral-800 bg-neutral-900 px-3 text-sm">
              <option value="klug">Klug</option>
              <option value="sudu">SUDU</option>
              <option value="yamaha">Yamaha</option>
            </select>
          </Field>
          <Field label="Nome"><Input value={d.name} onChange={(e) => set("name", e.target.value)} /></Field>
          <Field label="Tag / Categoria"><Input value={d.tag ?? ""} onChange={(e) => set("tag", e.target.value)} /></Field>
          <Field label="Preço (texto)"><Input value={d.price ?? ""} onChange={(e) => set("price", e.target.value)} /></Field>
          <Field label="Preço (número)">
            <Input type="number" value={d.price_number ?? 0} onChange={(e) => set("price_number", Number(e.target.value))} />
          </Field>
          <Field label="Autonomia"><Input value={d.range_km ?? ""} onChange={(e) => set("range_km", e.target.value)} /></Field>
          <Field label="Velocidade"><Input value={d.speed ?? ""} onChange={(e) => set("speed", e.target.value)} /></Field>
          <Field label="Potência"><Input value={d.power ?? ""} onChange={(e) => set("power", e.target.value)} /></Field>
          <Field label="Ordem"><Input type="number" value={d.sort_order ?? 0} onChange={(e) => set("sort_order", Number(e.target.value))} /></Field>
        </div>

        <Field label="Descrição curta">
          <Input value={d.short_description ?? ""} onChange={(e) => set("short_description", e.target.value)} />
        </Field>
        <Field label="Descrição completa">
          <Textarea rows={4} value={d.description ?? ""} onChange={(e) => set("description", e.target.value)} />
        </Field>

        <div className="space-y-2">
          <Label>Imagem principal</Label>
          <div className="flex items-center gap-4">
            {preview && <img src={preview} alt="" className="w-24 h-24 rounded object-cover bg-neutral-800" />}
            <label className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-neutral-800 hover:bg-neutral-700 cursor-pointer text-sm">
              <Upload className="w-4 h-4" /> {uploading ? "Enviando..." : "Enviar imagem"}
              <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
            </label>
            <Input
              placeholder="Ou cole uma URL de imagem"
              value={preview ?? ""}
              onChange={(e) => set("colors", [{ name: d.colors?.[0]?.name ?? "Padrão", hex: d.colors?.[0]?.hex ?? "#1a1a1a", image: e.target.value }, ...(d.colors ?? []).slice(1)])}
            />
          </div>
        </div>

        <Field label="Specs (JSON: [{label, value}])">
          <Textarea rows={4} value={JSON.stringify(d.specs ?? [], null, 2)}
            onChange={(e) => { try { set("specs", JSON.parse(e.target.value)); } catch {} }} />
        </Field>
        <Field label="Features (JSON: string[])">
          <Textarea rows={3} value={JSON.stringify(d.features ?? [], null, 2)}
            onChange={(e) => { try { set("features", JSON.parse(e.target.value)); } catch {} }} />
        </Field>

        <div className="flex items-center gap-3">
          <Switch checked={d.is_active ?? true} onCheckedChange={(v) => set("is_active", v)} />
          <Label>Ativo (visível no site)</Label>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave} disabled={saving}>{saving ? "Salvando..." : "Salvar"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-neutral-400">{label}</Label>
      {children}
    </div>
  );
}
