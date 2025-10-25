// Component: TopPurchasedPage (site)
// Renders top purchased procedures in the last 7 days using the same card/grid style as Top Trámites.
import PurchasedTramitesGrid from "@/components/tramites/PurchasedTramitesGrid";
import { getTopPurchasedTramitesLast7Days } from "@/features/tramites/api";

export const metadata = {
  title: "Trámites más comprados (7 días)",
  description: "Top 5 por número de compras en los últimos 7 días.",
};

export default async function TopPurchasedPage() {
  const items = await getTopPurchasedTramitesLast7Days(5);
  const hasPurchases = Array.isArray(items) && items.some((i) => (i.purchases7Days ?? 0) > 0);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Trámites más comprados (últimos 7 días)
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Top 5 por número de compras. Periodo fijo sin selector.
        </p>
      </header>
      {hasPurchases ? (
        <PurchasedTramitesGrid items={items} />
      ) : (
        <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-slate-500 dark:border-slate-800 dark:text-slate-400">
          Sin compras recientes
        </div>
      )}
    </section>
  );
}
