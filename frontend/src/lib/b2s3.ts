import { S3Client } from "@aws-sdk/client-s3";

export const b2 = new S3Client({
  region: "us-east-1", // required by AWS SDK; B2 uses endpoint for routing
  endpoint: process.env.B2_S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.B2_KEY_ID!,
    secretAccessKey: process.env.B2_APPLICATION_KEY!,
  },
});
