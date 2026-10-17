import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class AddAddressDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    phoneNo: string;

    @IsString()
    @IsNotEmpty()
    addressLine1: string;

    @IsString()
    @IsOptional()
    addressLine2?: string;

    @IsString()
    @IsNotEmpty()
    city: string;

    @IsNumber()
    @IsNotEmpty()
    zipCode: number;

    @IsString()
    @IsNotEmpty()
    country: string;

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string;
}
