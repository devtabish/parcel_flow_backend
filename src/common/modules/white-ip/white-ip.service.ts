import { Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisService } from 'src/core/redis/redis.service';
import { IApiResponse } from 'src/common/interfaces/response.interface';

@Injectable()
export class WhiteIpService {
    private readonly logger = new Logger(WhiteIpService.name);
    private readonly redisEntity = 'whiteListedIps';

    constructor(private readonly redisService: RedisService) {}

    private get redis(): Redis {
        return this.redisService.getMainClient();
    }

    async add(ip: string): Promise<IApiResponse> {
        try {
            const key = this.redisEntity;
            await this.redis.sadd(key, ip);
            return {
                success: true,
                message: 'Ip added successfully',
                data: { ip },
            };
        } catch (error) {
            this.logger.error(`Failed to add in whiteListedIps`, error);
            throw error;
        }
    }

    async getAll(): Promise<IApiResponse> {
        try {
            const data = await this.redis.smembers(this.redisEntity);
            return {
                success: true,
                message: 'Ok',
                data: {
                    ips: data,
                },
            };
        } catch (error) {
            this.logger.error(`Failed to fetch from whiteListedIps`, error);
            throw error;
        }
    }

    async remove(ip: string): Promise<IApiResponse> {
        try {
            await this.redisService.getMainClient().srem(this.redisEntity, ip);
            return {
                success: true,
                message: 'Ok',
            };
        } catch (error) {
            this.logger.error(`Failed to remove from whiteListedIps`, error);
            throw error;
        }
    }

    async exist(ip: string): Promise<boolean> {
        try {
            const data = await this.redis.sismember(this.redisEntity, ip);
            return Boolean(data);
        } catch (error) {
            this.logger.error(`Failed to check from whiteListedIps`, error);
            throw error;
        }
    }
}
