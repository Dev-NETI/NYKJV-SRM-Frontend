/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      // {
      //   protocol: "https",
      //   hostname: "nykjv-srm-backend.neti.com.ph",
      //   port: "",
      //   pathname: "/storage/**",
      // },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/storage/**",
      },
    ],
  },
};

export default nextConfig;
