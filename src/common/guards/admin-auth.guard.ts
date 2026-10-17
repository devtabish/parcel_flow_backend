import { Injectable, ExecutionContext, UnauthorizedException, CanActivate, BadRequestException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
// import { AuthService } from 'src/auth/auth.service';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { RedisAuthService } from '../modules/redis-auth/redis-auth.service';
import { IAdminRequest } from './interfaces/admin-request.interface';

@Injectable()
export class AdminAuthGuard implements CanActivate {
    constructor(
        private redisAuthService: RedisAuthService,
        private reflector: Reflector, // private authService: AuthService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]);
        if (isPublic) return true;

        const request = context.switchToHttp().getRequest<IAdminRequest>();
        console.log(request.headers);
        const token = this.extractTokenFromHeader(request);
        if (!token) throw new BadRequestException('Token Missing');

        try {
            // const profile = await this.authService.validateAdminToken(token);
            const profile = await this.redisAuthService.validateAdminAuth(token);
            request.user = profile;
        } catch {
            throw new UnauthorizedException();
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = (request.headers['authorization'] as string)?.split(' ') ?? [];
        return type === 'Bearer' && token ? token : undefined;
    }
}
