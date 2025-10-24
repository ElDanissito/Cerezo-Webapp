// components/admin/resumen/DashboardResumenView.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { EcommerceMetrics } from "@/components/admin/tramites/EcommerceMetrics";
import MonthlyTarget from "@/components/admin/tramites/MonthlyTarget";
import MonthlySalesChart from "@/components/admin/tramites/MonthlySalesChart";
import StatisticsChart from "@/components/admin/tramites/StatisticsChart";
import RecentOrders from "@/components/admin/tramites/RecentOrders";
import Spinner from "@/components/admin/ui/spinner/Spinner";

// 👉 importa el adaptador que crea las series mensuales desde el summary
import { computeMonthlySeriesFromSummary } from "@/features/admin/lib/api/dashboard";

type Props = {
  data: {
    total: number;
    enProceso: number;
    completados: number;
    pagosRealizados: number;
    variacion?: {
      total?: number;
      enProceso?: number;
      completados?: number;
      pagosRealizados?: number;
    };
    actualizadoEn?: string;
    recientes?: import("@/features/admin/lib/api/dashboard").Tramite[];
  } | null;
  loading: boolean;
  error: string | null;
  hasData: boolean;
  onRetry: () => void | Promise<void>;
  onReloadPage: () => void; // compat
  isMock?: boolean;
};

/** Icono de recarga (hereda currentColor → funciona en claro/oscuro) */
function RefreshIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M4.5 8.25h4.75V3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19.5 15.75h-4.75v4.75" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.98 8.223a7.5 7.5 0 0112.01-2.988l1.95 1.95" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20.02 15.777a7.5 7.5 0 01-12.01 2.988l-1.95-1.95" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function DashboardResumenView({
  data,
  loading,
  error,
  hasData,
  onRetry,
  onReloadPage, // eslint-disable-line @typescript-eslint/no-unused-vars
  isMock = false,
}: Props) {
  const router = useRouter();
  const [retrying, setRetrying] = React.useState(false);

  // ✅ Calcula las series mensuales a partir del summary (recientes)
  const monthly = React.useMemo(
    () => computeMonthlySeriesFromSummary(data || undefined),
    [data]
  );

  const handleRetry = async () => {
    setRetrying(true);
    try {
      await Promise.resolve(onRetry()); // vuelve a pedir datos al hook
      router.refresh(); // refresca server components
    } finally {
      setRetrying(false);
    }
  };

  const isBusy = loading || retrying;

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      {/* Header con acciones */}
      <div className="col-span-12 mb-1 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Resumen de métricas clave
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Trámites totales, en proceso, completados y pagos realizados
            </p>
          </div>
          {isMock && (
            <span className="rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-200">
              Datos de muestra
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRetry}
            disabled={isBusy}
            aria-busy={isBusy}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
            title="Recargar datos"
          >
            {isBusy ? (
              <Spinner size="sm" className="text-current" />
            ) : (
              <RefreshIcon className="h-4 w-4 text-current" />
            )}
            {retrying ? "Recargando…" : "Recargar"}
          </button>
        </div>
      </div>

      {/* ===== Estado: error ===== */}
      {error && !isMock && (
        <div className="col-span-12 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-200">
          <div className="mb-2 font-semibold">No pudimos cargar el resumen del dashboard.</div>
          <div className="text-sm opacity-90">Detalle: {error}</div>
          <div className="mt-3">
            <button
              onClick={handleRetry}
              disabled={isBusy}
              className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isBusy ? <Spinner size="sm" className="text-white" /> : <RefreshIcon className="h-4 w-4 text-white" />}
              {retrying ? "Recargando…" : "Recargar"}
            </button>
          </div>
        </div>
      )}

      {/* ===== KPIs / Empty / Loading ===== */}
      <section className="col-span-12 space-y-4" aria-label="KPIs">
        {isBusy && !error && (
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
              <Spinner />
              Cargando métricas del dashboard…
            </div>
          </div>
        )}

        {!isBusy && !error && !hasData && (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-600 shadow-sm dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-300">
            <div className="mx-auto mb-2 h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800" />
            <div className="text-base font-medium">No hay trámites registrados</div>
            <p className="mt-1 text-sm">
              Cuando se registren trámites, verás aquí el resumen de métricas clave.
            </p>
            <button
              onClick={handleRetry}
              disabled={isBusy}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isBusy ? <Spinner size="sm" className="text-white" /> : <RefreshIcon className="h-4 w-4 text-white" />}
              {retrying ? "Recargando…" : "Recargar"}
            </button>
          </div>
        )}

        {!isBusy && hasData && (
          <EcommerceMetrics
            total={data?.total}
            enProceso={data?.enProceso}
            completados={data?.completados}
            pagosRealizados={data?.pagosRealizados}
            variacion={data?.variacion}
          />
        )}
      </section>

      {/* ===== Actividad reciente ===== */}
      <section className="col-span-12 space-y-4" aria-label="Actividad reciente">
        <header className="sr-only">
          <h3>Actividad reciente</h3>
        </header>

        <div className="col-span-12">
          {isBusy && !error ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-5 text-sm text-gray-500 shadow-sm dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400">
              <div className="flex items-center gap-3">
                <Spinner />
                Cargando actividad…
              </div>
            </div>
          ) : (
            <RecentOrders items={data?.recientes ?? []} />
          )}
        </div>
      </section>

      {/* ===== Tendencias y objetivos ===== */}
      <section className="col-span-12 space-y-4" aria-label="Tendencias y objetivos">
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          <div className="col-span-12 xl:col-span-4">
            {isBusy && !error ? (
              <div className="rounded-2xl border border-gray-200 bg-white p-5 text-sm text-gray-500 shadow-sm dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400">
                <div className="flex items-center gap-3">
                  <Spinner />
                  Cargando objetivo mensual…
                </div>
              </div>
            ) : (
              <MonthlyTarget />
            )}
          </div>

          <div className="col-span-12 xl:col-span-8">
            {isBusy && !error ? (
              <div className="rounded-2xl border border-gray-200 bg-white p-5 text-sm text-gray-500 shadow-sm dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400">
                <div className="flex items-center gap-3">
                  <Spinner />
                  Cargando evolución mensual…
                </div>
              </div>
            ) : (
              // ✅ Chart alimentado con datos de API (series mensuales)
              <MonthlySalesChart
                meses={monthly.meses}
                dataCompletados={monthly.completados}
                dataPagos={monthly.pagos}
                loading={false}
              />
            )}
          </div>

          <div className="col-span-12">
            {isBusy && !error ? (
              <div className="rounded-2xl border border-gray-200 bg-white p-5 text-sm text-gray-500 shadow-sm dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400">
                <div className="flex items-center gap-3">
                  <Spinner />
                  Cargando estadísticas…
                </div>
              </div>
            ) : (
              // ✅ Chart alimentado con datos de API (series mensuales)
              <StatisticsChart
                meses={monthly.meses}
                dataEnProceso={monthly.enProceso}
                dataCompletados={monthly.completados}
                dataPagos={monthly.pagos}
                loading={false}
              />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
