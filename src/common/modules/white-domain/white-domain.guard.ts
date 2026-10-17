import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { WhiteDomainService } from './white-domain.service';

@Injectable()
export class WhiteDomainGuard implements CanActivate {
    private readonly logger = new Logger(WhiteDomainGuard.name);

    constructor(private readonly whiteDomainService: WhiteDomainService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const origin = request.headers?.origin;
        if (!origin) {
            this.logger.warn(`Request missing origin`);
            return false;
        }
        const exist = await this.whiteDomainService.exist(origin);
        return Boolean(exist);
    }
}
