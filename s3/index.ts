import { S3Client } from "@aws-sdk/client-s3";

const ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
// const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

if (!ACCESS_KEY_ID || !SECRET_ACCESS_KEY) {
  throw new Error(
    "Missing AWS credentials. Please set them in your .env file."
  );
}

// if (!BUCKET_NAME) {
//   throw new Error("Missing AWS bucket name. Please set it in your .env file.");
// }

const config = {
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
  region: "ap-south-1",
};

// Instantiate a new s3 client
export const s3client = new S3Client(config);
