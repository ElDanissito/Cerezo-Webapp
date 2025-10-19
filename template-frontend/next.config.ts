// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack(config) {
    // 1) Excluye .svg de la regla existente de assets de Next
    const fileLoaderRule = (config.module.rules as any[]).find(
      (rule) => rule.test?.test?.(".svg")
    );
    if (fileLoaderRule) {
      fileLoaderRule.exclude = /\.svg$/i;
    }

    // 2) SVG como componente React cuando se importan desde TS/JS
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });

    // 3) SVG como archivo (URL) cuando se importan desde CSS u otros (no TS/JS)
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: { not: [/\.[jt]sx?$/] },
      type: "asset/resource",
    });

    return config;
  },
};

export default nextConfig;
