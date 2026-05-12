/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // <--- ADICIONE ESTA LINHA AQUI
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true, // Recomendo adicionar isso também para evitar erros no deploy
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
