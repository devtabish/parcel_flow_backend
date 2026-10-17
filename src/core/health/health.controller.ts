import { Controller, Get, HttpCode } from '@nestjs/common';
import { HealthService } from './health.service';
import { HttpStatusCode } from 'axios';
import { IApiResponse } from 'src/common/interfaces/response.interface';

@Controller('health')
export class HealthController {
    constructor(private readonly healthService: HealthService) {}

    @Get()
    @HttpCode(HttpStatusCode.Ok)
    healthCheck(): IApiResponse {
        return this.healthService.healthCheck();
    }
}
