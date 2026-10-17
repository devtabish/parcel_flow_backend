import { Injectable, CanActivate, ExecutionContext, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { RedisAuthService } from '../modules/redis-auth/redis-auth.service';
import { IUserRequest } from './interfaces/user-request.interface';

@Injectable()
export class CustomerAuthGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private redisAuthService: RedisAuthService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]);
        if (isPublic) return true;

        const request = context.switchToHttp().getRequest<IUserRequest>();
        const token = this.extractTokenFromHeader(request);
        if (!token) throw new BadRequestException('Token Missing');
        try {
            const user = await this.redisAuthService.validateUserAuth(token);
            request.user = user;
        } catch {
            throw new UnauthorizedException();
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const tokenwithoutbearer: string = request.headers['authorization'];
        const [type, token] = (request.headers['authorization'] as string)?.split(' ') ?? [];
        if (type && token) {
            if (type === 'Bearer' && token) return token;
            else return undefined;
        }
        if (tokenwithoutbearer) return tokenwithoutbearer;
        else return undefined;
    }
}
