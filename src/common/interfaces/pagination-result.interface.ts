import { HydratedDocument } from 'mongoose';

export interface IPaginationResult<T> {
    data: HydratedDocument<T>[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
