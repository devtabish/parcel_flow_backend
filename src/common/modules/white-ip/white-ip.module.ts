import { Module } from '@nestjs/common';
import { WhiteIpController } from './white-ip.controller';
import { WhiteIpService } from './white-ip.service';
import { RedisModule } from 'src/core/redis/redis.module';
import { WhiteIpGuard } from './white-ip.guard';

@Module({
    imports: [RedisModule],
    controllers: [WhiteIpController],
    providers: [WhiteIpService, WhiteIpGuard],
})
export class WhiteIpModule {}
