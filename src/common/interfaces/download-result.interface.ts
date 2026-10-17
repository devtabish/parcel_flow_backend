import { HydratedDocument } from 'mongoose';

export interface IDownloadResult<T> {
    data: HydratedDocument<T>[];
    total: number;
}
