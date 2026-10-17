import { IsMongoId, IsNotEmpty } from 'class-validator';

export class GetAddressDto {
    @IsMongoId()
    @IsNotEmpty()
    addressId: string;
}
