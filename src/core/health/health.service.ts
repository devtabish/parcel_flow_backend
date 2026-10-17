import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RedisHealthService } from '../redis/redis-health.service';
import { IApiResponse } from 'src/common/interfaces/response.interface';

@Injectable()
export class HealthService {
    private readonly logger = new Logger(HealthService.name);
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly redisHealthService: RedisHealthService,
    ) {}

    healthCheck(): IApiResponse {
        if (!this.databaseService.isHealthy() || !this.redisHealthService.isHealthy()) throw new ServiceUnavailableException();
        return { message: 'OK' };
    }
}
