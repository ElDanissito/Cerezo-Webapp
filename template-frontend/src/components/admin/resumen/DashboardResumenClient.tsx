// components/admin/resumen/DashboardResumenClient.tsx
"use client";

import React from "react";
import { useDashboardSummary } from "@/features/admin/hooks/useDashboardSummary";
import DashboardResumenView from "./DashboardResumenView";

export default function DashboardResumenClient() {
  const { data, error, loading, hasData, isMock, refetch } = useDashboardSummary();

  return (
    <DashboardResumenView
      data={data}
      error={error}
      loading={loading}
      hasData={hasData}
      isMock={isMock}
      onRetry={() => refetch()}
      onReloadPage={() => window.location.reload()}
    />
  );
}
