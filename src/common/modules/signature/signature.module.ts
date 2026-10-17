import { Module } from '@nestjs/common';
import { SignatureService } from './signature.service';
import { StateService } from './oauth-signature.service';

@Module({
    imports: [],
    providers: [SignatureService, StateService],
})
export class SignatureModule {}
