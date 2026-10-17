import { Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisService } from 'src/core/redis/redis.service';
import { IAddLimiterOptions } from './api-limiter.interface';
import { TempBlockIpService } from '../temp-block-ip/temp-block-ip.service';

@Injectable()
export class ApiLimiterService {
    private readonly logger = new Logger(ApiLimiterService.name);

    constructor(
        private readonly redisService: RedisService,
        private readonly tempBlockIpService: TempBlockIpService,
    ) {}

    private get redis(): Redis {
        return this.redisService.getLimiterClient();
    }

    async add(options: IAddLimiterOptions): Promise<boolean> {
        try {
            const { lockInterval, allowedAttempts, lockedFor, key, ip } = options;
            const exists = await this.redis.exists(key);
            const redisTransaction = this.redis.multi();
            redisTransaction.hincrby(key, 'attempt', 1);
            if (!exists) redisTransaction.expire(key, lockInterval);

            const redisResponse = await redisTransaction.exec();
            if (!redisResponse) throw new Error('Redis transaction failed or returned null.');

            const userAttempt = Number(redisResponse[0]?.[1]);
            if (userAttempt > allowedAttempts) {
                await this.tempBlockIpService.addTempBlockIp(ip, lockedFor);
                await this.redis.del(key);
                this.logger.log('Too many Request');
                return false;
            }
            return true;
        } catch (error) {
            this.logger.error(`Failed to add Ip in tempBlock`, error);
            throw error;
        }
    }
}
