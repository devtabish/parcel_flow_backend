import { Body, Controller, Delete, Get, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AddressBookService } from '../services/address-book.service';
import { StrictValidation } from 'src/common/decorators/strict-validation.decorator';
import { CustomerAuthGuard } from 'src/common/guards/user-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ERoles } from 'src/common/enums/roles.enum';
import { AddAddressDto } from '../dto/add-address.dto';
import { IApiResponse } from 'src/common/interfaces/response.interface';
import { UpdateAddressDto } from '../dto/update-address.dto';
import { DeleteAddressDto } from '../dto/delete-address.dto';
import { ReqProfile } from 'src/common/decorators/req-profile.decorator';
import { GetAddressDto } from '../dto/get-address.dto';

@StrictValidation()
@UseGuards(CustomerAuthGuard, RolesGuard)
@Controller('user/address')
export class AddressBookController {
    constructor(private readonly addressBookService: AddressBookService) {}

    @Roles(ERoles.CUSTOMER)
    @Post()
    async addAddress(@ReqProfile('_id') userId: string, @Body() payload: AddAddressDto): Promise<IApiResponse> {
        return await this.addressBookService.addAddress(userId, payload);
    }

    @Roles(ERoles.CUSTOMER)
    @Get('all')
    async getAddresses(@ReqProfile('_id') userId: string): Promise<IApiResponse> {
        return await this.addressBookService.getAddresses(userId);
    }

    @Roles(ERoles.CUSTOMER)
    @Get()
    async getAddress(@ReqProfile('_id') userId: string, @Query() payload: GetAddressDto): Promise<IApiResponse> {
        return await this.addressBookService.getAddress(userId, payload);
    }

    @Roles(ERoles.CUSTOMER)
    @Put()
    async updateAddress(@Body() payload: UpdateAddressDto): Promise<IApiResponse> {
        return await this.addressBookService.updateAddress(payload);
    }

    @Roles(ERoles.CUSTOMER)
    @Delete()
    async deleteAddress(@ReqProfile('_id') userId: string, @Query() payload: DeleteAddressDto): Promise<IApiResponse> {
        return await this.addressBookService.deleteAddress(userId, payload);
    }
}
