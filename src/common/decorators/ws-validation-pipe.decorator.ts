import { UsePipes, ValidationPipe } from '@nestjs/common';

export const WsValidationPipe = (): ClassDecorator =>
    UsePipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: false,
        }),
    );
