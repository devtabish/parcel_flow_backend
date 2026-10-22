import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './services/customer.service';
import { UserRepository } from './repositories/customer.repository';
import { CustomerRepositoryService } from './services/customer-repository.service';
import { Customer, CustomerSchema } from './schemas/customer.schema';
import { CustomerController } from './controllers/customer.controller';

@Module({
    imports: [MongooseModule.forFeature([{ name: Customer.name, schema: CustomerSchema }])],
    controllers: [CustomerController],
    providers: [UserService, UserRepository, CustomerRepositoryService],
    exports: [UserService, CustomerRepositoryService],
})
export class CustomerModule {}
