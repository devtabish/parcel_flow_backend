import { CustomerDocument } from 'src/user/schemas/user.schema';

export interface IUserRequest extends Request {
    user: CustomerDocument | null;
}
