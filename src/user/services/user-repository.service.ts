import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { FilterQuery, HydratedDocument, PipelineStage, ProjectionType, QueryOptions } from 'mongoose';
import { CustomerDocument } from '../schemas/user.schema';

@Injectable()
export class UserRepositoryService {
    constructor(private readonly repository: UserRepository) {}

    async findOne(
        filter: FilterQuery<CustomerDocument>,
        projection?: ProjectionType<CustomerDocument>,
        options?: QueryOptions<CustomerDocument>,
    ): Promise<CustomerDocument | null> {
        const user = await this.repository.findOne(filter, projection, options);
        return user;
    }
    async aggregate<CustomerDocument>(pipeline: PipelineStage[]): Promise<CustomerDocument[]> {
        return this.repository.aggregate<CustomerDocument>(pipeline);
    }

    async findMany(
        filter: FilterQuery<CustomerDocument>,
        projection?: ProjectionType<CustomerDocument>,
        options?: QueryOptions<CustomerDocument>,
    ): Promise<HydratedDocument<CustomerDocument>[]> {
        return await this.repository.findMany(filter, projection, options);
    }

    async create(entity: Partial<CustomerDocument>): Promise<CustomerDocument> {
        return await this.repository.create(entity);
    }
}
