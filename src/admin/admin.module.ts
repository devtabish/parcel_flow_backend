import { Module } from '@nestjs/common';
import { AdminController } from './controllers/admin.controller';
import { AdminRepository } from './repositories/admin.repository';
import { AdminService } from './services/admin.service';
import { AdminRepositoryService } from './services/admin-repository.service';
import { UserModule } from 'src/user/user.module';

import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from './schemas/admin.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]), UserModule],
    providers: [AdminService, AdminRepository, AdminRepositoryService],
    controllers: [AdminController],
    exports: [AdminService, AdminRepositoryService],
})
export class AdminModule {}
