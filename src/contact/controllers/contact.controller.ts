import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ContactService } from '../services/contact.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ERoles } from 'src/common/enums/roles.enum';
import { SendMessageDto } from '../dto/send-message.dto';
import { IApiResponse } from 'src/common/interfaces/response.interface';

@Controller('user/contact')
@UseGuards(RolesGuard)
export class ContactController {
    constructor(private readonly contactService: ContactService) {}

    @Roles(ERoles.CUSTOMER)
    @Post()
    async sendContactMessage(@Body() payload: SendMessageDto): Promise<IApiResponse> {
        return this.contactService.sendMessage(payload);
    }
}
