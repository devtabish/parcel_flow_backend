import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AddressBook, AddressDocument } from '../schemas/address-book.schema';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/common/repositories/base.repository';

@Injectable()
export class AddressBookRepository extends BaseRepository<AddressDocument> {
    constructor(@InjectModel(AddressBook.name) private readonly addressBookModel: Model<AddressDocument>) {
        super(addressBookModel);
    }
}
