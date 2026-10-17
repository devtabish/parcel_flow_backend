import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

export class RegisterUserDto {
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
