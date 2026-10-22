import { CustomerDocument } from 'src/customer/schemas/customer.schema';

export interface IUserRequest extends Request {
    user: CustomerDocument | null;
}
