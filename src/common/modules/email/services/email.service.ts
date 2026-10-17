import { Injectable, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisCacheService } from '../../redis-cache/redis-cache.service';
import { EGrantTypeParams } from 'src/common/enums/oauth-grant-type-params.enum';
import { ApiCallWithThrowService } from '../../api-call/services/api-call-with-throw.service';
import { IZohoTokenResponse } from '../interfaces/zoho-token-response.interface';

@Injectable()
export class EmailService {
    private readonly accessTokenUri = this.configService.getOrThrow<string>('ZOHO_ACCESS_TOKEN_URL');
    private readonly fromAddress = this.configService.getOrThrow<string>('ZOHO_FROM_EMAIL');
    private readonly zohoBaseUrl = this.configService.getOrThrow<string>('ZOHO_API_BASE_URL');
    private readonly zohoAccountId = this.configService.getOrThrow<string>('ZOHO_ACCOUNT_ID');
    constructor(
        private readonly configService: ConfigService,
        private readonly redisCacheService: RedisCacheService,
        private readonly apiCallWithThrowService: ApiCallWithThrowService,
    ) {}

    async getAccessToken(): Promise<string> {
        try {
            const response = await this.apiCallWithThrowService.post<IZohoTokenResponse, null>({
                uri: this.accessTokenUri,
                payload: null,
                params: {
                    refresh_token: process.env.ZOHO_REFRESH_TOKEN,
                    client_id: process.env.ZOHO_CLIENT_ID,
                    client_secret: process.env.ZOHO_CLIENT_SECRET,
                    grant_type: EGrantTypeParams.REFRESH_TOKEN,
                },
            });

            return response.body.access_token;
        } catch (error) {
            console.error('Zoho Token Error:', error.response?.data || error);
            throw new HttpException('Failed to get Zoho access token', 500);
        }
    }

    async sendEmail(to: string, subject: string, htmlContent: string): Promise<void> {
        let accessToken: string;
        accessToken = await this.redisCacheService.get('accessToken');
        if (!accessToken) {
            accessToken = await this.getAccessToken();
            await this.redisCacheService.set('accessToken', accessToken, { expiry: 3600 });
        }
        const payload = {
            fromAddress: this.fromAddress,
            toAddress: to,
            subject: subject,
            content: htmlContent,
        };

        try {
            await this.apiCallWithThrowService.post<unknown, typeof payload>({
                uri: `${this.zohoBaseUrl}/accounts/${this.zohoAccountId}/messages`,
                token: `Zoho-oauthtoken ${accessToken}`,
                payload,
            });
        } catch (error) {
            console.error('Zoho Mail Error:', error.response?.data || error);
            throw new HttpException('Failed to send email', 500);
        }
    }

    // for configuration
    // async getMyAccountId() {
    //     try {
    //         const token = await this.getAccessToken();
    //         const response$ = this.httpService.get('https://mail.zoho.com/api/accounts', {
    //             headers: {
    //                 Authorization: `Zoho-oauthtoken ${token}`,
    //             },
    //         });
    //         const response = await lastValueFrom(response$);
    //         console.log('✅ Your Account ID Response:', response.data);

    //         const accountId = response.data.data[0]?.accountId;
    //         console.log('🎯 Your ZOHO_ACCOUNT_ID is:', accountId);

    //         return accountId as string;
    //     } catch (error) {
    //         console.error('Error fetching account ID:', error.response?.data || error);
    //     }
    // }
}
