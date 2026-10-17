import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { RedisCacheModule } from 'src/common/modules/redis-cache/redis-cache.module';

@Module({
    imports: [RedisCacheModule],
    providers: [SocketGateway],
    exports: [SocketGateway],
})
export class SocketModule {}
