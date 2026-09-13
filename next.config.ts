import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.arcanenft.xyz" }],
        destination: "https://arcanenft.xyz/:path*",
        permanent: true,
      },
      { source: "/lore", destination: "/", permanent: false },
      { source: "/collection", destination: "/", permanent: false },
      { source: "/whitelist", destination: "/", permanent: false },
      { source: "/mint", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;

initOpenNextCloudflareForDev();
