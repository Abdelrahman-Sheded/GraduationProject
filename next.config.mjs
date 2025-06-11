/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://django-backend:8000/api/:path*",
      },
      {
        source: "/rag-api/:path*",
        destination: "http://rag-service:8000/:path*",
      },
    ];
  },
  output: "standalone",
};

export default nextConfig;
