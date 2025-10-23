import React from "react";
import { getTopPurchasedTramitesLast7Days } from "@/features/tramites/api";

export default async function TopPurchasedTramites({ limit = 5 }: { limit?: number }) {
  // Server component: fetch top purchased procedures in last 7 days
  const data = await getTopPurchasedTramitesLast7Days(limit);

  if (!data || data.length === 0 || data.every((d) => (d.purchases7Days ?? 0) <= 0)) {
    return (
      <div className="rounded-md border border-dashed p-4 text-center text-slate-500 dark:text-slate-400">
        Sin compras recientes
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {data.map((t) => (
        <div key={t.id} className="flex items-center justify-between rounded-md bg-white px-4 py-3 shadow-sm">
          <div className="text-sm font-medium text-slate-900 dark:text-slate-100">{t.title}</div>
          <div className="text-sm font-semibold text-rose-700 dark:text-rose-300">{t.purchases7Days}</div>
        </div>
      ))}
    </div>
  );
}
