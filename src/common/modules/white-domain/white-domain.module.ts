import { Module } from '@nestjs/common';
import { WhiteDomainController } from './white-domain.controller';
import { WhiteDomainService } from './white-domain.service';
import { RedisModule } from 'src/core/redis/redis.module';
import { WhiteDomainGuard } from './white-domain.guard';

@Module({
    imports: [RedisModule],
    controllers: [WhiteDomainController],
    providers: [WhiteDomainService, WhiteDomainGuard],
})
export class WhiteDomainModule {}
