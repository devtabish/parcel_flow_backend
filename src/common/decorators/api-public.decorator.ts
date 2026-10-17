import { applyDecorators } from '@nestjs/common';
import { ApiSecurity } from '@nestjs/swagger';
import { Public } from './public.decorator';

export const ApiPublic = (): MethodDecorator => {
    return applyDecorators(ApiSecurity({}), Public());
};
