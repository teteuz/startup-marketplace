/**
 * Exportação estática (GitHub Pages).
 * - GITHUB_PAGES=true → publica em https://<usuario>.github.io/startup-marketplace/
 */
const isPages = process.env.GITHUB_PAGES === "true";
const repo = "startup-marketplace";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: isPages ? `/${repo}` : "",
};

export default nextConfig;
