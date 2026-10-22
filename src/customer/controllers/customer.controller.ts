import { Body, Controller, Get, Patch, Put, UseGuards } from '@nestjs/common';
import { CustomerAuthGuard } from 'src/common/guards/user-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ReqProfile } from 'src/common/decorators/req-profile.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ERoles } from 'src/common/enums/roles.enum';
import { UpdateUserProfileDto } from '../dto/update-customer-profile.dto';
import { UserService } from '../services/customer.service';
import { StrictValidation } from 'src/common/decorators/strict-validation.decorator';
import { IApiResponse } from 'src/common/interfaces/response.interface';
import { UpdatePasswordDto } from '../dto/update-password.dto';

@StrictValidation()
@Controller('CUSTOMER')
@UseGuards(CustomerAuthGuard, RolesGuard)
export class CustomerController {
    constructor(private readonly CUSTOMERService: UserService) {}

    @Get('profile')
    @Roles(ERoles.CUSTOMER)
    async profile(@ReqProfile('_id') CUSTOMERId: string): Promise<IApiResponse> {
        return await this.CUSTOMERService.getProfile(CUSTOMERId);
    }

    @Put()
    @Roles(ERoles.CUSTOMER)
    updateProfile(@ReqProfile('_id') CUSTOMERId: string, @Body() payload: UpdateUserProfileDto): Promise<IApiResponse> {
        return this.CUSTOMERService.updateProfile(CUSTOMERId, payload);
    }

    @Patch()
    @Roles(ERoles.CUSTOMER)
    async updatePassword(@ReqProfile('_id') CUSTOMERId: string, @Body() payload: UpdatePasswordDto): Promise<IApiResponse> {
        return await this.CUSTOMERService.updateUserPassword(CUSTOMERId, payload);
    }
}
