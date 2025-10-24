"use client";
import React from "react";
import Badge from "../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon } from "@/features/admin/icons";

type Props = {
  total?: number;
  enProceso?: number;
  completados?: number;
  pagosRealizados?: number;
  variacion?: {
    total?: number;
    enProceso?: number;
    completados?: number;
    pagosRealizados?: number;
  };
};

export const EcommerceMetrics: React.FC<Props> = ({
  total = 12450,
  enProceso = 312,
  completados = 11840,
  pagosRealizados = 10420,
  variacion = { total: 3.2, enProceso: -1.1, completados: 4.8, pagosRealizados: 2.4 },
}) => {
  const fmt = (n: number) => new Intl.NumberFormat("es-CO").format(n);
  const chip = (p?: number) => {
    if (typeof p !== "number") return null;
    const up = p >= 0;
    return (
      <Badge color={up ? "success" : "error"}>
        {up ? <ArrowUpIcon className="text-success-500" /> : <ArrowDownIcon className="text-error-500" />}
        {`${up ? "+" : ""}${p.toFixed(2)}%`}
      </Badge>
    );
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* Total de trámites */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <p className="text-gray-500 text-theme-sm dark:text-gray-400">Trámites totales</p>
            <h4 className="mt-1 font-semibold text-gray-800 text-theme-xl dark:text-white/90">{fmt(total)}</h4>
          </div>
          {chip(variacion.total)}
        </div>
      </div>

      {/* En proceso */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <p className="text-gray-500 text-theme-sm dark:text-gray-400">En proceso</p>
            <h4 className="mt-1 font-semibold text-gray-800 text-theme-xl dark:text-white/90">{fmt(enProceso)}</h4>
          </div>
          {chip(variacion.enProceso)}
        </div>
      </div>

      {/* Completados */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <p className="text-gray-500 text-theme-sm dark:text-gray-400">Completados</p>
            <h4 className="mt-1 font-semibold text-gray-800 text-theme-xl dark:text-white/90">{fmt(completados)}</h4>
          </div>
          {chip(variacion.completados)}
        </div>
      </div>

      {/* Pagos realizados */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <p className="text-gray-500 text-theme-sm dark:text-gray-400">Pagos realizados</p>
            <h4 className="mt-1 font-semibold text-gray-800 text-theme-xl dark:text-white/90">{fmt(pagosRealizados)}</h4>
          </div>
          {chip(variacion.pagosRealizados)}
        </div>
      </div>
    </div>
  );
};
export default EcommerceMetrics;
