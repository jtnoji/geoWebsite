import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // static HTML export — no server, Cat 2 by construction
  trailingSlash: true, // stable /page/ URLs on static hosting
  images: { unoptimized: true }, // required for static export
};

export default nextConfig;
