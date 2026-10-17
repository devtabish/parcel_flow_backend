import { Controller, Post, Body, UseGuards, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { AdminAuthGuard } from 'src/common/guards/admin-auth.guard';
import { ReqProfile } from 'src/common/decorators/req-profile.decorator';
import { ApiPublic } from 'src/common/decorators/api-public.decorator';
import { AdminSignupDto } from 'src/admin/dto/admin-signup.dto';
import { AuthService } from '../services/auth.service';
import { StrictValidation } from 'src/common/decorators/strict-validation.decorator';
import { IApiResponse } from 'src/common/interfaces/response.interface';
import { AdminLoginDto } from 'src/admin/dto/admin-login.dto';

@StrictValidation()
@Controller('auth/admin')
export class AdminAuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('signup')
    @ApiPublic()
    registerFirstAdmin(@Body() payload: AdminSignupDto): Promise<IApiResponse> {
        return this.authService.registerSuperAdmin(payload);
    }

    @Post('login')
    @ApiPublic()
    @HttpCode(HttpStatus.OK)
    adminLogin(@Body() payload: AdminLoginDto): Promise<IApiResponse> {
        return this.authService.adminLogin(payload);
    }

    @Delete()
    @UseGuards(AdminAuthGuard)
    @HttpCode(HttpStatus.OK)
    logout(@ReqProfile('_id') userId: string): Promise<IApiResponse> {
        return this.authService.logoutAdmin(userId);
    }
}
