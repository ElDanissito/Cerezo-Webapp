import TopPurchasedPage from "@/components/site/TopPurchased";

export const metadata = {
  title: "Trámites más comprados (7 días)",
  description: "Top 5 por número de compras en los últimos 7 días.",
};

// Public site page: use (site) group to inherit navbar/footer and site layout
export default async function Page() {
  // Render the site component that shows grid/cards like "más consultados"
  return <TopPurchasedPage />;
}
