import { S3Client } from "https://esm.sh/@aws-sdk/client-s3@3.461.0";
import configuration from "../configuration.ts";

export const s3 = new S3Client({
  region: configuration.awsRegion,
});
