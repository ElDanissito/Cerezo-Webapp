import TramitesPage from "@/components/site/Tramites";
import React from "react";

export const metadata = {
  title: "Trámites más consultados",
  description: "Acceso rápido a los trámites más consultados.",
};

const Page = async () => {
  return (
    <main>
      {/* The actual UI and data fetching is handled inside the component */}
      {/* Keeps routing-level file simple and matches Signin modularization */}
      <TramitesPage />
    </main>
  );
};

export default Page;
