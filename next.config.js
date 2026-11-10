/** @type {import('next').NextConfig} */
const mediaHost = process.env.NEXT_PUBLIC_MEDIA_BASE_URL
  ? new URL(process.env.NEXT_PUBLIC_MEDIA_BASE_URL).hostname
  : null;

const nextConfig = {
  // Partial prerendering: static shells are prerendered, data inside <Suspense> streams per request.
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    dangerouslyAllowSVG: true,
    // cloudfront = legacy AWS media host, mediaHost = Cloudflare R2 public bucket
    remotePatterns: ["placehold.co", "d3tc1biq9ly8l.cloudfront.net", mediaHost]
      .filter(Boolean)
      .map((hostname) => ({ protocol: "https", hostname })),
  },
};

module.exports = nextConfig
