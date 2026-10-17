import { IsOptional, IsString } from 'class-validator';

export class GetSalesManagementDto {
    @IsString()
    @IsOptional()
    startDate?: string;

    @IsString()
    @IsOptional()
    endDate?: string;

    @IsString()
    @IsOptional()
    search?: string;
}
