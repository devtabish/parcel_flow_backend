import { Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisService } from 'src/core/redis/redis.service';
import { IApiResponse } from 'src/common/interfaces/response.interface';

@Injectable()
export class WhiteDomainService {
    private readonly logger = new Logger(WhiteDomainService.name);
    private readonly redisEntity = 'whiteListedDomains';

    constructor(private readonly redisService: RedisService) {}

    private get redis(): Redis {
        return this.redisService.getMainClient();
    }

    async add(domain: string): Promise<IApiResponse> {
        try {
            await this.redis.sadd(this.redisEntity, domain);
            return {
                success: true,
                message: 'Domain added successfully',
                data: { domain },
            };
        } catch (error) {
            this.logger.error(`Failed to add in ${this.redisEntity}`, error);
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
                    domains: data,
                },
            };
        } catch (error) {
            this.logger.error(`Failed to fetch from ${this.redisEntity}`, error);
            throw error;
        }
    }

    async remove(domain: string): Promise<IApiResponse> {
        try {
            await this.redis.srem(this.redisEntity, domain);
            return {
                success: true,
                message: 'Ok',
            };
        } catch (error) {
            this.logger.error(`Failed to remove from ${this.redisEntity}`, error);
            throw error;
        }
    }

    async exist(domain: string): Promise<boolean> {
        try {
            const data = await this.redis.sismember(this.redisEntity, domain);
            return Boolean(data);
        } catch (error) {
            this.logger.error(`Failed to check from ${this.redisEntity}`, error);
            throw error;
        }
    }

    async existTest(domain: string): Promise<number> {
        try {
            const data = await this.redis.sismember(this.redisEntity, domain);
            return data;
        } catch (error) {
            this.logger.error(`Failed to check from ${this.redisEntity}`, error);
            throw error;
        }
    }
}
