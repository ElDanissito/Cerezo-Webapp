// Component: TramitesPage
// Renders the top consulted procedures. UI text must be Spanish for users;
// implementation comments remain in English.
import TopTramitesGrid from "@/components/tramites/TopTramitesGrid";
import { getTopTramites } from "@/features/tramites/api";
import { Tramite } from "@/types/tramite";
import Link from "next/link";

export const metadata = {
  title: "Trámites más consultados",
  description: "Acceso rápido a los trámites más consultados.",
};

export default async function TramitesPage() {
  let tramites: Tramite[] = [];
  try {
  // Fetch top procedures (top 5 as per acceptance criteria); warn in console on failure
  tramites = await getTopTramites(5);
  } catch (err) {
    // Keep UI friendly (Spanish) while logging the error in English for devs
    // eslint-disable-next-line no-console
    console.warn('[getTopTramites] failed, falling back to empty list', err);
    tramites = [];
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Trámites más consultados
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Enlaces rápidos a los trámites más solicitados.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/top-tramites"
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900/40"
          >
            Ver todos
          </Link>
        </div>
      </header>

      {tramites.length > 0 ? (
        <TopTramitesGrid tramites={tramites} />
      ) : (
        <p className="text-sm text-slate-500 dark:text-slate-400">No hay trámites disponibles.</p>
      )}
    </section>
  );
}
