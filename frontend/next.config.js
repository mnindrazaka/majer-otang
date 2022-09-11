/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    // TODO: generated files is triggering typescript error, remove this line after we fix the generated files
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
