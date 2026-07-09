import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import infindaLogo from "../assets/infinda-logo.png.asset.json";
import klugSymbol from "../assets/klug/klug-symbol.png.asset.json";

const PUBLIC_ORIGIN = "https://proototipomotos.lovable.app";
const INFINDA_LOGO_URL = `${PUBLIC_ORIGIN}${infindaLogo.url}`;

function InfindaCredit() {
  return (
    <a
      href="https://infindadigital.store"
      target="_blank"
      rel="noopener noreferrer"
      style={{ mixBlendMode: "difference" }}
      className="fixed bottom-2 left-2 z-50 flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-white"
      aria-label="Criado por Infinda Digital — infindadigital.store"
    >
      <img
        src={INFINDA_LOGO_URL}
        alt="Infinda Digital"
        className="h-4 w-4 object-contain"
        style={{ filter: "invert(1) grayscale(1) contrast(1000%)" }}
      />
      <span>Criado por infindadigital.store</span>
    </a>
  );
}

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Página não encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          A página que você procura não existe ou foi movida.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Voltar para o início
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
          Esta página não carregou
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Algo deu errado. Você pode tentar novamente ou voltar para o início.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Tentar novamente
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Início
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
      { title: "Klug Motors — Motos e Scooters Elétricas em Joinville" },
      { name: "description", content: "Klug Motors: motos, scooters, triciclos e bicicletas elétricas em Joinville/SC. Sem CNH, econômicas e sustentáveis. Rua Albano Schimidt, 1882." },
      { name: "author", content: "Klug Motors" },
      { property: "og:site_name", content: "Klug Motors" },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:title", content: "Klug Motors — Motos e Scooters Elétricas em Joinville" },
      { property: "og:description", content: "Motos, scooters, triciclos e bicicletas elétricas em Joinville/SC. Sem CNH, econômicas e sustentáveis." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Klug Motors — Motos e Scooters Elétricas em Joinville" },
      { name: "twitter:description", content: "Motos, scooters, triciclos e bicicletas elétricas em Joinville/SC. Sem CNH, econômicas e sustentáveis." },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: klugSymbol.url },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Urbanist:wght@400;600;700;800;900&family=Epilogue:wght@400;500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
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
      <Outlet />
      <InfindaCredit />
    </QueryClientProvider>
  );
}
