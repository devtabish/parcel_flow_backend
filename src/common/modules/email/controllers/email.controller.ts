import { Body, Controller } from '@nestjs/common';
import { EmailService } from '../services/email.service';
import { StrictValidation } from 'src/common/decorators/strict-validation.decorator';

@StrictValidation()
@Controller('email')
export class EmailController {
    constructor(private readonly emailService: EmailService) {}

    // for configuration
    // @Get('get-zoho-account-id')
    // async getAccountId() {
    //     const accountId = await this.emailService.getMyAccountId();
    //     return { accountId };
    // }
}
