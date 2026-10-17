import { createParamDecorator, ExecutionContext, BadRequestException, UnsupportedMediaTypeException } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { ALLOWED_IMAGE_MIME_TYPES } from 'src/common/constants/upload.constants';
import { UploadedImageDto } from '../dto/upload-image.dto';

export const UploadedImage = createParamDecorator(async (_data: unknown, ctx: ExecutionContext): Promise<UploadedImageDto> => {
    const req = ctx.switchToHttp().getRequest<FastifyRequest>();

    if (!req.isMultipart()) throw new BadRequestException('Request must be multipart/form-data');

    const file = await req.file();
    if (!file) throw new BadRequestException('Only file is allowed');

    if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.mimetype)) throw new UnsupportedMediaTypeException('Invalid file type or empty file');

    const buffer = await file.toBuffer();

    return {
        buffer,
        originalname: file.filename.replace(/\s+/g, ''),
        mimetype: file.mimetype,
    };
});
