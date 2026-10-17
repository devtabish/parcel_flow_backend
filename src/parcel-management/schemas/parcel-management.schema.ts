import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ParcelManangementDocument = HydratedDocument<ParcelManagement>;
@Schema({ timestamps: true, versionKey: false })
export class ParcelManagement {
    @Prop({ required: true })
    senderName: string;

    @Prop({ required: true })
    senderPhoneNo: string;

    @Prop({ required: true })
    senderAddress: string;

    @Prop({ required: true })
    senderCity: string;

    @Prop({ required: true })
    receiverName: string;

    @Prop({ required: true })
    receiverPhoneNo: string;

    @Prop({ required: true })
    receiverAddress: string;

    @Prop({ required: true })
    receiverCity: string;

    @Prop({ required: true })
    weight: string;
}
export const ParcelManagementSchema = SchemaFactory.createForClass(ParcelManagement);
