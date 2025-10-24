"use client";

import React, { useMemo, useState } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { MoreDotIcon } from "@/features/admin/icons";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { Dropdown } from "../ui/dropdown/Dropdown";
import Spinner from "@/components/admin/ui/spinner/Spinner";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

type Props = {
  /** Meses (categorías del eje X). Si no envías, usa ["Ene"..."Dic"] */
  meses?: string[];
  /** Serie: Completados (12 valores) */
  dataCompletados?: number[];
  /** Serie: Pagos (12 valores) */
  dataPagos?: number[];
  /** Indicador de carga */
  loading?: boolean;
};

const DEFAULT_MESES = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
const DEFAULT_SERIES = {
  completados: [820,760,910,880,940,970,930,990,1010,980,1050,1100],
  pagos:       [700,680,820,790,860,890,870,920,940,910,960,1000],
};

export default function MonthlySalesChart({
  meses,
  dataCompletados,
  dataPagos,
  loading = false,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => setIsOpen((s) => !s);
  const closeDropdown = () => setIsOpen(false);

  const categories = meses?.length ? meses : DEFAULT_MESES;

  const { series, isEmpty } = useMemo(() => {
    const completados = dataCompletados ?? DEFAULT_SERIES.completados;
    const pagos = dataPagos ?? DEFAULT_SERIES.pagos;
    const sum = (completados?.reduce((a,b)=>a+(b||0),0) ?? 0) + (pagos?.reduce((a,b)=>a+(b||0),0) ?? 0);
    return {
      series: [
        { name: "Completados", data: completados },
        { name: "Pagos", data: pagos },
      ],
      isEmpty: sum === 0,
    };
  }, [dataCompletados, dataPagos]);

  const options: ApexOptions = {
    colors: ["#465FFF", "#10B981"],
    chart: { toolbar: { show: false }, zoom: { enabled: false }, foreColor: "#94a3b8", fontFamily: "Inter, ui-sans-serif" },
    plotOptions: { bar: { columnWidth: "40%", borderRadius: 6 } },
    dataLabels: { enabled: false },
    grid: { strokeDashArray: 4 },
    stroke: { show: true, width: 2 },
    xaxis: { categories },
    yaxis: { labels: { formatter: (v) => `${v}` } },
    legend: { show: true },
    tooltip: { shared: true, intersect: false },
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Completados vs Pagos</h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">Evolución mensual</p>
        </div>

        <div className="relative inline-block">
          <button onClick={toggleDropdown} className="dropdown-toggle">
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
          </button>
          <Dropdown isOpen={isOpen} onClose={closeDropdown} width="w-[160px]">
            <DropdownItem href="#">Exportar</DropdownItem>
            <DropdownItem href="#">Ver detalle</DropdownItem>
          </Dropdown>
        </div>
      </div>

      {loading ? (
        <div className="flex h-[180px] items-center justify-center">
          <Spinner className="h-6 w-6 text-gray-400" />
        </div>
      ) : isEmpty ? (
        <div className="flex h-[180px] items-center justify-center text-sm text-gray-500 dark:text-gray-400">
          No hay datos para mostrar
        </div>
      ) : (
        <div className="max-w-full overflow-x-auto custom-scrollbar">
          <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
            <ReactApexChart options={options} series={series} type="bar" height={180} />
          </div>
        </div>
      )}
    </div>
  );
}
