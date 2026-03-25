import { S3Client } from "@aws-sdk/client-s3";
import { ENV } from "./env.js";

const s3 = new S3Client({
  region: ENV.BUCKET_REGION,
  credentials: {
    accessKeyId: ENV.ACCESS_KEY_ID,
    secretAccessKey: ENV.SECRET_ACCESS_KEY,
  },
});

export default s3;
