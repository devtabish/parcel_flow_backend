import { IsOptional, IsPositive, Max, Min, IsIn, IsDate, ValidateIf, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class BasePaginationDto {
    @IsOptional()
    @Type(() => Number)
    @IsPositive()
    @Min(1)
    page?: number;

    @IsOptional()
    @Type(() => Number)
    @IsPositive()
    @Min(1)
    @Max(100)
    limit?: number;

    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    download?: boolean;

    @ValidateIf((obj) => obj.download === true || obj.startDate !== undefined)
    @Type(() => Date)
    @IsDate()
    startDate?: Date;

    @ValidateIf((obj) => obj.download === true || obj.endDate !== undefined)
    @Type(() => Date)
    @IsDate()
    endDate?: Date;

    @IsOptional()
    @IsIn(['asc', 'desc'])
    sortOrder?: 'asc' | 'desc';

    @IsOptional()
    @IsIn(['createdAt', 'updatedAt'])
    sortBy?: string;

    get sort(): Record<string, 1 | -1> {
        const field = this.sortBy || 'createdAt';
        const order = this.sortOrder === 'asc' ? 1 : -1;
        return { [field]: order };
    }
}
