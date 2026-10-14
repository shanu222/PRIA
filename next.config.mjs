const apiUrl = process.env.PRIA_API_URL?.replace(/\/+$/, "");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: "/observations", destination: "/situation#observations", permanent: true },
      { source: "/challenges", destination: "/situation#challenges", permanent: true },
      { source: "/hazards", destination: "/situation#hazards", permanent: true },
      { source: "/resources", destination: "/situation#capacity", permanent: true },
    ];
  },
  async rewrites() {
    // DRIM photos, boards and PDFs live in Cloudflare R2 and are streamed by the PRIA API.
    return apiUrl ? [{ source: "/media/:path*", destination: `${apiUrl}/assets/:path*` }] : [];
  },
};

export default nextConfig;
