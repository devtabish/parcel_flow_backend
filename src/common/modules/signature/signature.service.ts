import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class SignatureService {
    private readonly logger = new Logger(SignatureService.name);
    constructor(private readonly config: ConfigService) {}

    async create(payload: unknown): Promise<string> {
        return new Promise((resolve, reject) => {
            try {
                const privateKey = this.config.get<string>('BOILER_PRIVATE_KEY');
                if (!privateKey) throw new Error('Private key not configured');

                const signer = crypto.createSign('RSA-SHA256');
                signer.update(JSON.stringify(payload));
                signer.end();

                const signature = signer.sign(privateKey, 'base64');
                resolve(signature);
            } catch (error) {
                let errorMessage = 'Unknown error';
                let errorStack = '';
                if (error instanceof Error) {
                    errorMessage = error.message;
                    errorStack = error.stack ?? '';
                }
                this.logger.error(errorStack || errorMessage);
                reject(new Error(errorMessage));
            }
        });
    }

    async validate(publicKey: string, signature: string, payload: unknown): Promise<boolean> {
        return new Promise((resolve, reject) => {
            try {
                const verifier = crypto.createVerify('RSA-SHA256');
                verifier.update(JSON.stringify(payload));
                verifier.end();

                const isValid = verifier.verify(publicKey, signature, 'base64');
                resolve(isValid);
            } catch (error) {
                let errorMessage = 'Unknown error';
                let errorStack = '';
                if (error instanceof Error) {
                    errorMessage = error.message;
                    errorStack = error.stack ?? '';
                }
                this.logger.error(errorStack || errorMessage);
                reject(new Error(errorMessage));
            }
        });
    }
}
