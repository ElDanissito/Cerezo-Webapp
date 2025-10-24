// app/(admin)/resumen-metricas/page.tsx
import type { Metadata } from "next";
import React from "react";
import DashboardResumenClient from "@/components/admin/resumen/DashboardResumenClient";

export const metadata: Metadata = {
  title: "Resumen de Métricas Clave",
  description: "Trámites totales, en proceso, completados y pagos realizados.",
};

export default function Metricas() {
  return <DashboardResumenClient />;
}
