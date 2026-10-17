import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { WhiteIpService } from './white-ip.service';
import { IpDto } from './dto/ip.dto';
import { StrictValidation } from 'src/common/decorators/strict-validation.decorator';
import { IApiResponse } from 'src/common/interfaces/response.interface';

@StrictValidation()
@Controller('white-ip')
export class WhiteIpController {
    constructor(private readonly whiteIpService: WhiteIpService) {}

    @Post()
    add(@Body() payload: IpDto): Promise<IApiResponse> {
        return this.whiteIpService.add(payload.ip);
    }

    @Get()
    getAll(): Promise<IApiResponse> {
        return this.whiteIpService.getAll();
    }

    @Delete()
    deleteIp(@Query() payload: IpDto): Promise<IApiResponse> {
        return this.whiteIpService.remove(payload.ip);
    }
}
