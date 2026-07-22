import { supabase } from "@/integrations/supabase/client";

/**
 * Fire-and-forget analytics event tracker.
 * Inserts a row into `public.analytics_events`. Never blocks navigation
 * and never throws — failures are silently logged to the console.
 *
 * Usage:
 *   trackEvent("whatsapp_click", { source: "hero_fab" });
 *   trackEvent("test_ride_click", { source: "header", modelSlug: "yamaha-neos" });
 *   trackEvent("financiamento_submit", { modelSlug: "sudu-x12" });
 */
export type TrackEventOpts = {
  source?: string;
  modelSlug?: string;
  meta?: Record<string, unknown>;
};

export function trackEvent(eventName: string, opts: TrackEventOpts = {}): void {
  if (typeof window === "undefined") return;
  try {
    void supabase
      .from("analytics_events")
      .insert({
        event_name: eventName,
        source: opts.source ?? null,
        page: window.location.pathname + window.location.search,
        model_slug: opts.modelSlug ?? null,
        meta: (opts.meta ?? null) as never,
        user_agent: window.navigator.userAgent,
      })
      .then((res) => {
        if (res.error) {
          // eslint-disable-next-line no-console
          console.warn("[analytics] insert failed:", res.error.message);
        }
      });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn("[analytics] error:", err);
  }
}
