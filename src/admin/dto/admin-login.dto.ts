import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class AdminLoginDto {
    @IsNotEmpty()
    @IsString()
    email: string;

    @IsString()
    @MinLength(8)
    password: string;
}
