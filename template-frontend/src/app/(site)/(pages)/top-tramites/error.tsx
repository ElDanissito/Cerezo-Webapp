"use client";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: Props) {
  return (
    <section className="mx-auto w-full max-w-2xl px-4 py-16 text-center">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
        No pudimos cargar los trámites más consultados
      </h2>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        {error.message || "Por favor, inténtalo de nuevo en un momento."}
      </p>
      <button
        onClick={reset}
        className="mt-6 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
      >
        Reintentar
      </button>
    </section>
  );
}
