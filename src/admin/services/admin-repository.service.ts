import { Injectable } from '@nestjs/common';
import { AdminRepository } from '../repositories/admin.repository';
import { FilterQuery } from 'mongoose';
import { AdminDocument } from '../schemas/admin.schema';

@Injectable()
export class AdminRepositoryService {
    constructor(private readonly repository: AdminRepository) {}

    async findOneAuth(filter: FilterQuery<AdminDocument>): Promise<AdminDocument | null> {
        return await this.repository.findOneAuth(filter);
    }
}
