import { Module } from '@nestjs/common';
import { AddressBookService } from './services/address-book.service';
import { AddressBookRepository } from './repositories/address-book.repositories';
import { AddressBookController } from './controllers/address-book.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AddressBook, AddressBookSchema } from './schemas/address-book.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: AddressBook.name, schema: AddressBookSchema }])],
    providers: [AddressBookService, AddressBookRepository],
    controllers: [AddressBookController],
})
export class AddressBookModule {}
