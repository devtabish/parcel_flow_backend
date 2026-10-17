import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class AdminSignupDto {
    @IsNotEmpty()
    @IsString()
    email: string;

    @IsString()
    @MinLength(8)
    password: string;
}
