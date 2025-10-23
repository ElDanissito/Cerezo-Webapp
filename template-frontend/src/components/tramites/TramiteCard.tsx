import Link from "next/link";
import { twMerge } from "tailwind-merge";
import type { Tramite } from "@/types/tramite";

type Props = {
  tramite: Tramite;
  className?: string;
};

export default function TramiteCard({ tramite, className }: Props) {
  // Build hrefs for detail/catalog and starting the procedure.
  // We assume detail pages remain under `/tramites/[slug]` and
  // the start-procedure flow is `/tramites/[slug]/iniciar`.
  const detailHref = tramite.slug ? `/tramites/${tramite.slug}` : "#";
  const startHref = tramite.slug ? `/tramites/${tramite.slug}/iniciar` : "#";

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
          {/* Use plain img for external URLs to avoid next.config image domains for now */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {tramite.iconUrl ? (
            <img
              src={tramite.iconUrl}
              alt={tramite.title}
              className="h-7 w-7 object-contain"
            />
          ) : (
            <span className="text-xl">📄</span>
          )}
        </div>

        <div className="min-w-0">
          {/* Title links to the catalog/detail view */}
          <h3 className="truncate text-base/6 font-semibold text-slate-900 dark:text-slate-100">
            <Link href={detailHref} className="hover:underline">
              {tramite.title}
            </Link>
          </h3>

          {tramite.description ? (
            <p className="mt-1 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
              {tramite.description}
            </p>
          ) : null}

          <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            {tramite.category ? (
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium dark:bg-slate-800">
                {tramite.category}
              </span>
            ) : null}

            {typeof tramite.views === "number" ? (
              // Keep view count but show Spanish label
              <span>{tramite.views.toLocaleString()} Clics</span>
            ) : null}
          </div>
        </div>
      </div>

      {/* Actions area: provide two distinct controls so clicks can be visually differentiated.
         - "Ver catálogo" (catalog/detail) -> secondary subtle link
         - "Iniciar trámite" -> primary action button
         All visible UI texts are in Spanish; comments remain in English. */}
  {/* Actions: stack on small screens, row on larger screens */}
  <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Left block removed per request: only two numeric counters remain */}

        {/* Right: show only two numeric badges (catalog and iniciar). Remove unused button. */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="inline-flex flex-col items-start gap-0">
            <span className="text-xs text-slate-500 dark:text-slate-400">Catálogo</span>
            <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">{tramite.clicksCatalog ?? 0}</span>
          </span>

          <span className="inline-flex flex-col items-start gap-0">
            <span className="text-xs text-rose-500 dark:text-rose-300">Iniciar trámite</span>
            <span className="text-lg font-semibold text-rose-700 dark:text-rose-300">{tramite.clicksStart ?? 0}</span>
          </span>
        </div>
      </div>

      {/* Focus/hover ring accent */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-transparent transition hover:ring-slate-300 dark:hover:ring-slate-700"
      />
    </div>
  );
}