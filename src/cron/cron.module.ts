import { Module } from '@nestjs/common';
import { CronService } from './services/cron.service';
import { CronController } from './controllers/cron.controller';

@Module({
    imports: [],
    providers: [CronService],
    controllers: [CronController],
})
export class CronModule {}
