import { Body, Controller, Post } from '@nestjs/common';
import { StrictValidation } from 'src/common/decorators/strict-validation.decorator';
import { AuthService } from '../services/auth.service';
import { LoginRiderDto } from '../dto/login-rider.dto';
import { IApiResponse } from 'src/common/interfaces/response.interface';

@StrictValidation()
@Controller('auth/rider')
export class RiderAuthController {
    constructor(private readonly authService: AuthService) {}

    @Post()
    async loginRider(@Body() payload: LoginRiderDto): Promise<IApiResponse> {
        return await this.authService.loginRider(payload);
    }
}
