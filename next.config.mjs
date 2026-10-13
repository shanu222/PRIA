const apiUrl = process.env.PRIA_API_URL?.replace(/\/+$/, "");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    // DRIM photos, boards and PDFs live in Cloudflare R2 and are streamed by the PRIA API.
    return apiUrl ? [{ source: "/media/:path*", destination: `${apiUrl}/assets/:path*` }] : [];
  },
};

export default nextConfig;
