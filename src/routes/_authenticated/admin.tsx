import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAdminModels, normalizeGallery, type DbModel, type GalleryItem } from "@/hooks/useDbModels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Upload, Eye, EyeOff, GripVertical, Bike, Search } from "lucide-react";
import { AdminShell, CardSkeleton, EmptyState } from "@/components/admin/AdminShell";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableGalleryTile({
  id,
  item,
  isCover,
  onSetCover,
  onToggleHidden,
  onRemove,
}: {
  id: string;
  item: GalleryItem;
  isCover?: boolean;
  onSetCover: () => void;
  onToggleHidden: () => void;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined,
    opacity: isDragging ? 0.7 : 1,
  };
  return (
    <div ref={setNodeRef} style={style} className="relative group touch-none">
      <img
        src={item.url}
        alt=""
        className={`w-full aspect-square rounded object-cover bg-neutral-800 ${item.hidden ? "opacity-40 grayscale" : ""}`}
        draggable={false}
      />
      {item.hidden && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <EyeOff className="w-5 h-5 text-white/80" />
        </div>
      )}
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="absolute top-1 left-1 bg-neutral-900/90 hover:bg-neutral-800 text-white rounded p-1 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Arrastar para reordenar"
        title="Arrastar para reordenar"
      >
        <GripVertical className="w-3 h-3" />
      </button>
      <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={onToggleHidden}
          className="bg-neutral-900/90 hover:bg-neutral-800 text-white rounded p-1"
          aria-label={item.hidden ? "Publicar" : "Ocultar"}
          title={item.hidden ? "Publicar" : "Ocultar"}
        >
          {item.hidden ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="bg-red-500/90 hover:bg-red-600 text-white rounded p-1"
          aria-label="Remover"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
      {isCover ? (
        <span className="absolute bottom-1 left-1 right-1 inline-flex items-center justify-center gap-1 text-[10px] font-semibold rounded bg-emerald-500/90 text-black py-1">
          <Star className="w-3 h-3" fill="currentColor" /> Capa
        </span>
      ) : (
        <button
          type="button"
          onClick={onSetCover}
          title="Definir como imagem do card"
          className="absolute bottom-1 left-1 right-1 inline-flex items-center justify-center gap-1 text-[10px] font-semibold rounded bg-neutral-900/90 hover:bg-primary hover:text-black text-white py-1 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Star className="w-3 h-3" /> Definir como capa
        </button>
      )}
    </div>
  );
}

const isSemiNova = (m: DbModel) =>
  m.condition === "semi_nova" || m.slug.startsWith("semi-nova-") || /semi\s*nova/i.test(m.tag ?? "");

const BRAND_GROUPS: { key: string; label: string; match: (m: DbModel) => boolean }[] = [
  { key: "klug-scooter", label: "Scooter Elétricas Moto Chefe", match: (m) => m.brand === "klug" && !/tricicl/i.test(m.tag ?? "") && !isSemiNova(m) },
  { key: "sudu-scooter", label: "Scooter Elétricas Sudu", match: (m) => m.brand === "sudu" && !/tricicl/i.test(m.tag ?? "") && !isSemiNova(m) },
  { key: "triciclo", label: "Triciclos Elétricos", match: (m) => /tricicl/i.test(m.tag ?? "") && !isSemiNova(m) },
  { key: "yamaha", label: "Motos Yamaha 0km", match: (m) => m.brand === "yamaha" && !isSemiNova(m) },
  { key: "semi-novas", label: "Motos Semi Novas", match: isSemiNova },
];

