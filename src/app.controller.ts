import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { IApiResponse } from './common/interfaces/response.interface';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    getWelcome(): IApiResponse {
        return this.appService.getWelcome();
    }
}
