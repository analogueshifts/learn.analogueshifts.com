/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // pdfkit reads its AFM font files from disk by relative path at runtime;
    // webpack bundling breaks that lookup unless the package is left external.
    serverComponentsExternalPackages: ["pdfkit"],
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i.pravatar.cc' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'api.dicebear.com' },
    ],
  },
};

export default nextConfig;
