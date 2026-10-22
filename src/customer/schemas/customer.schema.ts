import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ERoles } from 'src/common/enums/roles.enum';

export type CustomerDocument = HydratedDocument<Customer>;

@Schema({ timestamps: true, versionKey: false })
export class Customer {
    @Prop({
        type: String,
        lowercase: true,
        required: true,
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
        enum: [ERoles.CUSTOMER],
        default: ERoles.CUSTOMER,
    })
    userType: ERoles;

    @Prop({
        type: String,
        select: false,
        required: true,
    })
    password: string;

    @Prop({
        type: String,
    })
    avatarUrl?: string;

    @Prop({
        type: String,
        select: false,
    })
    token?: string;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);

CustomerSchema.index({ email: 1 }, { unique: true });
