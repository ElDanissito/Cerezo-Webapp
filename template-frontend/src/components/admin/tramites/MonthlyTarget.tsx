"use client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { MoreDotIcon } from "@/features/admin/icons";
import { useState } from "react";
import { DropdownItem } from "../ui/dropdown/DropdownItem";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function MonthlyTarget() {
  const series = [75.55]; // progreso
  const options: ApexOptions = {
    chart: { toolbar: { show: false } },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 225,
        hollow: { size: "78%" },
        track: { background: "rgba(70,95,255,0.08)", strokeWidth: "100%" },
        dataLabels: {
          name: { show: true, color: "#64748b", fontSize: "13px", offsetY: 20 },
          value: { formatter: (val) => `${parseFloat(val).toFixed(0)}%`, offsetY: -10, fontSize: "22px", color: "#0f172a" },
        },
      },
    },
    fill: { type: "gradient", gradient: { shade: "light", type: "horizontal", gradientToColors: ["#6366F1"], stops: [0,100] }, colors: ["#465fff"] },
    stroke: { lineCap: "round" },
    labels: ["Progreso de la meta"],
  };

  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => setIsOpen((s) => !s);
  const closeDropdown = () => setIsOpen(false);

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="px-5 pt-5 bg-white shadow-default rounded-2xl pb-11 dark:bg-gray-900 sm:px-6 sm:pt-6">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Objetivo mensual (completados)</h3>
            <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">Meta vs progreso del mes</p>
          </div>

          <div className="relative inline-block">
            <button onClick={toggleDropdown} className="dropdown-toggle">
              <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
            </button>
            <Dropdown isOpen={isOpen} onClose={closeDropdown} width="w-[160px]">
              <DropdownItem href="#">Editar meta</DropdownItem>
              <DropdownItem href="#">Histórico</DropdownItem>
            </Dropdown>
          </div>
        </div>

        <div className="max-w-full overflow-x-auto custom-scrollbar">
          <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
            <ReactApexChart options={options} series={series} type="radialBar" height={260} />
          </div>
        </div>
      </div>
    </div>
  );
}
