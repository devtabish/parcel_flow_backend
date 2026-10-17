import { SetMetadata } from '@nestjs/common';
import { IRequestLimiterOptions } from './api-limiter.interface';

export const API_LIMITER_OPTIONS = 'apiLimiterOptions';

export const ApiLimiter = (options: Partial<IRequestLimiterOptions>): MethodDecorator => SetMetadata(API_LIMITER_OPTIONS, options);
