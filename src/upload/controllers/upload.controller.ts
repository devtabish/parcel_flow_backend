import { Controller, Post, UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UploadService } from '../services/upload.service';
import { UploadedImage } from '../decorators/upload-image.decorator';
import { UploadedImageDto } from '../dto/upload-image.dto';
import { StrictValidation } from 'src/common/decorators/strict-validation.decorator';
import { IApiResponse } from 'src/common/interfaces/response.interface';
import { CloudinaryService } from 'src/cloudinary/services/cloudinary.service';
import { AdminAuthGuard } from 'src/common/guards/admin-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ERoles } from 'src/common/enums/roles.enum';

@StrictValidation()
@Controller('admin/upload')
@UseGuards(AdminAuthGuard, RolesGuard)
export class UploadController {
    constructor(
        private readonly uploadService: UploadService,
        private readonly cloudinaryService: CloudinaryService,
    ) {}

    @Roles(ERoles.ADMINISTRATOR)
    @Post('image')
    async uploadImage(@UploadedImage() file: UploadedImageDto): Promise<IApiResponse> {
        const uploadedImage = await this.cloudinaryService.uploadImage(file);

        return {
            message: 'Image uploaded successfully',
            data: {
                url: uploadedImage.secure_url,
                publicId: uploadedImage.public_id,
            },
        };
    }
}
