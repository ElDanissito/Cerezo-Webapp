// hooks/useDashboardSummary.ts
"use client";

import * as React from "react";
import { fetchDashboardSummary, DashboardSummary } from "@/features/admin/lib/api/dashboard"; // <-- ajusta el path si difiere

type Status = "loading" | "success" | "error";

// ⏱️ Mantén visible el loading al menos X ms (opcional, pero hace que se note)
const MIN_LOAD_MS = 500;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function useDashboardSummary() {
  const [data, setData] = React.useState<DashboardSummary | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  // 🔴 Arrancamos en loading
  const [status, setStatus] = React.useState<Status>("loading");
  const [isMock, setIsMock] = React.useState(false);

  const refetch = React.useCallback(async (signal?: AbortSignal) => {
    setStatus("loading");
    setError(null);
    const t0 = Date.now();
    try {
      const { data, isMock } = await fetchDashboardSummary({
        signal,
        useMockIfUnavailable: true,
      });
      // ⏳ Garantiza que el loader se vea al menos MIN_LOAD_MS
      const elapsed = Date.now() - t0;
      if (elapsed < MIN_LOAD_MS) await sleep(MIN_LOAD_MS - elapsed);

      setData(data);
      setIsMock(isMock);
      setStatus("success");
    } catch (e: any) {
      if (e?.name !== "AbortError") {
        const elapsed = Date.now() - t0;
        if (elapsed < MIN_LOAD_MS) await sleep(MIN_LOAD_MS - elapsed);

        setError(e?.message || "Error desconocido al cargar el resumen.");
        setData(null);
        setIsMock(false);
        setStatus("error");
      }
    }
  }, []);

  React.useEffect(() => {
    const ctrl = new AbortController();
    refetch(ctrl.signal);
    return () => ctrl.abort();
  }, [refetch]);

  const loading = status === "loading";
  const hasData =
    !!data &&
    [data.total, data.enProceso, data.completados, data.pagosRealizados].some(
      (n) => (typeof n === "number" ? n : 0) > 0
    );
  const empty = !loading && !error && !hasData;

  return { data, error, status, loading, hasData, empty, isMock, refetch };
}
