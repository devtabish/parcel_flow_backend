import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule, OpenAPIObject } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { IncomingMessage, ServerResponse } from 'http';

export function setupSwagger(app: INestApplication, configService: ConfigService): void {
    const swaggerUser = configService.getOrThrow<string>('SWAGGER_USER');
    const swaggerPass = configService.getOrThrow<string>('SWAGGER_PASS');

    if (!swaggerUser || !swaggerPass) throw new Error('Swagger credentials are not configured');

    const config = new DocumentBuilder()
        .setTitle('ParcelFlow')
        .setDescription('The ParcelFlow API Documentation')
        .setVersion('1.0')
        .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'JWT-auth')
        .addSecurityRequirements('JWT-auth')
        .addOAuth2()
        .addTag('ParcelFlow')
        .build();

    const document: OpenAPIObject = SwaggerModule.createDocument(app, config);

    const swaggerAuth = (req: IncomingMessage, res: ServerResponse, next: (err?: Error) => void): void => {
        const authHeader = req.headers.authorization;

        if (authHeader?.startsWith('Basic ')) {
            const base64Credentials = authHeader.split(' ')[1];
            const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
            const [user, pass] = credentials.split(':');

            if (user === swaggerUser && pass === swaggerPass) return next();
        }

        res.setHeader('WWW-Authenticate', 'Basic realm="Swagger Docs"');
        res.statusCode = 401;
        res.end('Authentication required');
    };

    const swaggerOptions = {
        swaggerOptions: {
            defaultModelsExpandDepth: -1,
            defaultModelExpandDepth: 3,
            defaultModelRendering: 'model',
            displayRequestDuration: true,
            docExpansion: 'none',
            persistAuthorization: true,
            tryItOutEnabled: true,
            filter: true,
            syntaxHighlight: {
                activate: true,
                theme: 'agate',
            },
        },
        customSiteTitle: 'ParcelFlow API Doc',
    };

    app.use('/doc/swagger', swaggerAuth);

    const excludedModules = ['white-ip', 'white-domain'];
    const filteredPaths = {};
    Object.keys(document.paths).forEach((path) => {
        const shouldInclude = !excludedModules.some((module) => path.startsWith(`/${module}`) || path.startsWith(`/api/${module}`));
        if (shouldInclude) filteredPaths[path] = document.paths[path];
    });

    document.paths = filteredPaths;

    SwaggerModule.setup('doc/swagger', app, document, swaggerOptions);
}
