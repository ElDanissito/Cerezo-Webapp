"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";

export type Tramite = {
  id: string;
  solicitante: string;
  estado: "En proceso" | "Completado" | "Pendiente";
  pago: "Realizado" | "No realizado";
  /** ISO estable proveniente de la API, p. ej. "2025-10-24T16:43:44.000Z" */
  actualizado: string;
};

type Props = {
  /** Si no pasas items, se muestra el empty state “No hay trámites registrados” (HU 6). */
  items?: Tramite[];
  title?: string;
  subtitle?: string;
};

const dtf = new Intl.DateTimeFormat("es-CO", {
  dateStyle: "short",
  timeStyle: "medium",
});

export default function RecentOrders({
  items = [],
  title = "Trámites recientes",
  subtitle = "Últimos movimientos",
}: Props) {
  const hasItems = items.length > 0;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="px-5 pt-5 sm:px-6 sm:pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              {title}
            </h3>
            <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
              {subtitle}
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        {!hasItems ? (
          /* EMPTY STATE sin datos (HU 6) */
          <div className="rounded-lg border border-gray-200 p-6 text-center text-sm text-gray-600 dark:border-gray-800 dark:text-gray-300">
            No hay trámites registrados
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50 dark:bg-gray-800/50">
                <TableRow>
                  <TableCell className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300">
                    Radicado
                  </TableCell>
                  <TableCell className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300">
                    Solicitante
                  </TableCell>
                  <TableCell className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300">
                    Estado
                  </TableCell>
                  <TableCell className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300">
                    Pago
                  </TableCell>
                  <TableCell className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300">
                    Actualizado
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="px-4 py-3 font-mono">{t.id}</TableCell>
                    <TableCell className="px-4 py-3">{t.solicitante}</TableCell>
                    <TableCell className="px-4 py-3">
                      <Badge
                        color={
                          t.estado === "Completado"
                            ? "success"
                            : t.estado === "En proceso"
                            ? "warning"
                            : "secondary"
                        }
                      >
                        {t.estado}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <Badge color={t.pago === "Realizado" ? "primary" : "secondary"}>
                        {t.pago}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 dark:text-gray-400">
                      {/* Usar fecha ISO estable de la API y suprimir diferencias de hidratación */}
                      <time dateTime={t.actualizado} suppressHydrationWarning>
                        {dtf.format(new Date(t.actualizado))}
                      </time>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
