import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisClientFactory } from './redis-client.factory';
import { RedisConfig } from './redis.config';
import { RedisHealthService } from './redis-health.service';

@Injectable()
export class RedisService implements OnModuleInit {
    private readonly logger = new Logger(RedisService.name);
    private mainClient: Redis;
    private limiterClient: Redis;

    constructor(
        private readonly redisClientFactory: RedisClientFactory,
        private readonly redisConfig: RedisConfig,
        private readonly redisHealth: RedisHealthService,
    ) {}

    async onModuleInit(): Promise<void> {
        await this.initializeClients();
    }

    private async initializeClients(): Promise<void> {
        try {
            this.mainClient = this.redisClientFactory.createClient(this.redisConfig.mainConfig);
            this.limiterClient = this.redisClientFactory.createClient(this.redisConfig.limiterConfig);

            await Promise.all([this.mainClient.connect(), this.limiterClient.connect()]);

            await this.waitForConnection();
        } catch (error) {
            this.logger.error('Failed to initialize Redis clients:', error);
            throw error;
        }
    }

    private async waitForConnection(): Promise<void> {
        const timeout = 10000;
        const startTime = Date.now();

        while (Date.now() - startTime < timeout) {
            if (this.redisHealth.isHealthy()) {
                console.log('✅ All Redis connections established');
                return;
            }
            await new Promise((resolve) => setTimeout(resolve, 100));
        }

        throw new Error('Redis connection timeout');
    }

    getMainClient(): Redis {
        return this.mainClient;
    }

    getLimiterClient(): Redis {
        return this.limiterClient;
    }

    async checkConnection(): Promise<boolean> {
        try {
            await this.mainClient.ping();
            return true;
        } catch (error) {
            this.logger.error('Redis connection check failed:', error);
            return false;
        }
    }

    // async reconnectIfNeeded(): Promise<void> {
    //   const clients = [
    //     { client: this.mainClient, label: 'Main' },
    //     { client: this.limiterClient, label: 'Limiter' },
    //   ];
    //
    //   for (const { client, label } of clients) {
    //     if (!client || client.status === 'end' || client.status === 'close') {
    //       this.logger.log(`Attempting to reconnect ${label} Redis...`);
    //       try {
    //         await client.connect();
    //       } catch (error) {
    //         this.logger.error(`Failed to reconnect ${label} Redis:`, error);
    //       }
    //     }
    //   }
    // }
}
