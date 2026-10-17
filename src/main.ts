import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import multipart from '@fastify/multipart';
import morgan from 'morgan';
import { RequestMethod } from '@nestjs/common';
import { ApiExceptionFilter } from './common/filters/api-exception.filter';
import { ConfigService } from '@nestjs/config';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { setupSwagger } from './core/swagger/swagger.config';
import { RedisIoAdapter } from './core/socket/socket.adaptor';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
async function bootstrap(): Promise<void> {
    const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
    await app.register(multipart, {
        limits: {
            fileSize: 15 * 1024 * 1024,
        },
    });
    app.getHttpAdapter()
        .getInstance()
        .get('/payment.html', async (_request, reply) => {
            const filePath = join(process.cwd(), 'public', 'stripe-test.html');

            const html = await readFile(filePath, 'utf-8');

            return reply.type('text/html').send(html);
        });
    const configService = app.get(ConfigService);
    const port = configService.getOrThrow<number>('PORT');

    app.use(morgan('dev'));
    app.useGlobalFilters(new ApiExceptionFilter());
    app.useGlobalInterceptors(app.get(ResponseInterceptor));
    app.enableCors({
        origin: true,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        optionsSuccessStatus: 204,
    });
    app.setGlobalPrefix('api', {
        exclude: [{ path: '', method: RequestMethod.GET }],
    });
    const redisIoAdapter = new RedisIoAdapter(app);
    await redisIoAdapter.connectToRedis();
    app.useWebSocketAdapter(redisIoAdapter);

    app.enableShutdownHooks();
    if (configService.getOrThrow<string>('SWAGGER_ENABLED') === 'true') setupSwagger(app, configService);
    await app.listen(port, '0.0.0.0');
    console.log(`Groot is running on port ${port}`);
}

void bootstrap();
