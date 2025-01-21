/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nykjv-srm-backend.neti.com.ph",
        port: "",
        pathname: "/storage/**",
      },
    ],
  },
};

export default nextConfig;
