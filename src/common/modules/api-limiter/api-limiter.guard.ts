import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';
import { IRequestLimiterOptions } from './api-limiter.interface';
import { Reflector } from '@nestjs/core';
import { API_LIMITER_OPTIONS } from './api-limiter.decorator';
import { ApiLimiterService } from './api-limiter.service';

@Injectable()
export class ApiLimiterGuard implements CanActivate {
    private readonly defaultOptions: IRequestLimiterOptions = {
        lockInterval: 10, // seconds
        allowedAttempts: 5, // attempts
        lockedFor: 120 * 60, // seconds
    };

    constructor(
        private readonly reflector: Reflector,
        private readonly apiLimiterService: ApiLimiterService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const userIp = request?.ip;
        // const userIp = '127.34.23.64'
        if (!userIp) throw new BadRequestException();

        const handlerOptions = this.reflector.get<IRequestLimiterOptions>(API_LIMITER_OPTIONS, context.getHandler());

        const controllerOptions = this.reflector.get<IRequestLimiterOptions>(API_LIMITER_OPTIONS, context.getClass());

        const options: IRequestLimiterOptions = {
            ...this.defaultOptions,
            ...controllerOptions,
            ...handlerOptions,
        };

        const key = `appLimiter:${userIp}:${request.method}-${request.baseUrl}${request.path}`;
        const added = await this.apiLimiterService.add({
            ip: userIp,
            key,
            ...options,
        });
        return Boolean(added);
    }
}
