import { INestApplicationContext, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import Redis, { RedisOptions } from 'ioredis';
import { ServerOptions, Server } from 'socket.io';

export class RedisIoAdapter extends IoAdapter implements OnModuleDestroy {
    private adapterConstructor?: ReturnType<typeof createAdapter>;
    private pubClient?: Redis;
    private subClient?: Redis;

    private readonly logger = new Logger(RedisIoAdapter.name);
    private readonly configService: ConfigService;

    constructor(app: INestApplicationContext) {
        super(app);
        this.configService = app.get(ConfigService);
    }

    private buildRedisOptions(): RedisOptions {
        return {
            lazyConnect: true,
            maxRetriesPerRequest: null,
            retryStrategy: (times: number): number => {
                const delay = Math.min(times * 50, 2000);
                this.logger.warn(`Redis retry attempt #${times}, delay=${delay}ms`);
                return delay;
            },
        };
    }

    private attachListeners(client: Redis, label: string): void {
        client.on('connect', () => this.logger.log(`[${label}] connected`));
        client.on('ready', () => this.logger.log(`[${label}] ready`));
        client.on('error', (err) => this.logger.error(`[${label}] error`, err));
        client.on('close', () => this.logger.warn(`[${label}] connection closed`));
        client.on('reconnecting', () => this.logger.warn(`[${label}] reconnecting`));
        client.on('end', () => this.logger.warn(`[${label}] connection ended`));
    }

    async connectToRedis(): Promise<void> {
        if (this.adapterConstructor) {
            this.logger.warn('Redis adapter already initialized, skipping...');
            return;
        }

        const redisUrl = this.configService.getOrThrow<string>('REDIS_KEY');
        if (!redisUrl) throw new Error('REDIS_KEY is not defined');

        const options = this.buildRedisOptions();
        this.pubClient = new Redis(redisUrl, options);
        this.subClient = this.pubClient.duplicate();

        this.attachListeners(this.pubClient, 'PUB');
        this.attachListeners(this.subClient, 'SUB');

        try {
            await Promise.all([this.pubClient.connect(), this.subClient.connect()]);
            this.adapterConstructor = createAdapter(this.pubClient, this.subClient);
            console.log('✅ Redis adapter initialized');
            // this.logger.log('Redis adapter initialized');
        } catch (err) {
            this.logger.error('Redis adapter init failed', err);
            throw err;
        }
    }

    createIOServer(port: number, options?: ServerOptions): Server {
        if (!this.adapterConstructor) throw new Error('Redis adapter not initialized. Call connectToRedis() before bootstrap.');

        const server: Server = super.createIOServer(port, {
            ...options,
            cors: {
                origin: true,
                credentials: true,
            },
        });

        server.adapter(this.adapterConstructor);
        this.logger.log('Socket.IO server with Redis adapter created');
        return server;
    }

    async onModuleDestroy(): Promise<void> {
        this.logger.log('Shutting down Redis connections...');
        await Promise.allSettled([this.pubClient?.quit(), this.subClient?.quit()]);
        this.logger.log('Redis connections closed');
    }
}
