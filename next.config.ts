import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static: the build produces `out/`, any static host can serve it.
  output: "export",
  trailingSlash: true,
};

export default nextConfig;
