import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiKeyGuard implements CanActivate {
    private readonly validKey = this.configService.getOrThrow<string>('CRON_API_KEY');
    constructor(private configService: ConfigService) {}

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const apiKey = request.headers['serveraccesskey'] || request.headers['serverAccessKey'];

        if (!apiKey || apiKey !== this.validKey) throw new UnauthorizedException('Invalid API Key');

        return true;
    }
}
