"use client";
import { useEffect } from "react";

export default function HeaderSpacer() {
  useEffect(() => {
    function setSpacer() {
      const header = document.getElementById("site-header");
      const wrapper = document.getElementById("site-main-wrapper");
      if (header && wrapper) {
        const rect = header.getBoundingClientRect();
        // set exact padding-top to header height
        wrapper.style.paddingTop = `${rect.height}px`;
      }
    }

    // set initially and on resize
    setSpacer();
    window.addEventListener("resize", setSpacer);
    return () => window.removeEventListener("resize", setSpacer);
  }, []);

  return null;
}
