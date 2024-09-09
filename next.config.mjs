import withPlaiceholder from "@plaiceholder/next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.aceternity.com",
        // port: "",
        // pathname: "/account123/**",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
      },
    ],
  },
};

export default withPlaiceholder(nextConfig);
