import { UsePipes, ValidationPipe } from '@nestjs/common';

export const LooseValidation = (): ClassDecorator & MethodDecorator =>
    UsePipes(
        new ValidationPipe({
            transform: true,
            whitelist: false,
            forbidNonWhitelisted: false,
        }),
    );
