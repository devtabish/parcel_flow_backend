import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ParcelManagement, ParcelManangementDocument } from '../schemas/parcel-management.schema';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/common/repositories/base.repository';

@Injectable()
export class ParcelManagementRepository extends BaseRepository<ParcelManangementDocument> {
    constructor(@InjectModel(ParcelManagement.name) private readonly parcelManagementModel: Model<ParcelManangementDocument>) {
        super(parcelManagementModel);
    }
}
