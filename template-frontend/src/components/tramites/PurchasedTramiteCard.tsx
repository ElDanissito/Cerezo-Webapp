import { twMerge } from "tailwind-merge";

export type PurchasedItem = {
  id: string;
  title: string;
  purchases7Days: number;
  iconUrl?: string;
  slug?: string;
};

export default function PurchasedTramiteCard({ item, className }: { item: PurchasedItem; className?: string }) {
  const detailHref = item.slug ? `/tramites/${item.slug}` : "#";

  return (
    <div
      className={twMerge(
        "relative rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
        "dark:border-slate-800 dark:bg-slate-900",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-50 ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {item.iconUrl ? (
            <img src={item.iconUrl} alt={item.title} className="h-7 w-7 object-contain" />
          ) : (
            <span className="text-xl">📄</span>
          )}
        </div>

        <div className="min-w-0">
          <h3 className="truncate text-base/6 font-semibold text-slate-900 dark:text-slate-100">
            <a href={detailHref} className="hover:underline">
              {item.title}
            </a>
          </h3>
          {/* Descripción opcional omitida para comprados; mantenemos look & feel limpio */}
        </div>
      </div>

      {/* Métrica principal: Compras (últimos 7 días). Visual coherente con TramiteCard */}
      <div className="mt-4 flex items-center justify-end">
        <span className="inline-flex flex-col items-start gap-0">
          <span className="text-xs text-rose-500 dark:text-rose-300">Compras (7 días)</span>
          <span className="text-lg font-semibold text-rose-700 dark:text-rose-300">{item.purchases7Days ?? 0}</span>
        </span>
      </div>

      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-transparent transition hover:ring-slate-300 dark:hover:ring-slate-700"
      />
    </div>
  );
}
