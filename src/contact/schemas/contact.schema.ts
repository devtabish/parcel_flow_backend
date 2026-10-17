import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ContactDocument = HydratedDocument<Contact>;
@Schema({ timestamps: true, versionKey: false })
export class Contact {
    @Prop({ required: true, trim: true })
    name: string;

    @Prop({ required: true, trim: true })
    email: string;

    @Prop({ required: true, type: Number })
    phoneNo: number;

    @Prop({ required: true })
    message: string;
}
export const ContactSchema = SchemaFactory.createForClass(Contact);
