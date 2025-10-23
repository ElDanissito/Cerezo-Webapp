"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LegacyTramitesRedirect() {
  const router = useRouter();
  useEffect(() => {
    // Redirect legacy /tramites route to /top-tramites
    router.replace("/top-tramites");
  }, [router]);

  return null;
}