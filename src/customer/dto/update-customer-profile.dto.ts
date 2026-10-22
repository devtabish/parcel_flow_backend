import { IsOptional, IsString } from 'class-validator';
import { AtLeastOneField } from 'src/common/validators/at-least-one-field.validator';

@AtLeastOneField<UpdateUserProfileDto>(['firstName'])
export class UpdateUserProfileDto {
    @IsOptional()
    @IsString()
    firstName: string;

    @IsOptional()
    @IsString()
    lastName: string;

    @IsString()
    @IsOptional()
    email: string;
}
