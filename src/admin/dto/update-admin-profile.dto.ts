import { IsOptional, IsString } from 'class-validator';
import { AtLeastOneField } from 'src/common/validators/at-least-one-field.validator';

@AtLeastOneField<UpdateAdminProfileDto>(['name'])
export class UpdateAdminProfileDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    phoneNo?: string;

    @IsString()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    address?: string;
}
