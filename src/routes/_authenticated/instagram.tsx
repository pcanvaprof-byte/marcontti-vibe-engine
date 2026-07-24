import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAdminInstagramPosts, type InstagramPost } from "@/hooks/useInstagramPosts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { LogOut, Plus, Pencil, Trash2, Upload, ExternalLink, Instagram as InstagramIcon } from "lucide-react";

export const Route = createFileRoute("/_authenticated/instagram")({
  head: () => ({
    meta: [
      { title: "Instagram — Admin Klug Motors" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: InstagramAdminPage,
});

type Draft = Partial<InstagramPost>;

const emptyDraft: Draft = {
  image_url: "",
  media_type: "image",
  thumbnail_url: null,
  caption: "",
  post_url: "https://www.instagram.com/klugmotors/",
  sort_order: 0,
  is_active: true,
};

/** Extrai um frame do vídeo (blob) e devolve como File PNG para servir de capa. */
async function captureVideoPoster(file: File): Promise<File | null> {
  return new Promise((resolve) => {
    try {
      const url = URL.createObjectURL(file);
      const video = document.createElement("video");
      video.preload = "auto";
      video.muted = true;
      video.playsInline = true;
      video.src = url;
      video.crossOrigin = "anonymous";
      const cleanup = () => URL.revokeObjectURL(url);
      video.onloadeddata = () => {
        try {
          video.currentTime = Math.min(0.1, (video.duration || 1) / 2);
        } catch {
          cleanup();
          resolve(null);
        }
      };
      video.onseeked = () => {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth || 720;
        canvas.height = video.videoHeight || 1280;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          cleanup();
          return resolve(null);
        }
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          cleanup();
          if (!blob) return resolve(null);
          resolve(new File([blob], "poster.jpg", { type: "image/jpeg" }));
        }, "image/jpeg", 0.82);
      };
      video.onerror = () => {
        cleanup();
        resolve(null);
      };
    } catch {
      resolve(null);
    }
  });
}

function InstagramAdminPage() {
  const navigate = useNavigate();
  const { data, isLoading, refetch } = useAdminInstagramPosts();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [editing, setEditing] = useState<Draft | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: u }) => {
      if (!u.user) return;
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", u.user.id);
      setIsAdmin(!!roles?.some((r) => r.role === "admin"));

    });
  }, []);

  const rows = useMemo(() => data ?? [], [data]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  async function handleDelete(p: InstagramPost) {
    if (!confirm("Excluir este post?")) return;
    const { error } = await supabase.from("instagram_posts").delete().eq("id", p.id);
    if (error) return toast.error(error.message);
    toast.success("Post removido");
    refetch();
  }

  async function handleToggle(p: InstagramPost) {
    const { error } = await supabase.from("instagram_posts")
      .update({ is_active: !p.is_active })
      .eq("id", p.id);

    if (error) return toast.error(error.message);
    refetch();
  }

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
        <div className="flex items-center gap-2">
          <InstagramIcon className="w-5 h-5 text-primary" />
          <div>
            <h1 className="text-xl font-bold">Posts do Instagram</h1>
            <p className="text-xs text-neutral-500">{rows.length} posts cadastrados · aparecem na home</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link to="/admin"><Button variant="ghost" size="sm">Modelos</Button></Link>
          <Link to="/leads"><Button variant="ghost" size="sm">Leads</Button></Link>
          <Link to="/"><Button variant="ghost" size="sm">Ver site</Button></Link>
          <Button size="sm" onClick={() => setEditing({ ...emptyDraft })}>
            <Plus className="w-4 h-4 mr-1" /> Novo post
          </Button>
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </header>

      <div className="p-6">
        {isLoading ? (
          <p className="text-neutral-500">Carregando...</p>
        ) : rows.length === 0 ? (
          <div className="border border-dashed border-neutral-800 rounded-xl p-12 text-center space-y-3">
            <InstagramIcon className="w-8 h-8 mx-auto text-neutral-600" />
            <p className="text-neutral-400">Nenhum post cadastrado ainda.</p>
            <p className="text-xs text-neutral-500">
              Enquanto a lista estiver vazia, a home usa as fotos dos modelos como preview.
            </p>
            <Button size="sm" onClick={() => setEditing({ ...emptyDraft })}>
              <Plus className="w-4 h-4 mr-1" /> Adicionar primeiro post
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {rows.map((p) => (
              <div key={p.id} className="border border-neutral-800 rounded-lg overflow-hidden bg-neutral-900">
                <div className="relative aspect-square bg-neutral-800">
                  {p.image_url ? (
                    p.media_type === "video" ? (
                      <video src={p.image_url} className="w-full h-full object-cover" muted playsInline preload="metadata" />
                    ) : (
                      <img src={p.image_url} alt="" className="w-full h-full object-cover" />
                    )
                  ) : (
                    <div className="w-full h-full grid place-items-center text-neutral-600 text-xs">Sem mídia</div>
                  )}
                  {!p.is_active && (
                    <div className="absolute inset-0 bg-black/60 grid place-items-center text-xs uppercase tracking-widest text-white/70 font-bold">
                      Oculto
                    </div>
                  )}
                </div>
                <div className="p-3 space-y-2">
                  <p className="text-xs text-neutral-400 line-clamp-2 min-h-[2.5em]">
                    {p.caption || <span className="text-neutral-600 italic">sem legenda</span>}
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <Switch checked={p.is_active} onCheckedChange={() => handleToggle(p)} />
                    <div className="flex gap-1">
                      <a href={p.post_url} target="_blank" rel="noreferrer" className="p-1.5 hover:bg-neutral-800 rounded">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button onClick={() => setEditing(p)} className="p-1.5 hover:bg-neutral-800 rounded">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(p)} className="p-1.5 hover:bg-neutral-800 rounded">
                        <Trash2 className="w-3.5 h-3.5 text-red-400" />
                      </button>
                    </div>
                  </div>
                  <Input
                    type="number"
                    value={p.sort_order}
                    onChange={async (e) => {
                      const v = Number(e.target.value) || 0;
                      await supabase.from("instagram_posts")
                        .update({ sort_order: v })
                        .eq("id", p.id);
                      refetch();
                    }}

                    className="h-7 text-xs"
                    aria-label="Ordem"
                  />
                </div>
              </div>
            ))}
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
  const [uploading, setUploading] = useState(false);

  function set<K extends keyof Draft>(k: K, v: Draft[K]) {
    setD((prev) => ({ ...prev, [k]: v }));
  }

  async function uploadFile(file: File): Promise<string> {
    const ext = file.name.split(".").pop() || "jpg";
    const path = `instagram/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage
      .from("model-images")
      .upload(path, file, { upsert: true, contentType: file.type });
    if (error) throw error;
    return `/api/public/model-images/${path}`;
  }

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const isVideo = file.type.startsWith("video/");
    const isImage = file.type.startsWith("image/");
    if (!isVideo && !isImage) {
      toast.error("Envie uma imagem ou vídeo");
      e.target.value = "";
      return;
    }
    setUploading(true);
    try {
      const url = await uploadFile(file);
      set("image_url", url);
      set("media_type", isVideo ? "video" : "image");
      toast.success(isVideo ? "Vídeo enviado" : "Imagem enviada");
    } catch (err: any) {
      toast.error(err.message ?? "Falha no upload");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function save() {
    if (!d.image_url) {
      toast.error("Envie uma mídia antes de salvar");
      return;
    }
    setSaving(true);
    const payload = {
      image_url: d.image_url,
      media_type: d.media_type ?? "image",
      caption: d.caption ?? "",
      post_url: d.post_url || "https://www.instagram.com/klugmotors/",
      sort_order: d.sort_order ?? 0,
      is_active: d.is_active ?? true,
    };
    const table = supabase.from("instagram_posts");
    const { error } = d.id
      ? await table.update(payload).eq("id", d.id)
      : await table.insert(payload);

    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Post salvo");
    onSaved();
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg bg-neutral-950 text-neutral-100 border-neutral-800">
        <DialogHeader>
          <DialogTitle>{d.id ? "Editar post" : "Novo post"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Imagem ou vídeo</Label>
            <div className="mt-2 flex items-start gap-3">
              <div className="w-24 h-24 rounded bg-neutral-900 border border-neutral-800 overflow-hidden shrink-0">
                {d.image_url ? (
                  d.media_type === "video" ? (
                    <video src={d.image_url} className="w-full h-full object-cover" muted playsInline controls />
                  ) : (
                    <img src={d.image_url} alt="" className="w-full h-full object-cover" />
                  )
                ) : (
                  <div className="w-full h-full grid place-items-center text-[10px] text-neutral-600">
                    sem mídia
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <label className="inline-flex items-center gap-2 text-xs cursor-pointer bg-neutral-800 hover:bg-neutral-700 px-3 py-2 rounded">
                  <Upload className="w-3.5 h-3.5" />
                  {uploading ? "Enviando..." : "Enviar imagem ou vídeo"}
                  <input
                    type="file"
                    accept="image/*,video/*"
                    className="hidden"
                    onChange={onUpload}
                    disabled={uploading}
                  />
                </label>
                <Input
                  placeholder="ou cole uma URL (imagem ou vídeo)"
                  value={d.image_url ?? ""}
                  onChange={(e) => {
                    const v = e.target.value;
                    set("image_url", v);
                    if (/\.(mp4|webm|mov|m4v)(\?|$)/i.test(v)) set("media_type", "video");
                    else if (/\.(png|jpe?g|gif|webp|avif)(\?|$)/i.test(v)) set("media_type", "image");
                  }}
                  className="text-xs"
                />
                <p className="text-[10px] text-neutral-500">
                  MP4/WebM até ~50MB recomendado. Vídeos são exibidos silenciados no preview.
                </p>
              </div>
            </div>
          </div>

          <div>
            <Label>Legenda (opcional)</Label>
            <Textarea
              value={d.caption ?? ""}
              onChange={(e) => set("caption", e.target.value)}
              placeholder="Legenda curta que aparece no hover..."
              rows={2}
              maxLength={280}
            />
          </div>

          <div>
            <Label>Link do post no Instagram</Label>
            <Input
              value={d.post_url ?? ""}
              onChange={(e) => set("post_url", e.target.value)}
              placeholder="https://www.instagram.com/p/..."
            />
            <p className="text-[10px] text-neutral-500 mt-1">
              Cole a URL do post. Se deixar em branco, o clique abre o perfil @klugmotors.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Ordem</Label>
              <Input
                type="number"
                value={d.sort_order ?? 0}
                onChange={(e) => set("sort_order", Number(e.target.value) || 0)}
              />
            </div>
            <div className="flex items-end gap-2">
              <Switch checked={d.is_active ?? true} onCheckedChange={(v) => set("is_active", v)} />
              <span className="text-sm">{d.is_active ?? true ? "Publicado" : "Oculto"}</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button onClick={save} disabled={saving || uploading}>
            {saving ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
