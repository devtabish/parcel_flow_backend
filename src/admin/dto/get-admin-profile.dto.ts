import { IsMongoId, IsNotEmpty } from 'class-validator';

export class GetAdminProfileDto {
    @IsMongoId()
    @IsNotEmpty()
    adminId: string;
}
