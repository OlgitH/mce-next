/** @type {import('next').NextConfig} */
const nextConfig = async () => {
  return {
    reactStrictMode: true,
    images: {
      formats: ["image/webp"],
      remotePatterns: [
        {
          protocol: "https",
          hostname: "images.unsplash.com",
        },
        {
          protocol: "https",
          hostname: "images.pexels.com",
        },
        {
          protocol: "https",
          hostname: "images.prismic.io",
        },
      ],
    },
    async redirects() {
      return [
        {
          source: "/:lang/homepage",
          destination: "/:lang/uk-tours",
          permanent: true,
        },
      ];
    },
  };
};

module.exports = nextConfig;
