import { Body, Controller, Delete, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiPublic } from 'src/common/decorators/api-public.decorator';
import { ReqProfile } from 'src/common/decorators/req-profile.decorator';
import { StrictValidation } from 'src/common/decorators/strict-validation.decorator';
import { AuthService } from '../services/auth.service';
import { IApiResponse } from 'src/common/interfaces/response.interface';
import { RegisterUserDto } from '../dto/register-user.dto';
import { LoginCustomerDto } from '../dto/login-user.dto';
import { CustomerAuthGuard } from 'src/common/guards/user-auth.guard';

@StrictValidation()
@Controller('auth/user')
export class UserAuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    @ApiPublic()
    @HttpCode(HttpStatus.OK)
    registerUser(@Body() payload: RegisterUserDto): Promise<IApiResponse> {
        return this.authService.registerCustomer(payload);
    }

    // @Post('otp/login')
    // @ApiPublic()
    // @HttpCode(HttpStatus.OK)
    // otpLoginUser(@Body() payload: OtpLoginUserDto): Promise<IApiResponse> {
    //     return this.authService.otpLoginUser(payload);
    // }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() payload: LoginCustomerDto): Promise<IApiResponse> {
        const user = await this.authService.loginCustomer(payload);
        return user;
    }

    @Delete()
    @UseGuards(CustomerAuthGuard)
    @HttpCode(HttpStatus.OK)
    logout(@ReqProfile('_id') userId: string): Promise<IApiResponse> {
        return this.authService.logoutCustomer(userId);
    }
}
