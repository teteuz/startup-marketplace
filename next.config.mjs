/**
 * Exportação estática.
 * NEXT_BASE_PATH define o prefixo quando publicado em subpasta
 * (ex.: GitHub Pages em https://teteuz.github.io/startup-marketplace-site/).
 */
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: process.env.NEXT_BASE_PATH || "",
};

export default nextConfig;
