/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: false,
  },
  // Force routes manifest generation
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
  // Ensure proper file structure for Vercel
  distDir: '.next',
  trailingSlash: false,
  // Add this to force manifest creation
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    return config
  }
}

export default nextConfig