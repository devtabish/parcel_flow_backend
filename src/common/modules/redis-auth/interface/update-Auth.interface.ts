import { ELoginProvider } from 'src/common/enums/login-provider.enum';

export interface IUpdateAuth {
    _id: string;
    email?: string;
    displayName?: string;
    avatarUrl?: string;
    provider: ELoginProvider;
    userType?: string;
    accountId?: string;
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: Date;
    scopes?: string[];
    token?: string;
}
