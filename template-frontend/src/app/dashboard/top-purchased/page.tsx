import TopPurchasedTramites from "@/components/admin/TopPurchasedTramites";

export const metadata = {
  title: "Top comprados (7 días)",
  description: "Listado de los 5 trámites con más compras en los últimos 7 días.",
};

// Admin page: shows top 5 purchased procedures in the last 7 days
export default async function Page() {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Trámites más comprados (últimos 7 días)
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Top 5 por número de compras. Periodo fijo: últimos 7 días.
        </p>
      </header>

      {/* Server component fetches and renders the list */}
      {/* UI text is Spanish for users; comments are in English */}
      {/* @ts-ignore-next-line Server Component */}
      <TopPurchasedTramites limit={5} />
    </section>
  );
}
