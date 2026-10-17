import { UsePipes, ValidationPipe } from '@nestjs/common';

export const StrictValidation = (): MethodDecorator & ClassDecorator =>
    UsePipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
        }),
    );
