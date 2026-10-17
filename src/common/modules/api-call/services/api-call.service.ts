import { Injectable, Logger, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosHeaders, AxiosRequestConfig } from 'axios';
import { firstValueFrom } from 'rxjs';
import { randomUUID } from 'crypto';
import { BASE_RETRY_DELAY_MS } from 'src/common/constants/app.constants';
import { IApiRequest } from '../interfaces/api-request.interface';
import { IApiResponse } from '../interfaces/api-response.interface';

@Injectable()
export class ApiCallService {
    private readonly logger = new Logger(ApiCallService.name);

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

    async postWithRetry<T, P = unknown>(req: IApiRequest<P>): Promise<IApiResponse<T>> {
        return this.executeWithRetry<T>({ method: 'POST', url: req.uri, data: req.payload }, req);
    }

    async put<T, P = unknown>(req: IApiRequest<P>): Promise<IApiResponse<T>> {
        return this.execute<T>({ method: 'PUT', url: req.uri, data: req.payload }, req);
    }

    async patch<T, P = unknown>(req: IApiRequest<P>): Promise<IApiResponse<T>> {
        return this.execute<T>({ method: 'PATCH', url: req.uri, data: req.payload }, req);
    }

    async delete<T>(req: IApiRequest): Promise<IApiResponse<T>> {
        return this.execute<T>({ method: 'DELETE', url: req.uri }, req);
    }

    private async execute<T>(baseConfig: AxiosRequestConfig, req: IApiRequest): Promise<IApiResponse<T>> {
        const startApiReqTime = Date.now();
        try {
            const response = await firstValueFrom(
                this.httpService.request<T>({
                    timeout: req.timeoutMs ?? 5000,
                    validateStatus: () => true,
                    headers: this.buildHeaders(req),
                    params: req.params,
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
        } catch (error) {
            console.log({ error });
            const latency = Date.now() - startApiReqTime;
            return {
                error: true,
                body: error.response?.data,
                statusCode: error.response?.status ?? HttpStatus.BAD_GATEWAY,
                latency: this.formatLatency(latency),
            };
        }
    }

    private async executeWithRetry<T>(baseConfig: AxiosRequestConfig, req: IApiRequest): Promise<IApiResponse<T>> {
        const maxRetries = req.retryCount;
        const shouldRetry = maxRetries > 0;
        let attempt = 0;
        do {
            const startApiReqTime = Date.now();
            try {
                const response = await firstValueFrom(
                    this.httpService.request<T>({
                        timeout: req.timeoutMs ?? 5000,
                        validateStatus: () => true,
                        headers: this.buildHeaders(req),
                        params: req.params,
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
            } catch (error) {
                if (!shouldRetry || attempt >= maxRetries) {
                    const latency = Date.now() - startApiReqTime;
                    return {
                        error: true,
                        body: error.response?.data,
                        statusCode: error.response?.status ?? HttpStatus.BAD_GATEWAY,
                        latency: this.formatLatency(latency),
                    };
                }
                attempt++;
                const backoff = BASE_RETRY_DELAY_MS * Math.pow(2, attempt - 1);
                this.logger.warn(`Retry ${attempt}/${maxRetries} for ${baseConfig.method} ${baseConfig.url} in ${backoff}ms`);
                await this.sleep(backoff);
            }
        } while (shouldRetry);
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

    private sleep(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
