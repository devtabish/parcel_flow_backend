import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { Customer, CustomerDocument } from '../schemas/user.schema';
@Injectable()
export class UserRepository extends BaseRepository<CustomerDocument> {
    constructor(@InjectModel(Customer.name) private readonly userModel: Model<CustomerDocument>) {
        super(userModel);
    }
}
