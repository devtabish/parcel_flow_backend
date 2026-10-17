import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Contact, ContactDocument } from '../schemas/contact.schema';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/common/repositories/base.repository';

@Injectable()
export class ContactRepository extends BaseRepository<ContactDocument> {
    constructor(@InjectModel(Contact.name) private readonly contactModel: Model<ContactDocument>) {
        super(contactModel);
    }
}
