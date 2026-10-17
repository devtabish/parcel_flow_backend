import { Injectable } from '@nestjs/common';
import { RedisCacheService } from 'src/common/modules/redis-cache/redis-cache.service';
import { IRedisLoginOtp } from './interface/redis-login-otp.interface';
import { LOGIN_OTP_EXPIRY } from 'src/common/constants/app.constants';

@Injectable()
export class RedisLoginOtpService {
    constructor(private readonly redisCacheService: RedisCacheService) {}

    async setLoginOtp(data: IRedisLoginOtp): Promise<void> {
        const { email, otp } = data;
        await this.redisCacheService.set(`loginOTP:${email}`, otp, { expiry: LOGIN_OTP_EXPIRY });
    }

    async verifyLoginOtp(data: IRedisLoginOtp): Promise<boolean> {
        const { email, otp } = data;
        const storedOtp = await this.redisCacheService.get(`loginOTP:${email}`);
        if (storedOtp !== otp) return false;
        return true;
    }
}
