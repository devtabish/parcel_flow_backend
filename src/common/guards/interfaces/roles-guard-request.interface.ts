import { AdminDocument } from 'src/admin/schemas/admin.schema';
import { CustomerDocument } from 'src/user/schemas/user.schema';

export interface IRolesGuardRequest extends Request {
    user: CustomerDocument | AdminDocument | null;
}
