import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IRedisConfig } from './redis-config.interface';

@Injectable()
export class RedisConfig {
    constructor(private readonly config: ConfigService) {}

    get mainConfig(): IRedisConfig {
        return {
            url: this.config.get('REDIS_KEY'),
            label: 'Main',
        };
    }

    get limiterConfig(): IRedisConfig {
        return {
            url: this.config.get('REDIS_LIMITER_KEY'),
            label: 'Limiter',
        };
    }
}
