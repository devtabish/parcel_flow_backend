import { UseFilters } from '@nestjs/common';
import { ApiExceptionFilter } from '../filters/api-exception.filter';

export const WsExceptionFilter = (): ClassDecorator => UseFilters(new ApiExceptionFilter());
