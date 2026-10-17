import { IsEmail } from 'class-validator';

export class SendOtpUserDto {
    @IsEmail()
    email: string;
}
