import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRiderDto {
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsOptional()
    userName: string;
}
