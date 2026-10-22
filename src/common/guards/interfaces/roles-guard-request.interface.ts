import { AdminDocument } from 'src/admin/schemas/admin.schema';
import { CustomerDocument } from 'src/customer/schemas/customer.schema';

export interface IRolesGuardRequest extends Request {
    user: CustomerDocument | AdminDocument | null;
}
