import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ERoles } from 'src/common/enums/roles.enum';

export type AdminDocument = HydratedDocument<Admin>;

@Schema({ timestamps: true, versionKey: false })
export class Admin {
    @Prop({
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true,
    })
    email: string;

    @Prop({
        type: String,
        enum: [ERoles.ADMINISTRATOR],
        default: ERoles.ADMINISTRATOR,
    })
    userType: string;

    @Prop({
        type: String,
        required: true,
        select: false,
    })
    password: string;

    @Prop({
        type: Boolean,
    })
    superAdmin?: boolean;

    @Prop({
        type: String,
        select: false,
    })
    token?: string;

    @Prop({ required: false })
    phoneNo?: string;

    @Prop({ required: false })
    address?: string;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);

// AdminSchema.index({ userType: 2 });
