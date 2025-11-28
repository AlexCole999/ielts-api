import dotenv from "dotenv";
dotenv.config();

import { S3Client } from "@aws-sdk/client-s3";

export const s3 = new S3Client({
  region: process.env.SCW_S3_REGION,
  endpoint: process.env.SCW_S3_ENDPOINT,
  forcePathStyle: false,
  credentials: {
    accessKeyId: process.env.SCW_ACCESS_KEY,
    secretAccessKey: process.env.SCW_SECRET_KEY,
  },
});
