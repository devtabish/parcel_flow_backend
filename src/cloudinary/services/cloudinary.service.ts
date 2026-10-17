import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ICloudinaryUploadResponse } from 'src/common/interfaces/cloudinary.interface';
import { Readable } from 'stream';
import { IUploadedFile } from 'src/upload/interfaces/upload-file.interface';

@Injectable()
export class CloudinaryService {
    constructor() {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
        console.log({
            cloudName: process.env.CLOUDINARY_CLOUD_NAME,
            apiKeyExists: !!process.env.CLOUDINARY_API_KEY,
            apiSecretExists: !!process.env.CLOUDINARY_API_SECRET,
        }); // !! ye ksii value ko boolean me convert krta haii, taa k pta chale k value true haii yaa false
    }

    async uploadImage(file: IUploadedFile): Promise<ICloudinaryUploadResponse> {
        //IUploadedFile lo or ICloudinaryUploadResponse do
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'ecommerce/products',
                },
                (error, result) => {
                    if (error || !result) {
                        console.error('Cloudinary upload error:', error);
                        reject(new InternalServerErrorException('Image upload failed'));
                        return;
                    }

                    resolve({
                        secure_url: result.secure_url,
                        public_id: result.public_id,
                    });
                },
            );

            const stream = Readable.from(file.buffer);

            stream.pipe(uploadStream); //image data cloudinary ko bhejta haii
        });
    }

    async deleteImage(imageUrl: string): Promise<void> {
        try {
            const uploadIndex = imageUrl.indexOf('/upload/');

            if (uploadIndex === -1) throw new InternalServerErrorException('Invalid Cloudinary image URL');

            const pathAfterUpload = imageUrl.substring(uploadIndex + '/upload/'.length);

            const pathParts = pathAfterUpload.split('/');

            // Remove version, e.g. v123456789
            if (/^v\d+$/.test(pathParts[0])) pathParts.shift();

            const publicIdWithExtension = pathParts.join('/');

            const lastDotIndex = publicIdWithExtension.lastIndexOf('.');

            const publicId = lastDotIndex !== -1 ? publicIdWithExtension.substring(0, lastDotIndex) : publicIdWithExtension;

            await cloudinary.uploader.destroy(publicId);
        } catch (error) {
            console.error('Cloudinary delete error:', error);

            throw new InternalServerErrorException('Image deletion failed');
        }
    }
}
