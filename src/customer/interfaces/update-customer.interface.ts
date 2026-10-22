import { ELoginProvider } from 'src/common/enums/login-provider.enum';

export interface IUpdateCustomer {
    email?: string;
    displayName?: string;
    avatarUrl?: string;
    provider?: ELoginProvider;
    accountId?: string;
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: Date;
    scopes?: string[];
    token?: string;
}
