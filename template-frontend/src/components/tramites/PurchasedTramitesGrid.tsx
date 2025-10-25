import PurchasedTramiteCard, { PurchasedItem } from "./PurchasedTramiteCard";

export default function PurchasedTramitesGrid({ items }: { items: PurchasedItem[] }) {
  if (!items?.length) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-slate-500 dark:border-slate-800 dark:text-slate-400">
        Sin compras recientes
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {items.map((t) => (
        <PurchasedTramiteCard key={t.id} item={t} />
      ))}
    </div>
  );
}
