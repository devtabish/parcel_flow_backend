import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Contact, ContactSchema } from './schemas/contact.schema';
import { ContactRepository } from './repositories/contact.repository';
import { ContactService } from './services/contact.service';
import { ContactController } from './controllers/contact.controller';

@Module({
    imports: [MongooseModule.forFeature([{ name: Contact.name, schema: ContactSchema }])],
    providers: [ContactService, ContactRepository],
    controllers: [ContactController],
})
export class ContactModule {}
