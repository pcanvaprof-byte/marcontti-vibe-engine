import { queryOptions, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { models as staticModels, type Model } from "@/lib/models";

export type GalleryItem = { url: string; hidden?: boolean };

export type DbModel = {
  id: string;
  slug: string;
  brand: string;
  name: string;
  tag: string;
  price: string;
  price_number: number;
  range_km: string;
  speed: string;
  power: string;
  short_description: string;
  description: string;
  colors: { name: string; hex: string; image: string; hidden?: boolean; gallery?: string[] }[];
  specs: { label: string; value: string }[];
  features: string[];
  gallery: Array<string | GalleryItem>;
  is_active: boolean;
  sort_order: number;
  condition: "zero_km" | "semi_nova";
};

export function normalizeGallery(raw: DbModel["gallery"] | null | undefined): GalleryItem[] {
  return (raw ?? []).map((g) => (typeof g === "string" ? { url: g } : { url: g.url, hidden: !!g.hidden }));
}

export function dbToModel(m: DbModel): Model {
  const visibleGallery = normalizeGallery(m.gallery).filter((g) => !g.hidden).map((g) => g.url);
  const colors = (m.colors ?? []).map((c) => ({
    name: c.name,
    hex: c.hex,
    image: c.hidden ? "" : c.image,
    ...(c.gallery && c.gallery.length ? { gallery: c.gallery } : {}),
  }));
  return {
    slug: m.slug,
    name: m.name,
    tag: m.tag,
    price: m.price,
    priceNumber: m.price_number,
    range: m.range_km,
    speed: m.speed,
    power: m.power,
    short: m.short_description,
    description: m.description,
    colors,
    specs: m.specs ?? [],
    features: m.features ?? [],
    gallery: visibleGallery.length ? visibleGallery : undefined,
    condition: m.condition,
  };
}

// Colunas mínimas para renderizar cards de catálogo — evita trafegar
// description/specs/features/gallery (payload muito maior) na listagem.
const LIST_COLUMNS =
  "id,slug,brand,name,tag,price,price_number,range_km,speed,power,short_description,colors,is_active,sort_order,condition";

async function fetchModels(includeInactive = false, light = false) {
  let q = supabase
    .from("models")
    .select(light ? LIST_COLUMNS : "*")
    .order("sort_order", { ascending: true });
  if (!includeInactive) q = q.eq("is_active", true);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as unknown as DbModel[];
}

function brandFallback(slug: string) {
  return slug.startsWith("sudu-") ? "sudu" : slug.startsWith("yamaha-") ? "yamaha" : "klug";
}

/** Public catalog — active only. Falls back to static list until DB responds. */
export function usePublicModels() {
  const q = useQuery({
    queryKey: ["models", "public"],
    queryFn: () => fetchModels(false),
    staleTime: 5 * 60_000,
    gcTime: 30 * 60_000,
  });
  const items = q.data ? q.data.map(dbToModel) : staticModels;
  return { ...q, items, brands: q.data?.map((m) => m.brand) ?? staticModels.map((m) => brandFallback(m.slug)) };
}

/** Query options do catálogo enxuto — reutilizável no loader da rota. */
export const publicModelsLightOptions = queryOptions({
  queryKey: ["models", "public", "light"],
  queryFn: () => fetchModels(false, true),
  staleTime: 5 * 60_000,
  gcTime: 30 * 60_000,
});

/** Catálogo (cards) — payload enxuto, muito mais rápido que o SELECT *. */
export function usePublicModelsLight() {
  const q = useQuery(publicModelsLightOptions);
  const items = q.data ? q.data.map(dbToModel) : staticModels;
  return { ...q, items, brands: q.data?.map((m) => m.brand) ?? staticModels.map((m) => brandFallback(m.slug)) };
}

/** Página de produto — busca apenas o modelo pedido (1 linha). */
export function useModelBySlug(slug: string) {
  return useQuery({
    queryKey: ["models", "public", "slug", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("models")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .maybeSingle();
      if (error) throw error;
      return (data as unknown as DbModel | null) ?? null;
    },
    staleTime: 5 * 60_000,
    gcTime: 30 * 60_000,
  });
}


/** Admin — all models including inactive. */
export function useAdminModels() {
  return useQuery({
    queryKey: ["models", "admin"],
    queryFn: () => fetchModels(true),
    staleTime: 0,
  });
}
