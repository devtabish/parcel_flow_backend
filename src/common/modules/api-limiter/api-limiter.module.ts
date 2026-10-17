import { Module } from '@nestjs/common';
import { RedisModule } from 'src/core/redis/redis.module';
import { ApiLimiterGuard } from './api-limiter.guard';
import { TempBlockIpModule } from '../temp-block-ip/temp-block-ip.module';
import { ApiLimiterService } from './api-limiter.service';

@Module({
    imports: [RedisModule, TempBlockIpModule],
    providers: [ApiLimiterGuard, ApiLimiterService],
    exports: [ApiLimiterGuard, ApiLimiterService],
})
export class ApiLimiterModule {}
