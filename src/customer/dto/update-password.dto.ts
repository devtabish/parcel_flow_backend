import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdatePasswordDto {
    @IsString()
    @IsOptional()
    oldPassword: string;

    @IsString()
    @IsNotEmpty()
    newPassword: string;
}
