import { AdminDocument } from 'src/admin/schemas/admin.schema';

export interface IAdminRequest extends Request {
    user: AdminDocument | null;
}
