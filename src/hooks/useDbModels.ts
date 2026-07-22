import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { models as staticModels, type Model } from "@/lib/models";

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
  colors: { name: string; hex: string; image: string }[];
  specs: { label: string; value: string }[];
  features: string[];
  gallery: string[];
  is_active: boolean;
  sort_order: number;
};

export function dbToModel(m: DbModel): Model {
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
    colors: m.colors ?? [],
    specs: m.specs ?? [],
    features: m.features ?? [],
    gallery: m.gallery && m.gallery.length ? m.gallery : undefined,
  };
}

async function fetchModels(includeInactive = false) {
  let q = supabase.from("models").select("*").order("sort_order", { ascending: true });
  if (!includeInactive) q = q.eq("is_active", true);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as unknown as DbModel[];
}

/** Public catalog — active only. Falls back to static list until DB responds. */
export function usePublicModels() {
  const q = useQuery({
    queryKey: ["models", "public"],
    queryFn: () => fetchModels(false),
    staleTime: 60_000,
  });
  const items = q.data ? q.data.map(dbToModel) : staticModels;
  return { ...q, items, brands: q.data?.map((m) => m.brand) ?? staticModels.map((m) => (m.slug.startsWith("sudu-") ? "sudu" : m.slug.startsWith("yamaha-") ? "yamaha" : "klug")) };
}

/** Admin — all models including inactive. */
export function useAdminModels() {
  return useQuery({
    queryKey: ["models", "admin"],
    queryFn: () => fetchModels(true),
    staleTime: 0,
  });
}
