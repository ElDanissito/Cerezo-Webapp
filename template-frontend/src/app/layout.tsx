// src/app/layout.tsx
import type { Metadata } from "next";
import "./dashboard/globals.css"; // existe en tu repo
// Si tienes globales del site, impórtalos aquí también:
import "@/app/(site)/css/euclid-circular-a-font.css";
import "@/app/(site)/css/style.css";

import { Outfit } from "next/font/google";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "App unificada | Tienda + Admin",
  description: "Proyecto Next 15 con áreas de ecommerce y admin",
};

const outfit = Outfit({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.className} min-h-screen bg-white antialiased dark:bg-gray-900`}>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
