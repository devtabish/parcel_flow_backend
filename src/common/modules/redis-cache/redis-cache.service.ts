import { Injectable, Logger } from '@nestjs/common';
import { IRedisCacheOptions } from './redis-cache.interface';
import { RedisService } from 'src/core/redis/redis.service';

@Injectable()
export class RedisCacheService {
    private readonly logger = new Logger(RedisCacheService.name);
    constructor(private readonly redisService: RedisService) {}

    async setJsonString(key: string, data: unknown, options: IRedisCacheOptions = {}): Promise<void> {
        const { expiry } = options;
        const stringifiedData = JSON.stringify(data);
        try {
            if (expiry) await this.redisService.getMainClient().set(key, stringifiedData, 'EX', expiry);
            else await this.redisService.getMainClient().set(key, stringifiedData);
        } catch (error) {
            this.logger.error(`Failed to set cache for key: ${key}`, error);
        }
    }

    async getJsonString<T>(key: string): Promise<T | null> {
        try {
            const data = await this.redisService.getMainClient().get(key);
            return data ? (JSON.parse(data) as T) : null;
        } catch (error) {
            this.logger.error(`Failed to get cache for key: ${key}`, error);
            return null;
        }
    }

    async deleteString(key: string): Promise<boolean> {
        try {
            await this.redisService.getMainClient().del(key);
            return true;
        } catch (error) {
            this.logger.error(`Failed to delete cache for key: ${key}`, error);
            return false;
        }
    }

    async set(key: string, data: string, options: IRedisCacheOptions = {}): Promise<void> {
        const { expiry } = options;
        try {
            if (expiry) await this.redisService.getMainClient().set(key, data, 'EX', expiry);
            else await this.redisService.getMainClient().set(key, data);
        } catch (error) {
            this.logger.error(`Failed to set cache for key: ${key}`, error);
        }
    }

    async get(key: string): Promise<string | null> {
        try {
            const data = await this.redisService.getMainClient().get(key);
            return data ? data : null;
        } catch (error) {
            this.logger.error(`Failed to get cache for key: ${key}`, error);
            return null;
        }
    }

    async setHash(hashName: string, key: string, data: unknown): Promise<void> {
        try {
            await this.redisService.getMainClient().hset(hashName.toString(), key.toString(), JSON.stringify(data));
        } catch (error) {
            this.logger.error(`Failed to set hash cache for ${hashName}:${key}`, error);
        }
    }

    async getHash<T>(hashName: string, key: string): Promise<T | null> {
        try {
            const data = await this.redisService.getMainClient().hget(hashName, key);
            return data ? (JSON.parse(data) as T) : null;
        } catch (error) {
            this.logger.error(`Failed to get hash cache for ${hashName}:${key}`, error);
            return null;
        }
    }

    async getAllHash(hashName: string): Promise<JSON[]> {
        try {
            const data = await this.redisService.getMainClient().hgetall(hashName);
            return data ? (Object.values(data).map((d: string) => JSON.parse(d) as object) as JSON[]) : [];
        } catch (error) {
            this.logger.error(`Failed to get all hash cache for: ${hashName}`, error);
            return [];
        }
    }

    async deleteHash(hashName: string, key: string): Promise<boolean> {
        try {
            await this.redisService.getMainClient().hdel(hashName.toString(), key.toString());
            return true;
        } catch (error) {
            this.logger.error(`Failed to delete hash cache for ${hashName}:${key}`, error);
            return false;
        }
    }
}
