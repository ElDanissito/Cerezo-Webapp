"use client";

import React, { useMemo } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import Spinner from "@/components/admin/ui/spinner/Spinner";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

type Props = {
  /** Meses (categorías del eje X). Si no envías, usa ["Ene"..."Dic"] */
  meses?: string[];
  /** Serie: En proceso (12 valores) */
  dataEnProceso?: number[];
  /** Serie: Completados (12 valores) */
  dataCompletados?: number[];
  /** Serie: Pagos (12 valores) */
  dataPagos?: number[];
  /** Indicador de carga */
  loading?: boolean;
};

const DEFAULT_MESES = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
const DEFAULT_SERIES = {
  enProceso: [260,240,280,270,300,320,290,310,305,295,315,330],
  completados: [820,760,910,880,940,970,930,990,1010,980,1050,1100],
  pagos: [700,680,820,790,860,890,870,920,940,910,960,1000],
};

export default function StatisticsChart({
  meses,
  dataEnProceso,
  dataCompletados,
  dataPagos,
  loading = false,
}: Props) {

  const categories = meses?.length ? meses : DEFAULT_MESES;

  // Si vienen datos de API úsalos, si no, usa los de ejemplo actuales.
  const { series, isEmpty } = useMemo(() => {
    const enProceso = dataEnProceso ?? DEFAULT_SERIES.enProceso;
    const completados = dataCompletados ?? DEFAULT_SERIES.completados;
    const pagos = dataPagos ?? DEFAULT_SERIES.pagos;

    const totalSum =
      (enProceso?.reduce((a,b)=>a+(b||0),0) ?? 0) +
      (completados?.reduce((a,b)=>a+(b||0),0) ?? 0) +
      (pagos?.reduce((a,b)=>a+(b||0),0) ?? 0);

    return {
      series: [
        { name: "En proceso", data: enProceso },
        { name: "Completados", data: completados },
        { name: "Pagos", data: pagos },
      ],
      isEmpty: totalSum === 0,
    };
  }, [dataEnProceso, dataCompletados, dataPagos]);

  const options: ApexOptions = {
    legend: { show: true },
    colors: ["#F59E0B", "#465FFF", "#10B981"],
    chart: {
      toolbar: { show: false },
      zoom: { enabled: false },
      foreColor: "#94a3b8",
      fontFamily: "Inter, ui-sans-serif",
    },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 3 },
    xaxis: { categories: categories },
    yaxis: { labels: { formatter: (v) => `${v}` } },
    grid: { xaxis: { lines: { show: false } }, yaxis: { lines: { show: true } } },
    tooltip: { shared: true, intersect: false },
    fill: { type: "gradient", gradient: { shadeIntensity: 1, opacityFrom: 0.35, opacityTo: 0.05, stops: [0, 90, 100] } },
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Estadísticas de trámites</h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">En proceso · Completados · Pagos</p>
        </div>
      </div>

      {/* Loading / vacío */}
      {loading ? (
        <div className="flex h-[310px] items-center justify-center">
          <Spinner className="h-6 w-6 text-gray-400" />
        </div>
      ) : isEmpty ? (
        <div className="flex h-[310px] items-center justify-center text-sm text-gray-500 dark:text-gray-400">
          No hay datos para mostrar
        </div>
      ) : (
        <div className="max-w-full overflow-x-auto custom-scrollbar">
          <div className="min-w-[1000px] xl:min-w-full">
            <ReactApexChart options={options} series={series} type="area" height={310} />
          </div>
        </div>
      )}
    </div>
  );
}
