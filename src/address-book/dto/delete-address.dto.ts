import { IsMongoId, IsNotEmpty } from 'class-validator';

export class DeleteAddressDto {
    @IsMongoId()
    @IsNotEmpty()
    addressId: string;
}
