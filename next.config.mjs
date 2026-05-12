/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // <-- ESSA LINHA É OBRIGATÓRIA
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
