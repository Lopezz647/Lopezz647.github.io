/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', 
  distDir: 'out', // Forçamos o nome da pasta de saída
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
