import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import infindaLogo from "../assets/infinda-logo.png.asset.json";

function InfindaCredit() {
  return (
    <a
      href="https://infindadigital.store"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-2 left-2 z-50 flex items-center gap-1.5 rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm transition hover:bg-black/90"
      aria-label="Criado por Infinda Digital — infindadigital.store"
    >
      <img src={infindaLogo.url} alt="Infinda Digital" className="h-4 w-4 rounded-full object-contain" />
      <span>Criado por infindadigital.store</span>
    </a>
  );
}

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Marcontti Garage — Mobilidade Elétrica em Joinville" },
      { name: "description", content: "Concessionária de scooters e motos elétricas em Joinville/SC. Estilo, economia e sustentabilidade sobre duas rodas." },
      { name: "author", content: "Marcontti Garage" },
      { property: "og:site_name", content: "Marcontti Garage" },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:title", content: "Marcontti Garage — Mobilidade Elétrica em Joinville" },
      { property: "og:description", content: "Concessionária de scooters e motos elétricas em Joinville/SC. Estilo, economia e sustentabilidade sobre duas rodas." },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://marcontti-vibe-engine.lovable.app/__l5e/assets-v1/857e50cf-feab-400c-bc88-ff9ab3556bdb/garage-exterior.png" },
      { property: "og:image:width", content: "1600" },
      { property: "og:image:height", content: "1024" },
      { property: "og:image:alt", content: "Loja Marcontti Garage em Joinville" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Marcontti Garage — Mobilidade Elétrica em Joinville" },
      { name: "twitter:description", content: "Concessionária de scooters e motos elétricas em Joinville/SC. Estilo, economia e sustentabilidade sobre duas rodas." },
      { name: "twitter:image", content: "https://marcontti-vibe-engine.lovable.app/__l5e/assets-v1/857e50cf-feab-400c-bc88-ff9ab3556bdb/garage-exterior.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@600;700;800;900&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
      <InfindaCredit />
    </QueryClientProvider>
  );
}
