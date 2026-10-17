import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { RedisCacheService } from 'src/common/modules/redis-cache/redis-cache.service';

@Injectable()
export class SocketAuthGuard implements CanActivate {
    private readonly logger = new Logger(SocketAuthGuard.name);

    constructor(
        private jwtService: JwtService,
        private redisCacheService: RedisCacheService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const socket: Socket = context.switchToWs().getClient();

        try {
            const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(' ')[1];

            if (!token) throw new WsException('Authentication required');

            const payload = this.jwtService.verify(token);
            const userId = payload.sub || payload.id;

            if (!userId) throw new WsException('Invalid token payload');

            const userFromRedis = await this.redisCacheService.getHash('auth', userId);

            if (!userFromRedis) {
                this.logger.warn(`User not found in Redis - ${userId}`);
                throw new WsException('Unauthorized');
            }

            await this.redisCacheService.set(`socketId:${userId}`, socket.id);
            socket.data.user = userFromRedis;

            this.logger.log(`✅ Guard auth successful - ${socket.id} | User: ${userId}`);

            return true;
        } catch (error) {
            this.logger.warn(`Guard auth failed - ${socket.id} | ${error.message}`);
            throw new WsException(error.message);
        }
    }
}
