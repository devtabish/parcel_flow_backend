import { Global, Module } from '@nestjs/common';
import { RedisModule } from 'src/core/redis/redis.module';
import { RedisCacheService } from './redis-cache.service';

@Global()
@Module({
    imports: [RedisModule],
    controllers: [],
    providers: [RedisCacheService],
    exports: [RedisCacheService],
})
export class RedisCacheModule {}
