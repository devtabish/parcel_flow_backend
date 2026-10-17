import { Module } from '@nestjs/common';
import { TempBlockIpService } from './temp-block-ip.service';
import { RedisModule } from 'src/core/redis/redis.module';

@Module({
    imports: [RedisModule],
    providers: [TempBlockIpService],
})
export class TempBlockIpModule {}
