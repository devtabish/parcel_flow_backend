import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class LoginCustomerDto {
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}
