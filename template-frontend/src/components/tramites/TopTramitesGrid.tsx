import type { Tramite } from "@/types/tramite";
import TramiteCard from "./TramiteCard";

type Props = {
  tramites: Tramite[];
};

export default function TopTramitesGrid({ tramites }: Props) {
  if (!tramites?.length) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-slate-500 dark:border-slate-800 dark:text-slate-400">
        No hay trámites para mostrar por el momento.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {tramites.map((t) => (
        <TramiteCard key={t.id} tramite={t} />
      ))}
    </div>
  );
}