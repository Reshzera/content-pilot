import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';

export const S3_BUCKET_NAME = 'content-pilot-demo';

@Injectable()
export class AwsService {
  private s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
    });
  }

  async getPresignedUrl(key: string, duration = 3600) {
    const command = new GetObjectCommand({ Bucket: S3_BUCKET_NAME, Key: key });
    const url = await getSignedUrl(this.s3Client, command, {
      expiresIn: duration,
    });
    return url;
  }
}
