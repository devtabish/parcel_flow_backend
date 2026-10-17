import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { HydratedDocument, Types } from 'mongoose';

export type AddressDocument = HydratedDocument<AddressBook>;
@Schema({ timestamps: true, versionKey: false })
export class AddressBook {
    @Prop({
        type: Types.ObjectId,
        required: true,
    })
    userId: Types.ObjectId;

    @Prop({ required: true, trim: true })
    fullName: string;

    @Prop({ required: true, trim: true })
    companyname: string;

    @Prop({ required: true, trim: true })
    streetAddress: string;

    @Prop({ trim: true })
    appartment?: string;

    @Prop({ required: true, trim: true })
    city: string;

    @Prop({ required: true, type: Number })
    @Type(() => Number)
    zipCode: number;

    @Prop({ required: true, trim: true })
    country: string;

    @Prop({ required: true, trim: true })
    email: string;
}
export const AddressBookSchema = SchemaFactory.createForClass(AddressBook);
