import { Global, Module } from '@nestjs/common';
import { RedisCacheModule } from 'src/common/modules/redis-cache/redis-cache.module';
import { RedisLoginOtpService } from './redis-login-otp.service';

@Global()
@Module({
    imports: [RedisCacheModule],
    providers: [RedisLoginOtpService],
})
export class RedisLoginOtpModule {}
