import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { IApiResponse } from 'src/common/interfaces/response.interface';
import { randomUUID } from 'crypto';
import { IUploadedFile } from '../interfaces/upload-file.interface';

@Injectable()
export class UploadService {
    private readonly region = this.configService.getOrThrow('AWS_REGION');
    private readonly bucket = this.configService.getOrThrow('AWS_S3_BUCKET');
    private readonly url = this.configService.getOrThrow('AWS_S3_URL');
    private readonly s3: S3Client = new S3Client({
        region: this.region,
        credentials: {
            accessKeyId: this.configService.getOrThrow('AWS_ACCESS_KEY_ID'),
            secretAccessKey: this.configService.getOrThrow('AWS_SECRET_ACCESS_KEY'),
        },
    });

    constructor(private readonly configService: ConfigService) {}

    async uploadImage(file: IUploadedFile): Promise<IApiResponse> {
        const key = `images/${randomUUID()}-${file.originalname}`;

        try {
            await this.s3.send(
                new PutObjectCommand({
                    Bucket: this.bucket,
                    Key: key,
                    Body: file.buffer,
                    ContentType: file.mimetype,
                    ACL: 'private',
                }),
            );

            const url = `${this.url}/${key}`;
            return { message: 'OK', data: { url } };
        } catch (error) {
            console.log('S3 Error :', error);
            throw new InternalServerErrorException('S3 upload failed');
        }
    }

    async uploadBase64Image(base64: string): Promise<string> {
        const key = `images/${randomUUID()}.png`;

        try {
            const buffer = Buffer.from(base64, 'base64');

            await this.s3.send(
                new PutObjectCommand({
                    Bucket: this.bucket,
                    Key: key,
                    Body: buffer,
                    ContentType: 'image/png',
                    ACL: 'private',
                }),
            );

            return `${this.url}/${key}`;
        } catch (error) {
            console.log('S3 Error :', error);
            throw new InternalServerErrorException('S3 upload failed');
        }
    }

    async uploadImageFromUrl(imageUrl: string): Promise<string> {
        const key = `images/${randomUUID()}.png`;

        try {
            const response = await fetch(imageUrl);

            if (!response.ok) throw new InternalServerErrorException('Failed to fetch image from URL');

            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const contentType = response.headers.get('content-type') ?? 'image/png';

            await this.s3.send(
                new PutObjectCommand({
                    Bucket: this.bucket,
                    Key: key,
                    Body: buffer,
                    ContentType: contentType,
                    ACL: 'private',
                }),
            );

            return `${this.url}/${key}`;
        } catch (error) {
            console.log('S3 Error :', error);
            return imageUrl;
        }
    }
}
