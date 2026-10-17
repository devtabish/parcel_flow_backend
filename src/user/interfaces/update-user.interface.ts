import { ELoginProvider } from 'src/common/enums/login-provider.enum';

export interface IUpdateUser {
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
