import { IsEmail, IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateAddressDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsInt()
    @IsOptional()
    phoneNo?: number;

    @IsString()
    @IsOptional()
    addressLine1?: string;

    @IsString()
    @IsOptional()
    addressLine2?: string;

    @IsString()
    @IsOptional()
    city?: string;

    @IsInt()
    @IsOptional()
    zipCode?: number;

    @IsString()
    @IsOptional()
    country?: string;

    @IsString()
    @IsEmail()
    @IsOptional()
    email?: string;
}
