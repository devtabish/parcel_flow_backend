import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DashboardDocument = HydratedDocument<Dashboard>;
@Schema()
export class Dashboard {
    @Prop()
    name: string;
}
export const DashboardSchema = SchemaFactory.createForClass(Dashboard);
