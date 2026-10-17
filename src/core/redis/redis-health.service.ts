import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class RedisHealthService {
    public readonly logger = new Logger(RedisHealthService.name);

    private healthStatus = {
        mainRedis: false,
        limiterRedis: false,
    };

    setStatus(label: string, status: boolean): void {
        if (label === 'Main') this.healthStatus.mainRedis = status;
        if (label === 'Limiter') this.healthStatus.limiterRedis = status;
    }

    isHealthy(): boolean {
        return this.healthStatus.mainRedis && this.healthStatus.limiterRedis;
    }
}
