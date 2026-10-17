import { EConnectProvider } from '../enums/connect-provider.enum';
import { EOAuthMode } from '../enums/oauth-mode.enum';
import { EOAuthPurpose } from '../enums/oauth-purpose.enum';

export interface IOAuthState {
    provider: EConnectProvider;
    mode: EOAuthMode;
    purpose: EOAuthPurpose;
    redirect: string;
    userHint?: string;
    nonce: string;
    iat: number;

    pkce?: {
        codeVerifier: string;
    };
}
