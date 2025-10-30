/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['https://labscheck.com/api','https://labscheck.com/api/auth/']
    },
  },
  images: {
    formats: ['image/webp'], 
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'www.google.com',
        pathname: '/maps/place/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '**',
      },
    //   {
    //   protocol: 'http',
    //   hostname: 'localhost',
    //   port: '8000',
    //   pathname: '/uploads/labs/**',
    // },    //for image showing i changed this
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  output: "standalone",
  reactStrictMode: false,
};

export default nextConfig;