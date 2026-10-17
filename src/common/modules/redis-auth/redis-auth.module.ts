import { Global, Module } from '@nestjs/common';
import { RedisCacheModule } from 'src/common/modules/redis-cache/redis-cache.module';
import { RedisAuthService } from './redis-auth.service';

@Global()
@Module({
    imports: [RedisCacheModule],
    providers: [RedisAuthService],
    exports: [RedisAuthService],
})
export class RedisAuthModule {}
