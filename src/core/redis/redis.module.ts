import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisClientFactory } from './redis-client.factory';
import { RedisConfig } from './redis.config';
import { RedisHealthService } from './redis-health.service';

@Module({
    providers: [RedisConfig, RedisHealthService, RedisClientFactory, RedisService],
    exports: [RedisService, RedisHealthService],
})
export class RedisModule {}
