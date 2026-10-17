import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { WhiteDomainService } from './white-domain.service';
import { DomainDto } from './dto/domain.dto';
import { IApiResponse } from 'src/common/interfaces/response.interface';

@Controller('white-domain')
export class WhiteDomainController {
    constructor(private readonly whiteDomainService: WhiteDomainService) {}

    @Post()
    add(@Body() payload: DomainDto): Promise<IApiResponse> {
        return this.whiteDomainService.add(payload.domain);
    }

    @Get()
    getAll(): Promise<IApiResponse> {
        return this.whiteDomainService.getAll();
    }

    @Delete()
    deleteDomain(@Query() payload: DomainDto): Promise<IApiResponse> {
        return this.whiteDomainService.remove(payload.domain);
    }
}
