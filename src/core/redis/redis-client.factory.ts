import { Injectable, Logger, OnApplicationShutdown } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisHealthService } from './redis-health.service';

@Injectable()
export class RedisClientFactory implements OnApplicationShutdown {
    private readonly logger = new Logger(RedisClientFactory.name);
    private readonly clients: Map<string, Redis> = new Map();

    constructor(private readonly redisHealth: RedisHealthService) {}

    createClient(config: { url: string; label: string }): Redis {
        const client = new Redis(config.url, {
            maxRetriesPerRequest: 3,
            lazyConnect: true,
        });

        this.setupEventHandlers(client, config.label);
        this.clients.set(config.label, client);
        return client;
    }

    private setupEventHandlers(client: Redis, label: string): void {
        client.on('error', (error) => {
            console.log('Redis Error: ', error);
            this.redisHealth.setStatus(label, false);
        });

        client.on('connect', () => {
            console.log(`✅ ${label} Redis connected`);

            this.redisHealth.setStatus(label, true);
        });

        client.on('reconnecting', () => {
            console.log(`${label} Redis reconnecting...`);
        });

        client.on('end', () => {
            console.log(`${label} Redis connection ended`);
        });
    }

    getClient(label: string): Redis | undefined {
        return this.clients.get(label);
    }

    async gracefullyShutdown(): Promise<void> {
        const disconnectPromises = Array.from(this.clients.entries()).map(async ([label, client]) => {
            try {
                if (client.status === 'ready') {
                    console.log(`✅ Redis ${label} disconnected gracefully`);
                    this.redisHealth.setStatus(label, false);
                    // console.log({ redisHealth: { ...this.redisHealth.getStatus() } })
                    await client.quit();
                } else console.log(`Redis ${label} is already disconnected`);
            } catch (error) {
                this.logger.error(`Error disconnecting ${label} Redis:`, error);
            }
        });
        await Promise.allSettled(disconnectPromises);
    }

    async onApplicationShutdown(): Promise<void> {
        await this.gracefullyShutdown();
    }
}
