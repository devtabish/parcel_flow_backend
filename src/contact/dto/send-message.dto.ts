import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SendMessageDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    email: string;

    @IsNumber()
    @IsNotEmpty()
    phoneNo: number;

    @IsString()
    @IsNotEmpty()
    message: string;
}
