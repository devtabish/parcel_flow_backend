import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { IApiResponse } from '../interfaces/response.interface';
import { Reflector } from '@nestjs/core';
import { REDIRECT_DECORATOR } from '../decorators/redirect.decorator';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, IApiResponse> {
    constructor(private reflector: Reflector) {}
    intercept(context: ExecutionContext, next: CallHandler): Observable<IApiResponse> {
        const skip = this.reflector.getAllAndOverride<boolean>(REDIRECT_DECORATOR, [context.getHandler(), context.getClass()]);

        if (skip) return next.handle() as Observable<IApiResponse>;
        return next.handle().pipe(
            map((response: IApiResponse) => {
                return {
                    success: response.success ?? true,
                    message: response?.message,
                    data: response?.data,
                };
            }),
        );
    }
}
