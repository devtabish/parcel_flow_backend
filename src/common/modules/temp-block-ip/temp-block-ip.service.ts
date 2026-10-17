import { Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisService } from 'src/core/redis/redis.service';

@Injectable()
export class TempBlockIpService {
    private readonly logger = new Logger(TempBlockIpService.name);
    private readonly redisKey = 'tempBlockedIps';

    constructor(private readonly redisService: RedisService) {}

    private get redis(): Redis {
        return this.redisService.getLimiterClient();
    }

    async addTempBlockIp(ip: string, expiry: number): Promise<void> {
        try {
            const key = `${this.redisKey}:${ip}`;
            const transaction = this.redis.multi();
            transaction.hset(key, 'locked', 'true');
            transaction.expire(key, expiry);
            await transaction.exec();
        } catch (error) {
            this.logger.error(`Failed to add Ip in tempBlock`, error);
            throw error;
        }
    }

    async check(ip: string): Promise<boolean> {
        try {
            const blocked = await this.redis.hget(`${this.redisKey}:${ip}`, 'locked');
            return Boolean(blocked);
        } catch (error) {
            this.logger.error(`Failed to check Ip in tempBlock`, error);
            throw error;
        }
    }
}
