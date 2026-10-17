import {
    FilterQuery,
    Model,
    ProjectionType,
    QueryOptions,
    SaveOptions,
    UpdateQuery,
    ClientSession,
    HydratedDocument,
    UpdateWriteOpResult,
    DeleteResult,
    PipelineStage,
} from 'mongoose';
import { Logger } from '@nestjs/common';
import { QUERY_TIMEOUT } from '../constants/app.constants';
import { IPaginationResult } from '../interfaces/pagination-result.interface';
import { IDownloadResult } from '../interfaces/download-result.interface';

export abstract class BaseRepository<T> {
    protected readonly logger = new Logger(this.constructor.name);

    protected constructor(protected readonly model: Model<T>) {}

    async create(entity: Partial<T>): Promise<HydratedDocument<T>> {
        return await this.model.create(entity);
    }
    async createMany(entities: Partial<T>[]): Promise<HydratedDocument<T>[]> {
        return this.model.insertMany(entities) as Promise<HydratedDocument<T>[]>;
    }

    async save(entity: Partial<T>, options?: SaveOptions): Promise<HydratedDocument<T>> {
        const created = new this.model(entity);
        return created.save(options) as Promise<HydratedDocument<T>>;
    }

    async countDocuments(filter: FilterQuery<T>): Promise<number> {
        return await this.model.countDocuments(filter).exec();
    }

    async findById(_id: string, projection?: ProjectionType<T>, options?: QueryOptions<T>): Promise<HydratedDocument<T> | null> {
        return await this.model.findById(_id, projection, options).exec();
    }

    async findOne(filter: FilterQuery<T>, projection?: ProjectionType<T>, options?: QueryOptions<T>): Promise<HydratedDocument<T> | null> {
        return await this.model.findOne(filter, projection, options).exec();
    }

    async findMany(filter: FilterQuery<T>, projection?: ProjectionType<T>, options?: QueryOptions<T>): Promise<HydratedDocument<T>[]> {
        return await this.model.find(filter, projection, options).exec();
    }

    async findByIdAndUpdate(_id: string, update: UpdateQuery<T>, options?: QueryOptions<T>): Promise<HydratedDocument<T> | null> {
        return await this.model.findByIdAndUpdate(_id, update, { new: true, runValidators: true, ...options }).exec();
    }

    async findOneAndUpdate(filter: FilterQuery<T>, update: UpdateQuery<T>, options?: QueryOptions<T>): Promise<HydratedDocument<T> | null> {
        return await this.model.findOneAndUpdate(filter, update, { new: true, runValidators: true, ...options }).exec();
    }

    async updateOne(filter: FilterQuery<T>, update: UpdateQuery<T>): Promise<UpdateWriteOpResult | null> {
        return await this.model.updateOne(filter, update, { runValidators: true }).exec();
    }

    async updateMany(filter: FilterQuery<T>, update: UpdateQuery<T>): Promise<UpdateWriteOpResult | null> {
        return await this.model.updateMany(filter, update, { runValidators: true }).exec();
    }

    async deleteOne(filter: FilterQuery<T>): Promise<DeleteResult | null> {
        return await this.model.deleteOne(filter).exec();
    }

    async deleteMany(filter: FilterQuery<T>): Promise<DeleteResult | null> {
        return await this.model.deleteMany(filter).exec();
    }

    async withTransaction<R>(session: ClientSession, fn: () => Promise<R>): Promise<R> {
        try {
            return await fn();
        } catch (err) {
            this.logger.error('Transaction failed', err);
            throw err;
        }
    }

    async findPaginated(
        filter: FilterQuery<T>,
        page = 1,
        limit = 20,
        sort: Record<string, 1 | -1> = { createdAt: -1 },
        projection?: ProjectionType<T>,
        download = false,
        time?: number,
    ): Promise<IPaginationResult<T> | IDownloadResult<T>> {
        console.log(limit, page);
        if (download) {
            const data = await this.model
                .find(filter, projection)
                .sort(sort)
                .maxTimeMS(time ?? QUERY_TIMEOUT.FIND_DOWNLOAD)
                .exec();
            if (data?.length === 0) return null;
            return { data, total: data.length };
        }
        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            this.model
                .find(filter, projection)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .maxTimeMS(time ?? QUERY_TIMEOUT.FIND)
                .exec(),
            this.model
                .countDocuments(filter)
                .maxTimeMS(time ?? QUERY_TIMEOUT.FIND)
                .exec(),
        ]);
        if (data?.length === 0) return null;
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    async aggregatePaginated<T>(
        pipeline: PipelineStage[],
        page = 1,
        limit = 20,
        download = false,
        time?: number,
    ): Promise<IPaginationResult<T> | IDownloadResult<T>> {
        if (download) {
            const data = await this.model
                .aggregate(pipeline)
                .option({ maxTimeMS: time ?? QUERY_TIMEOUT.AGGREGATE_DOWNLOAD })
                .exec();
            if (data?.length === 0) return null;
            return { data, total: data.length };
        }
        const skip = (page - 1) * limit;
        const [result] = await this.model
            .aggregate([
                ...pipeline,
                {
                    $facet: {
                        data: [{ $skip: skip }, { $limit: limit }],
                        total: [{ $count: 'count' }],
                    },
                },
            ])
            .option({ maxTimeMS: time ?? QUERY_TIMEOUT.AGGREGATE })
            .exec();

        if (!result?.data || result?.data?.length === 0) return null;
        const total = result?.total?.[0]?.count ?? 0;
        return {
            data: result?.data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async aggregate<R>(pipeline: PipelineStage[]): Promise<R[]> {
        return this.model.aggregate<R>(pipeline).exec();
    }

    async distinct<R = string>(field: string, filter?: FilterQuery<T>): Promise<R[]> {
        return this.model.distinct(field, filter).exec() as unknown as Promise<R[]>;
    }
}
