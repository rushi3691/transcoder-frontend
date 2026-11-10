// Legacy AWS CloudFront distribution in front of the S3 bucket.
export const CLOUDFRONT_MEDIA_URL = "https://d3tc1biq9ly8l.cloudfront.net/processed/";

// Public R2 bucket URL (custom domain or r2.dev), e.g. https://media.example.com
export const MEDIA_URL = `${process.env.NEXT_PUBLIC_MEDIA_BASE_URL}/processed/`;
