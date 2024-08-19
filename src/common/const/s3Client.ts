import { S3Client } from "@aws-sdk/client-s3";
import { s3AccessKey, s3SecretKey } from "./environment";

export const s3 = new S3Client({
  region: "ap-northeast-2",
  credentials: {
    accessKeyId: s3AccessKey,
    secretAccessKey: s3SecretKey,
  },
});
