import { SetMetadata } from '@nestjs/common';

export const REDIRECT_DECORATOR = 'REDIRECT_DECORATOR';
export const RedirectDecorator = (): MethodDecorator => SetMetadata(REDIRECT_DECORATOR, true);
