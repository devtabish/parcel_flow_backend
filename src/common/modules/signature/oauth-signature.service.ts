import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { IOAuthState } from 'src/common/interfaces/o-auth-state.interface';

@Injectable()
export class StateService {
    private readonly stateSecret = this.configService.getOrThrow<string>('OAUTH_STATE_SECRET');
    constructor(private readonly configService: ConfigService) {}

    encode(state: IOAuthState): string {
        const json = JSON.stringify(state);
        const sig = crypto.createHmac('sha256', this.stateSecret).update(json).digest('base64url');
        const b64 = Buffer.from(json, 'utf8').toString('base64url');
        return `${b64}.${sig}`;
    }

    decode(token: string): IOAuthState {
        const [b64, sig] = token.split('.');
        if (!b64 || !sig) throw new Error('Invalid state format');
        const json = Buffer.from(b64, 'base64url').toString('utf8');
        const expected = crypto.createHmac('sha256', this.stateSecret).update(json).digest('base64url');

        const ba = Buffer.from(String(sig));
        const bb = Buffer.from(String(expected));
        if (ba.length !== bb.length) throw new Error('Invalid state signature');
        const parsed = JSON.parse(json) as IOAuthState;
        if (!parsed.nonce || !parsed.iat) throw new Error('Invalid state payload');
        return parsed;
    }
}