function ModelsByCategory({
  rows,
  onEdit,
  onDelete,
  onToggle,
}: {
  rows: DbModel[];
  onEdit: (m: DbModel) => void;
  onDelete: (m: DbModel) => void;
  onToggle: (m: DbModel) => void;
}) {
  const groups = BRAND_GROUPS.map((g) => ({ ...g, items: rows.filter(g.match) }));
  const grouped = new Set(groups.flatMap((g) => g.items.map((m) => m.id)));
  const others = rows.filter((m) => !grouped.has(m.id));
  const all = [...groups, ...(others.length ? [{ key: "outros", label: "Outros", items: others }] : [])];

  return (
    <div className="space-y-8">
      {all.map((g) => (
        g.items.length === 0 ? null : (
          <section key={g.key}>
            <div className="flex items-baseline justify-between mb-3">
              <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-300">{g.label}</h2>
              <span className="text-[10px] text-neutral-500">{g.items.length} modelo(s)</span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-3">
              {g.items.map((m) => (
                <article
                  key={m.id}
                  className={`group relative rounded-lg border border-neutral-800 bg-neutral-900/50 overflow-hidden flex flex-col hover:border-neutral-600 transition-colors ${!m.is_active ? "opacity-60" : ""}`}
                >
                  <div className="aspect-[4/3] bg-neutral-800 relative overflow-hidden">
                    {m.colors?.[0]?.image ? (
                      <img src={m.colors[0].image} alt={m.name} className="w-full h-full object-contain p-2" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-600 text-[10px]">Sem imagem</div>
                    )}
                    <span className="absolute top-1 left-1 text-[9px] uppercase tracking-wider bg-neutral-950/80 px-1.5 py-0.5 rounded">{m.brand}</span>
                  </div>
                  <div className="p-2 flex-1 flex flex-col gap-1">
                    <div>
                      <h3 className="font-semibold text-xs leading-tight line-clamp-1">{m.name}</h3>
                      <p className="text-[10px] text-neutral-500 mt-0.5">/{m.slug}</p>
                    </div>
                    <p className="text-[10px] text-neutral-400 line-clamp-1">{m.price}</p>
                    <div className="mt-auto pt-2 flex items-center justify-between border-t border-neutral-800">
                      <label className="flex items-center gap-1.5 text-[10px] text-neutral-400">
                        <Switch checked={m.is_active} onCheckedChange={() => onToggle(m)} className="scale-75 origin-left" />
                        <span className="hidden sm:inline">{m.is_active ? "Ativo" : "Inativo"}</span>
                      </label>
                      <div className="flex gap-0.5">
                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => onEdit(m)} aria-label="Editar">
                          <Pencil className="w-3 h-3" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => onDelete(m)} aria-label="Excluir">
                          <Trash2 className="w-3 h-3 text-red-400" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )
      ))}
      {rows.length === 0 && <p className="text-neutral-500 text-sm">Nenhum modelo encontrado.</p>}
    </div>
  );
}

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
  condition: "zero_km",
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
    <AdminShell
      title="Painel de Modelos"
      subtitle={`${data?.length ?? 0} modelos no catálogo`}
      actions={
        <Button size="sm" onClick={() => setEditing({ ...emptyDraft })} className="gap-1">
          <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Novo modelo</span>
        </Button>
      }
    >
      <div className="space-y-6">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" />
          <Input
            placeholder="Buscar por nome, slug ou marca..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="pl-9"
            aria-label="Buscar modelos"
          />
        </div>

        {isLoading ? (
          <CardSkeleton count={12} />
        ) : rows.length === 0 ? (
          <EmptyState
            icon={Bike}
            title={filter ? "Nada encontrado" : "Nenhum modelo cadastrado"}
            description={
              filter
                ? "Tente ajustar sua busca ou limpar o filtro."
                : "Cadastre o primeiro modelo para começar a popular o catálogo."
            }
            action={
              <Button size="sm" onClick={() => setEditing({ ...emptyDraft })}>
                <Plus className="w-4 h-4 mr-1" /> Novo modelo
              </Button>
            }
          />
        ) : (
          <ModelsByCategory
            rows={rows}
            onEdit={(m) => setEditing(m)}
            onDelete={handleDelete}
            onToggle={handleToggle}
          />
        )}
      </div>

      {editing && (
        <EditDialog
          draft={editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); refetch(); }}
        />
      )}
    </AdminShell>
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

  async function removeBg(file: File): Promise<File> {
    try {
      const { removeBackground } = await import("@imgly/background-removal");
      const blob = await removeBackground(file, { output: { format: "image/png" } });
      const base = file.name.replace(/\.[^.]+$/, "");
      return new File([blob], `${base}-nobg.png`, { type: "image/png" });
    } catch (err) {
      console.error("[bg-removal] falhou, enviando original:", err);
      return file;
    }
  }

  async function uploadFile(file: File, opts?: { removeBackground?: boolean }): Promise<string> {
    const finalFile = opts?.removeBackground ? await removeBg(file) : file;
    const ext = finalFile.name.split(".").pop() || "jpg";
    const safe = (d.slug || "novo").replace(/[^a-z0-9-]/gi, "-").toLowerCase();
    const path = `${safe}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from("model-images").upload(path, finalFile, { upsert: true, contentType: finalFile.type });
    if (error) throw error;
    return `/api/public/model-images/${path}`;
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingMain(true);
    try {
      toast.info("Removendo fundo da imagem hero...");
      const url = await uploadFile(file, { removeBackground: true });
      const currentColors = d.colors ?? [];
      const newColors = currentColors.length > 0
        ? currentColors.map((c, i) => i === 0 ? { ...c, image: url } : c)
        : [{ name: "Padrão", hex: "#1a1a1a", image: url }];
      set("colors", newColors);
      toast.success("Imagem principal enviada (fundo removido)");
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
      const items: GalleryItem[] = [];
      for (const f of files) items.push({ url: await uploadFile(f) });
      set("gallery", [...normalizeGallery(d.gallery), ...items]);
      toast.success(`${items.length} imagem(ns) adicionada(s)`);
    } catch (err: any) {
      toast.error(err.message ?? "Falha no upload");
    } finally {
      setUploadingGallery(false);
      e.target.value = "";
    }
  }

  function removeGalleryItem(idx: number) {
    set("gallery", normalizeGallery(d.gallery).filter((_, i) => i !== idx));
  }

  function toggleGalleryHidden(idx: number) {
    set("gallery", normalizeGallery(d.gallery).map((g, i) => i === idx ? { ...g, hidden: !g.hidden } : g));
  }

  function reorderGallery(fromIdx: number, toIdx: number) {
    set("gallery", arrayMove(normalizeGallery(d.gallery), fromIdx, toIdx));
  }

  const dndSensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function toggleMainHidden() {
    const cs = d.colors ?? [];
    if (!cs.length) return;
    set("colors", cs.map((c, i) => i === 0 ? { ...c, hidden: !c.hidden } : c));
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
        condition: d.condition ?? "zero_km",
      };
      const { error } = d.id
        ? await supabase.from("models").update(payload).eq("id", d.id)
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
  const mainHidden = !!d.colors?.[0]?.hidden;
  const galleryItems = normalizeGallery(d.gallery);

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-neutral-950 border-neutral-800 text-neutral-100">
        <DialogHeader>
          <DialogTitle>{d.id ? "Editar modelo" : "Novo modelo"}</DialogTitle>
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
          <Field label="Status">
            <select
              value={d.condition ?? "zero_km"}
              onChange={(e) => set("condition", e.target.value as "zero_km" | "semi_nova")}
              className="w-full h-10 rounded-md border border-neutral-800 bg-neutral-900 px-3 text-sm"
            >
              <option value="zero_km">0km (Nova)</option>
              <option value="semi_nova">Semi Nova</option>
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
          <div className="flex items-center justify-between gap-2">
            <Label>Imagem principal</Label>
            {preview && (
              <button
                type="button"
                onClick={toggleMainHidden}
                className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md border ${mainHidden ? "bg-neutral-900 border-neutral-700 text-neutral-400" : "bg-emerald-500/10 border-emerald-500/40 text-emerald-300"}`}
              >
                {mainHidden ? <><EyeOff className="w-3.5 h-3.5" /> Oculta</> : <><Eye className="w-3.5 h-3.5" /> Publicada</>}
              </button>
            )}
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            {preview && (
              <div className="relative">
                <img src={preview} alt="" className={`w-24 h-24 rounded object-cover bg-neutral-800 ${mainHidden ? "opacity-40 grayscale" : ""}`} />
                {mainHidden && <div className="absolute inset-0 flex items-center justify-center"><EyeOff className="w-6 h-6 text-white/80" /></div>}
              </div>
            )}
            <label className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-neutral-800 hover:bg-neutral-700 cursor-pointer text-sm">
              <Upload className="w-4 h-4" /> {uploadingMain ? "Enviando..." : "Escolher arquivo"}
              <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploadingMain} />
            </label>
            <Input
              placeholder="Ou cole uma URL de imagem"
              value={preview ?? ""}
              onChange={(e) => set("colors", [{ name: d.colors?.[0]?.name ?? "Padrão", hex: d.colors?.[0]?.hex ?? "#1a1a1a", image: e.target.value, hidden: d.colors?.[0]?.hidden }, ...(d.colors ?? []).slice(1)])}
              className="flex-1 min-w-[200px]"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Galeria de imagens</Label>
          <div className="flex items-center gap-3 flex-wrap">
            <label className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-neutral-800 hover:bg-neutral-700 cursor-pointer text-sm">
              <Upload className="w-4 h-4" /> {uploadingGallery ? "Enviando..." : "Adicionar imagens"}
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryUpload} disabled={uploadingGallery} />
            </label>
            <span className="text-xs text-neutral-500">
              {galleryItems.length} imagem(ns) · {galleryItems.filter((g) => !g.hidden).length} publicada(s)
            </span>
          </div>
          {galleryItems.length > 0 && (
            <DndContext
              sensors={dndSensors}
              collisionDetection={closestCenter}
              onDragEnd={(e: DragEndEvent) => {
                const { active, over } = e;
                if (!over || active.id === over.id) return;
                const from = galleryItems.findIndex((_, i) => `g-${i}` === active.id);
                const to = galleryItems.findIndex((_, i) => `g-${i}` === over.id);
                if (from >= 0 && to >= 0) reorderGallery(from, to);
              }}
            >
              <SortableContext items={galleryItems.map((_, i) => `g-${i}`)} strategy={rectSortingStrategy}>
                <div className="grid grid-cols-4 md:grid-cols-6 gap-2 mt-2">
                  {galleryItems.map((g, i) => (
                    <SortableGalleryTile
                      key={`g-${i}`}
                      id={`g-${i}`}
                      item={g}
                      onToggleHidden={() => toggleGalleryHidden(i)}
                      onRemove={() => removeGalleryItem(i)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>

        <SpecsEditor
          specs={(d.specs as Array<{ label: string; value: string }>) ?? []}
          onChange={(v) => set("specs", v as any)}
        />
        <FeaturesEditor
          features={(d.features as string[]) ?? []}
          onChange={(v) => set("features", v as any)}
        />
        <Field label='Cores (avançado — JSON: [{"name","hex","image","gallery":["url"],"hidden":false}])'>
          <Textarea rows={6} value={JSON.stringify(d.colors ?? [], null, 2)}
            onChange={(e) => { try { set("colors", JSON.parse(e.target.value)); } catch {} }} />
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

function SpecsEditor({
  specs,
  onChange,
}: {
  specs: Array<{ label: string; value: string }>;
  onChange: (v: Array<{ label: string; value: string }>) => void;
}) {
  const rows = Array.isArray(specs) ? specs : [];
  const update = (i: number, patch: Partial<{ label: string; value: string }>) =>
    onChange(rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  const remove = (i: number) => onChange(rows.filter((_, idx) => idx !== i));
  const add = () => onChange([...rows, { label: "", value: "" }]);
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs text-neutral-400">
          Ficha técnica ({rows.length} {rows.length === 1 ? "item" : "itens"})
        </Label>
        <Button type="button" size="sm" variant="secondary" onClick={add}>
          <Plus className="w-3.5 h-3.5 mr-1" /> Adicionar spec
        </Button>
      </div>
      {rows.length === 0 && (
        <p className="text-xs text-neutral-500">Nenhuma spec ainda. Ex.: Motor / 149 cc, Potência / 12,9 cv.</p>
      )}
      <div className="space-y-2">
        {rows.map((r, i) => (
          <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2">
            <Input
              placeholder="Rótulo (ex: Motor)"
              value={r.label}
              onChange={(e) => update(i, { label: e.target.value })}
            />
            <Input
              placeholder="Valor (ex: 149 cc, 4 tempos)"
              value={r.value}
              onChange={(e) => update(i, { value: e.target.value })}
            />
            <Button type="button" size="icon" variant="ghost" onClick={() => remove(i)} title="Remover">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeaturesEditor({
  features,
  onChange,
}: {
  features: string[];
  onChange: (v: string[]) => void;
}) {
  const rows = Array.isArray(features) ? features : [];
  const update = (i: number, v: string) => onChange(rows.map((r, idx) => (idx === i ? v : r)));
  const remove = (i: number) => onChange(rows.filter((_, idx) => idx !== i));
  const add = () => onChange([...rows, ""]);
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs text-neutral-400">
          Destaques ({rows.length} {rows.length === 1 ? "item" : "itens"})
        </Label>
        <Button type="button" size="sm" variant="secondary" onClick={add}>
          <Plus className="w-3.5 h-3.5 mr-1" /> Adicionar destaque
        </Button>
      </div>
      {rows.length === 0 && (
        <p className="text-xs text-neutral-500">Ex.: "Freio a disco dianteiro", "Injeção eletrônica".</p>
      )}
      <div className="space-y-2">
        {rows.map((r, i) => (
          <div key={i} className="grid grid-cols-[1fr_auto] gap-2">
            <Input
              placeholder="Destaque (ex: Partida elétrica)"
              value={r}
              onChange={(e) => update(i, e.target.value)}
            />
            <Button type="button" size="icon" variant="ghost" onClick={() => remove(i)} title="Remover">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
