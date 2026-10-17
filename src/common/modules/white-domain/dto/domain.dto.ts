import { IsNotEmpty, IsString } from 'class-validator';

export class DomainDto {
    @IsString()
    @IsNotEmpty()
    domain: string;

    @IsString()
    @IsNotEmpty()
    url: string;
}
