import { Controller, Body, UseGuards, Get, Patch, Put, Query, Post } from '@nestjs/common';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ERoles } from 'src/common/enums/roles.enum';
import { AdminAuthGuard } from 'src/common/guards/admin-auth.guard';
import { ReqProfile } from 'src/common/decorators/req-profile.decorator';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { UpdateAdminProfileDto } from '../dto/update-admin-profile.dto';
import { AdminService } from '../services/admin.service';
import { StrictValidation } from 'src/common/decorators/strict-validation.decorator';
import { IApiResponse } from 'src/common/interfaces/response.interface';
import { GetAdminProfileDto } from '../dto/get-admin-profile.dto';
import { CreateRiderDto } from '../dto/create-rider.dto';
@StrictValidation()
@Controller('admin')
@UseGuards(AdminAuthGuard, RolesGuard)
export class AdminController {
    constructor(protected readonly adminService: AdminService) {}

    @Get('profile')
    @Roles(ERoles.ADMINISTRATOR)
    getProfile(@Query() payload: GetAdminProfileDto): Promise<IApiResponse> {
        return this.adminService.getProfile(payload);
    }

    @Roles(ERoles.ADMINISTRATOR)
    @Post('riders')
    async createRider(@Body() payload: CreateRiderDto): Promise<IApiResponse> {
        return this.adminService.createRider(payload);
    }

    @Put()
    @Roles(ERoles.ADMINISTRATOR)
    updateProfile(@ReqProfile('_id') adminId: string, @Body() payload: UpdateAdminProfileDto): Promise<IApiResponse> {
        return this.adminService.updateProfile(adminId, payload);
    }

    @Patch()
    @Roles(ERoles.ADMINISTRATOR)
    changePassword(@ReqProfile('_id') userId: string, @Body() payload: ChangePasswordDto): Promise<IApiResponse> {
        return this.adminService.changePassword(userId, payload);
    }
}
