/** @type {import('next').NextConfig} */
const mediaHost = process.env.NEXT_PUBLIC_MEDIA_BASE_URL
  ? new URL(process.env.NEXT_PUBLIC_MEDIA_BASE_URL).hostname
  : null;

const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    // cloudfront = legacy AWS media host, mediaHost = Cloudflare R2 public bucket
    domains: ["placehold.co", "d3tc1biq9ly8l.cloudfront.net", mediaHost].filter(Boolean),
  },
};

module.exports = nextConfig
