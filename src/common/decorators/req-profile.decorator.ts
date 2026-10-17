import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ReqProfile = createParamDecorator((field: string, ctx: ExecutionContext): any => {
    const request = ctx.switchToHttp().getRequest();
    return field?.length ? request.user?.[field] : request.user;
});
