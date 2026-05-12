/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // <-- OBRIGATÓRIO para gerar a pasta 'out'
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true, // Evita que erros de lint parem o deploy
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "crests.football-data.org",
      },
    ],
  },
}

export default nextConfig
