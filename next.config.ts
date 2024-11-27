import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    experimental: {
        esmExternals: true, // Ensure proper handling of ES modules
    },
};

export default nextConfig;
