import { S3Client, ListBucketsCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config();
const s3 = new S3Client({
  region: process.env.SCW_S3_REGION,
  endpoint: process.env.SCW_S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.SCW_ACCESS_KEY,
    secretAccessKey: process.env.SCW_SECRET_KEY,
  },
});

// 👉 ВПИШИ своё название бакета
const bucket = process.env.SCW_BUCKET;

async function test() {
  console.log("🔍 Проверяю подключение к Scaleway S3...");

  // 1 — тест, что ключи работают
  try {
    const buckets = await s3.send(new ListBucketsCommand({}));
    console.log("✅ Доступные бакеты:", buckets.Buckets);
  } catch (err) {
    console.error("❌ Ошибка ListBuckets:", err);
  }

  // 2 — тест доступа к твоему bucket
  try {
    const objects = await s3.send(
      new ListObjectsV2Command({ Bucket: bucket })
    );
    console.log("📦 Объекты в бакете:", objects.Contents || []);
  } catch (err) {
    console.error("❌ Ошибка ListObjects:", err);
  }
}

test();
