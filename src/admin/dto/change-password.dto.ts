import { IsString, MinLength } from 'class-validator';
import { IsNotEqualTo } from '../validators/is-not-equal-to.validator';

export class ChangePasswordDto {
    @IsString()
    @MinLength(8)
    oldPassword: string;

    @IsString()
    @MinLength(8)
    @IsNotEqualTo('oldPassword')
    newPassword: string;
}
