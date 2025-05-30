/** @type {import('next').NextConfig} */
import { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 30,
    },
  },
  eslint:{
    ignoreDuringBuilds:true
  },
  typescript:{
    ignoreBuildErrors:true
  },
  serverExternalPackages: ["@node-rs/argon2"],
  images: {
    // domains:["utfs.io"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/*`,
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/hashtag/:tag',
        destination: '/search?q=:tag',
        permanent: false
      }
    ]
  }

};

export default nextConfig;