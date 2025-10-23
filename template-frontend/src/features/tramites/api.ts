import type { Tramite } from "@/types/tramite";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api";

// Local mock used when backend is not available or for quick demo
// at the moment is just an example while the bd is connected
const MOCK: Tramite[] = [
  {
    id: "1",
    title: "Solicitud de certificado",
    description: "Descarga certificados oficiales de manera rápida.",
    category: "Documentos",
    views: 1234,
    clicksCatalog: 900,
    clicksStart: 334,
  },
  {
    id: "2",
    title: "Pago de impuestos",
    description: "Realiza el pago de tributos municipales en línea.",
    category: "Finanzas",
    views: 987,
    clicksCatalog: 700,
    clicksStart: 287,
  },
  {
    id: "3",
    title: "Agendar cita",
    description: "Programa una cita presencial con atención prioritaria.",
    category: "Turnos",
    views: 812,
    clicksCatalog: 600,
    clicksStart: 212,
  },
  {
    id: "4",
    title: "Actualización de datos",
    description: "Mantén tu información personal al día.",
    category: "Perfil",
    views: 703,
    clicksCatalog: 500,
    clicksStart: 203,
  },
];

// For purchases mock: include purchases in last 7 days for admin view
const MOCK_PURCHASES = [
  { id: "1", purchases7Days: 12, title: "Solicitud de certificado" },
  { id: "2", purchases7Days: 8, title: "Pago de impuestos" },
  { id: "3", purchases7Days: 5, title: "Agendar cita" },
  { id: "4", purchases7Days: 0, title: "Actualización de datos" },
];

function useMock(): boolean {
  // Toggle with env var if needed
  return process.env.NEXT_PUBLIC_USE_TRAMITES_MOCK === "true";
}

// Fetches top procedures from backend; falls back to mock on error or when toggled.
export async function getTopTramites(limit = 8, signal?: AbortSignal): Promise<Tramite[]> {
  if (useMock()) {
    return MOCK.slice(0, limit);
  }

  try {
    const url = new URL("/tramites/top", API_BASE);
    url.searchParams.set("limit", String(limit));

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      // Revalidate every 60s to balance freshness and performance
      next: { revalidate: 60 },
      signal,
    });

    if (!res.ok) {
      console.warn("[getTopTramites] Non-OK status:", res.status);
      return MOCK.slice(0, limit);
    }

    const raw = await res.json();

    // Map backend fields to our frontend type if necessary
    const data: Tramite[] = (raw as any[]).map((t) => ({
      id: String(t.id),
      title: t.titulo ?? t.title ?? "Procedure",
      description: t.descripcion ?? t.description,
      category: t.categoria ?? t.category,
      iconUrl: t.iconoUrl ?? t.icon_url ?? t.iconUrl,
      slug: t.slug,
      views: typeof t.visitas === "number" ? t.visitas : t.views,
      // Attempt to map backend click breakdown fields; accept multiple possible names
      clicksCatalog:
        typeof t.clicks_catalog === "number"
          ? t.clicks_catalog
          : typeof t.clicksCatalog === "number"
          ? t.clicksCatalog
          : typeof t.clicks_catalogos === "number"
          ? t.clicks_catalogos
          : undefined,
      clicksStart:
        typeof t.clicks_start === "number"
          ? t.clicks_start
          : typeof t.clicksStart === "number"
          ? t.clicksStart
          : typeof t.clicks_iniciar === "number"
          ? t.clicks_iniciar
          : undefined,
    }));

    // Compute a totalClicks value for sorting: prefer explicit breakdown when
    // available, otherwise fall back to the legacy `views` field.
    const withTotals = data.map((t) => ({
      ...t,
      totalClicks:
        (typeof t.clicksCatalog === "number" ? t.clicksCatalog : 0) +
        (typeof t.clicksStart === "number" ? t.clicksStart : 0) ||
        (typeof t.views === "number" ? t.views : 0),
    }));

    // Sort descending by totalClicks and return the requested limit
    withTotals.sort((a, b) => (b.totalClicks ?? 0) - (a.totalClicks ?? 0));

    // Remove the temporary totalClicks before returning (keep Tramite[] shape)
    return withTotals.slice(0, limit).map(({ totalClicks, ...rest }) => rest as Tramite);
  } catch (err) {
    console.error("[getTopTramites] Error:", err);
    return MOCK.slice(0, limit);
  }
}

// Fetch top purchased procedures in the last 7 days. Returns top `limit`.
export async function getTopPurchasedTramitesLast7Days(limit = 5, signal?: AbortSignal): Promise<{ id: string; title: string; purchases7Days: number }[]> {
  if (useMock()) {
    return MOCK_PURCHASES
      .slice()
      .sort((a, b) => (b.purchases7Days ?? 0) - (a.purchases7Days ?? 0))
      .slice(0, limit);
  }

  try {
    const url = new URL("/tramites/top-purchased", API_BASE);
    url.searchParams.set("limit", String(limit));

    let res = await fetch(url.toString(), {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 60 },
      signal,
    });

    // If backend host not available or returns non-ok, try the local Next route
    if (!res.ok) {
      try {
        const localUrl = new URL(`/tramites/top-purchased?limit=${limit}`, process.env.NEXT_PUBLIC_LOCAL_BASE ?? "http://localhost:3000");
        res = await fetch(localUrl.toString(), { method: "GET", headers: { "Content-Type": "application/json" }, signal });
      } catch (e) {
        console.warn("[getTopPurchasedTramitesLast7Days] backend/local fetch failed", e);
        return MOCK_PURCHASES.slice(0, limit);
      }
    }

    if (!res.ok) {
      console.warn("[getTopPurchasedTramitesLast7Days] Non-OK status after fallback:", res.status);
      return MOCK_PURCHASES.slice(0, limit);
    }

    const raw = await res.json();

    // Expect backend to return [{ id, title, purchases7Days }, ...]
    const data = (raw as any[]).map((p) => ({
      id: String(p.id),
      title: p.titulo ?? p.title ?? "Procedure",
      purchases7Days: typeof p.purchases7Days === "number" ? p.purchases7Days : Number(p.purchases ?? 0),
    }));

    return data.slice(0, limit);
  } catch (err) {
    console.error("[getTopPurchasedTramitesLast7Days] Error:", err);
    return MOCK_PURCHASES.slice(0, limit);
  }
}