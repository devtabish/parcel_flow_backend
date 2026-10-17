import { IsNotEmpty, IsString } from 'class-validator';

export class IpDto {
    @IsString()
    @IsNotEmpty()
    ip: string;
}
