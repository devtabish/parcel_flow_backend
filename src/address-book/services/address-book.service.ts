import { Injectable, NotFoundException } from '@nestjs/common';
import { AddressBookRepository } from '../repositories/address-book.repositories';
import { AddAddressDto } from '../dto/add-address.dto';
import { IApiResponse } from 'src/common/interfaces/response.interface';
import { UpdateAddressDto } from '../dto/update-address.dto';
import { GetAddressDto } from '../dto/get-address.dto';
import { DeleteAddressDto } from '../dto/delete-address.dto';
import { Types } from 'mongoose';

@Injectable()
export class AddressBookService {
    constructor(private readonly repository: AddressBookRepository) {}

    async addAddress(userId: string, payload: AddAddressDto): Promise<IApiResponse> {
        const { name, phoneNo, addressLine1, addressLine2, city, zipCode, country, email } = payload;
        console.log(userId);
        if (!userId) throw new NotFoundException('cannot add');
        const addressData = {
            userId: new Types.ObjectId(userId),
            name,
            phoneNo,
            addressLine1,
            addressLine2,
            city,
            zipCode,
            country,
            email,
        };
        const addAddress = await this.repository.create(addressData);
        return {
            message: 'added successfully',
            data: addAddress,
        };
    }

    async updateAddress(payload: UpdateAddressDto): Promise<IApiResponse> {
        const { name, phoneNo, addressLine1, addressLine2, city, zipCode, country, email } = payload;
        const filter = {};
        if (name) filter['name'] = name;
        if (phoneNo) filter['phoneNo'] = phoneNo;
        if (addressLine1) filter['addressLine1'] = addressLine1;
        if (addressLine2) filter['addressLine2'] = addressLine2;
        if (city) filter['city'] = city;
        if (zipCode) filter['zipCode'] = zipCode;
        if (country) filter['country'] = country;
        if (email) filter['email'] = email;
        const updateAddress = await this.repository.findOneAndUpdate({ email }, filter, { new: true });
        return {
            message: 'updated successfully',
            data: updateAddress,
        };
    }

    async getAddresses(userId: string): Promise<IApiResponse> {
        const address = await this.repository.findMany({ userId: new Types.ObjectId(userId) });
        if (!address) throw new NotFoundException('address not found');
        return {
            message: 'Ok',
            data: address,
        };
    }

    async getAddress(userId: string, payload: GetAddressDto): Promise<IApiResponse> {
        const { addressId } = payload;
        const address = await this.repository.findOne({
            userId: new Types.ObjectId(userId),
            _id: new Types.ObjectId(addressId),
        });
        if (!address) throw new NotFoundException('no address found');
        return {
            message: 'Ok',
            data: address,
        };
    }

    async deleteAddress(userId: string, payload: DeleteAddressDto): Promise<IApiResponse> {
        const { addressId } = payload;
        const address = await this.repository.deleteOne({ userId: new Types.ObjectId(userId), _id: new Types.ObjectId(addressId) });
        if (address.deletedCount === 0) throw new NotFoundException('address not found');
        return {
            message: 'deleted successfully',
        };
    }
}
