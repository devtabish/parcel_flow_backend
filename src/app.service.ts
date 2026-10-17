import { Injectable } from '@nestjs/common';
import { IApiResponse } from './common/interfaces/response.interface';

@Injectable()
export class AppService {
    getWelcome(): IApiResponse {
        return { message: 'Welcome to Kalkiva' };
    }
}
