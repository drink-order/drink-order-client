/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: false, // Disable turbopack for Vercel deployment
  },
  output: 'standalone', // Better compatibility with Vercel
  generateBuildId: async () => {
    // Force consistent build ID generation
    return 'build-' + Date.now()
  }
}

export default nextConfig