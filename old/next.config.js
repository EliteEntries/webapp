/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest:'public'
})

const nextConfig = withPWA({
  trailingSlash: true,
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ['react-ts-tradingview-widgets'],
  experimental: {
    esmExternals: false,
  },
})

module.exports = nextConfig
