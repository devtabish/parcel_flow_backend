import { BadRequestException, CanActivate, ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { TempBlockIpService } from './temp-block-ip.service';

@Injectable()
export class TempBlockIpGuard implements CanActivate {
    constructor(private readonly tempBlockIpService: TempBlockIpService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const userIp = request?.ip || '';
        // const userIp = "127.34.23.64"
        if (!userIp) throw new BadRequestException();
        const isBlocked = await this.tempBlockIpService.check(userIp);
        if (isBlocked) throw new HttpException({ message: 'Forbidden: Temporary Block' }, 429);

        return true;
    }
}
