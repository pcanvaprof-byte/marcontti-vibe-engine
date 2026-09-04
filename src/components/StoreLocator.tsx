import { useEffect, useRef } from "react";

const LIB_SRC =
  "https://ajax.googleapis.com/ajax/libs/@googlemaps/extended-component-library/0.6.15/index.min.js";

const CONFIGURATION = {
  locations: [
    {
      title: "Klug Motors — Joinville",
      address1: "R. Albano Schmidt, 1882",
      address2: "Boa Vista, Joinville - SC, 89205-100",
      coords: { lat: -26.2836, lng: -48.8451 },
      placeId: "",
      actions: [
        {
          label: "Como chegar",
          defaultUrl:
            "https://www.google.com/maps/dir/?api=1&destination=R.+Albano+Schmidt,+1882+-+Boa+Vista,+Joinville+-+SC,+89205-100",
        },
      ],
    },
  ],
  mapOptions: {
    center: { lat: -26.2836, lng: -48.8451 },
    fullscreenControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    zoom: 15,
    zoomControl: true,
    maxZoom: 17,
    mapId: "",
  },
  mapsApiKey: import.meta.env["VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY"] as string,
  capabilities: {
    input: true,
    autocomplete: true,
    directions: false,
    distanceMatrix: true,
    details: false,
    actions: true,
  },
};

/**
 * Localizador de lojas do Google (Extended Component Library).
 * Renderizado apenas no cliente: os custom elements não existem no SSR.
 */
export function StoreLocator() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const key = import.meta.env["VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY"];
    if (!host || !key || host.childElementCount > 0) return;

    const loader = document.createElement("gmpx-api-loader");
    loader.setAttribute("key", String(key));
    loader.setAttribute("solution-channel", "GMP_QB_locatorplus_v11_cABDF");

    const locator = document.createElement("gmpx-store-locator");
    locator.setAttribute("map-id", "DEMO_MAP_ID");
    locator.style.width = "100%";
    locator.style.height = "100%";

    host.append(loader, locator);

    let cancelled = false;
    const configure = async () => {
      await customElements.whenDefined("gmpx-store-locator");
      if (cancelled) return;
      (locator as unknown as { configureFromQuickBuilder: (c: unknown) => void })
        .configureFromQuickBuilder(CONFIGURATION);
    };

    if (!document.querySelector(`script[src="${LIB_SRC}"]`)) {
      const script = document.createElement("script");
      script.type = "module";
      script.src = LIB_SRC;
      document.head.appendChild(script);
    }
    void configure();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className="klug-store-locator h-[460px] w-full bg-background"
      aria-label="Localizador da loja Klug Motors"
    />
  );
}
