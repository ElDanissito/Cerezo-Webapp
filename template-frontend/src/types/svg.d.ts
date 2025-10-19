// src/types/svg.d.ts
declare module "*.svg" {
  import * as React from "react";
  const SVG: React.FC<React.SVGProps<SVGSVGElement> & { title?: string }>;
  export default SVG;
}
declare module "*.svg?url" {
  const url: string;
  export default url;
}
