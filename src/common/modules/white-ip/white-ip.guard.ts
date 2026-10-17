import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { WhiteIpService } from './white-ip.service';

@Injectable()
export class WhiteIpGuard implements CanActivate {
    private readonly logger = new Logger(WhiteIpGuard.name);

    constructor(private readonly whiteIpService: WhiteIpService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const userIp = request?.ip;
        if (!userIp) {
            this.logger.warn(`Request missing IP`);
            return false;
        }
        const exist = await this.whiteIpService.exist(userIp);
        return Boolean(exist);
    }
}
