import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

export class RegisterCustomerDto {
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @IsOptional()
    userName: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}
