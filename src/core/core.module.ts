import { Module } from '@nestjs/common';
import { RedisModule } from './redis/redis.module';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { SocketModule } from './socket/socket.module';

@Module({
    imports: [RedisModule, DatabaseModule, HealthModule, SocketModule],
})
export class CoreModule {}
