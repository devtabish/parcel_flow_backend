import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, HydratedDocument, Model } from 'mongoose';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { AdminDocument, Admin } from '../schemas/admin.schema';

@Injectable()
export class AdminRepository extends BaseRepository<AdminDocument> {
    constructor(@InjectModel(Admin.name) private readonly adminModel: Model<AdminDocument>) {
        super(adminModel);
    }

    async findOneAuth(filter: FilterQuery<AdminDocument>): Promise<HydratedDocument<AdminDocument> | null> {
        return await this.adminModel.findOne(filter).select('+token +password').exec();
    }
}
