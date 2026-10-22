import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ERoles } from 'src/common/enums/roles.enum';

export type UserDocument = HydratedDocument<User>;
@Schema({ timestamps: true, versionKey: false })
export class User {
    @Prop({
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        trim: true,
    })
    email: string;

    @Prop({
        type: String,
        trim: true,
        required: true,
    })
    userName: string;

    @Prop({
        type: String,
        select: false,
        required: true,
    })
    password: string;

    @Prop({
        type: String,
        enum: [ERoles.ADMINISTRATOR, ERoles.CUSTOMER, ERoles.RIDER],
        default: ERoles.CUSTOMER,
        required: true,
    })
    userType: ERoles;
}
export const UserSchema = SchemaFactory.createForClass(User);
