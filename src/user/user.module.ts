import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { UserRepository } from './repositories/user.repository';
import { UserRepositoryService } from './services/user-repository.service';
import { Customer, CustomerSchema } from './schemas/user.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: Customer.name, schema: CustomerSchema }])],
    controllers: [UserController],
    providers: [UserService, UserRepository, UserRepositoryService],
    exports: [UserService, UserRepositoryService],
})
export class UserModule {}
