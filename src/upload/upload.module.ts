import { Module } from '@nestjs/common';
import { UploadController } from './controllers/upload.controller';
import { UploadService } from './services/upload.service';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
    imports: [CloudinaryModule],
    controllers: [UploadController],
    providers: [UploadService],
    exports: [UploadService],
})
export class UploadModule {}
