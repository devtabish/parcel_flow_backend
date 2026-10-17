import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosHeaders, AxiosRequestConfig } from 'axios';
import { firstValueFrom } from 'rxjs';
import { randomUUID } from 'crypto';
import { IApiRequest } from '../interfaces/api-request.interface';
import { IApiResponse } from '../interfaces/api-response.interface';

@Injectable()
export class ApiCallWithThrowService {
    private readonly logger = new Logger(ApiCallWithThrowService.name);

    constructor(private readonly httpService: HttpService) {
        this.setupInterceptors();
    }

    private setupInterceptors(): void {
        const axios = this.httpService.axiosRef;

        axios.interceptors.request.use((config) => {
            if (!(config.headers instanceof AxiosHeaders)) config.headers = new AxiosHeaders(config.headers);
            config.headers.set('x-request-id', randomUUID());
            return config;
        });
    }

    async get<T>(req: IApiRequest): Promise<IApiResponse<T>> {
        return this.execute<T>({ method: 'GET', url: req.uri }, req);
    }

    async post<T, P = unknown>(req: IApiRequest<P>): Promise<IApiResponse<T>> {
        return this.execute<T>({ method: 'POST', url: req.uri, data: req.payload }, req);
    }

    async put<T, P = unknown>(req: IApiRequest<P>): Promise<IApiResponse<T>> {
        return this.execute<T>({ method: 'PUT', url: req.uri, data: req.payload }, req);
    }

    private async execute<T>(baseConfig: AxiosRequestConfig, req: IApiRequest): Promise<IApiResponse<T>> {
        const startApiReqTime = Date.now();
        const response = await firstValueFrom(
            this.httpService.request<T>({
                timeout: req.timeoutMs ?? 5000,
                headers: this.buildHeaders(req),
                params: req.params,
                responseType: req.responseType,
                ...baseConfig,
            }),
        );
        const latency = Date.now() - startApiReqTime;
        return {
            error: false,
            body: response.data,
            statusCode: response.status,
            latency: this.formatLatency(latency),
        };
    }

    private formatLatency(ms: number): string {
        return ms >= 1000 ? `${(ms / 1000).toFixed(2)} s` : `${Math.round(ms)} ms`;
    }

    private buildHeaders(req: IApiRequest): Record<string, string> {
        return {
            ...(req.token ? { Authorization: req.token } : {}),
            ...(req.headers ?? {}),
        };
    }
}
