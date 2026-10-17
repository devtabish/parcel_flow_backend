import { Module } from '@nestjs/common';
import { EmailService } from './services/email.service';
import { EmailController } from './controllers/email.controller';
import { ApiCallModule } from '../api-call/api-call.module';

@Module({
    imports: [ApiCallModule],
    controllers: [EmailController],
    providers: [EmailService],
    exports: [EmailService],
})
export class EmailModule {}
