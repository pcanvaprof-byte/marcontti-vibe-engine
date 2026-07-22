// Automated responsiveness tests.
// Runs against a dev/preview server (default http://localhost:8080).
// Usage:
//   BASE_URL=http://localhost:8080 node tests/responsive.spec.mjs
// Requires Playwright's chromium (already available in the Lovable sandbox).
import { chromium } from "playwright";

const BASE_URL = process.env.BASE_URL || "http://localhost:8080";

// Full breakpoint sweep from 320px (small phones) to 1920px (large desktops).
const BREAKPOINTS = [
  { name: "mobile-320", width: 320, height: 720 },
  { name: "mobile-375", width: 375, height: 812 },
  { name: "mobile-390", width: 390, height: 844 },
  { name: "mobile-430", width: 430, height: 932 },
  { name: "tablet-portrait", width: 768, height: 1024 },
  { name: "tablet-landscape", width: 1024, height: 768 },
  { name: "laptop", width: 1280, height: 800 },
  { name: "desktop", width: 1440, height: 900 },
  { name: "desktop-xl", width: 1920, height: 1080 },
];

const ROUTES = [
  "/",
  "/modelos",
  "/sobre",
  "/contato",
  "/garantia",
  "/financiamento",
  "/comparar",
  "/privacidade",
  "/auth",
];

// Tolerância de 1px para arredondamento de subpixel do navegador.
const OVERFLOW_TOLERANCE = 1;

async function auditPage(page, url) {
  await page.goto(url, { waitUntil: "networkidle", timeout: 20000 });
  // Aguarda hidratação de conteúdo lazy (imagens/observers).
  await page.waitForTimeout(400);

  const result = await page.evaluate((tolerance) => {
    const docWidth = document.documentElement.clientWidth;
    const scrollWidth = document.documentElement.scrollWidth;
    const bodyScrollWidth = document.body.scrollWidth;
    const horizontalScroll = Math.max(scrollWidth, bodyScrollWidth) - docWidth;

    const offenders = [];
    const elements = document.querySelectorAll("body *");
    for (const el of elements) {
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) continue;
      const right = rect.right;
      if (right - docWidth > tolerance) {
        const style = window.getComputedStyle(el);
        // Ignora elementos fora do fluxo intencionalmente (menus, overlays fechados).
        if (style.position === "fixed" && style.visibility === "hidden") continue;
        offenders.push({
          tag: el.tagName.toLowerCase(),
          id: el.id || undefined,
          cls: (el.className && typeof el.className === "string" ? el.className : "").slice(0, 120),
          overflowBy: Math.round((right - docWidth) * 100) / 100,
          width: Math.round(rect.width),
        });
        if (offenders.length >= 5) break;
      }
    }

    // Touch targets em viewports estreitos.
    const smallTargets = [];
    if (docWidth <= 768) {
      const interactive = document.querySelectorAll("a[href], button, [role='button'], input, select, textarea");
      for (const el of interactive) {
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) continue;
        // 40px é o mínimo prático (WCAG recomenda 44). Ignora inline links dentro de parágrafos.
        if ((rect.height < 40 || rect.width < 40) && el.tagName !== "A") {
          smallTargets.push({
            tag: el.tagName.toLowerCase(),
            text: (el.textContent || "").trim().slice(0, 40),
            w: Math.round(rect.width),
            h: Math.round(rect.height),
          });
          if (smallTargets.length >= 5) break;
        }
      }
    }

    return { docWidth, scrollWidth, horizontalScroll, offenders, smallTargets };
  }, OVERFLOW_TOLERANCE);

  return result;
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const failures = [];
  let checked = 0;

  console.log(`\nResponsive audit → ${BASE_URL}`);
  console.log(`Routes: ${ROUTES.length}  Breakpoints: ${BREAKPOINTS.length}\n`);

  for (const bp of BREAKPOINTS) {
    const context = await browser.newContext({
      viewport: { width: bp.width, height: bp.height },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();

    for (const route of ROUTES) {
      checked++;
      const url = `${BASE_URL}${route}`;
      try {
        const res = await auditPage(page, url);
        const overflow = res.horizontalScroll > OVERFLOW_TOLERANCE;
        const tag = overflow ? "FAIL" : "ok  ";
        console.log(
          `[${tag}] ${bp.name.padEnd(16)} ${route.padEnd(16)} scroll+${res.horizontalScroll}px`
        );
        if (overflow) {
          failures.push({ breakpoint: bp.name, route, ...res });
        }
        if (res.smallTargets.length) {
          console.log(`        touch-targets<40px: ${res.smallTargets.length} (ex: ${res.smallTargets[0].text || res.smallTargets[0].tag} ${res.smallTargets[0].w}x${res.smallTargets[0].h})`);
        }
      } catch (err) {
        console.log(`[ERR ] ${bp.name} ${route}: ${err.message}`);
        failures.push({ breakpoint: bp.name, route, error: err.message });
      }
    }

    await context.close();
  }

  await browser.close();

  console.log(`\nChecked ${checked} combinations. Failures: ${failures.length}`);
  if (failures.length) {
    console.log("\n--- Overflow details ---");
    for (const f of failures) {
      console.log(`\n${f.breakpoint} ${f.route}`);
      if (f.error) { console.log(`  error: ${f.error}`); continue; }
      console.log(`  horizontalScroll: ${f.horizontalScroll}px (doc=${f.docWidth}, content=${f.scrollWidth})`);
      for (const o of f.offenders) {
        console.log(`  → <${o.tag}> +${o.overflowBy}px  w=${o.width}  class="${o.cls}"`);
      }
    }
    process.exit(1);
  }
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(2);
});
