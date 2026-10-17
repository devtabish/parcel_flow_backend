import { EResponseType } from '../enums/api-response.enum';

export interface IApiRequest<TPayload = unknown> {
    uri: string;
    token?: string;
    payload?: TPayload;
    params?: Record<string, unknown>;
    headers?: Record<string, string>;
    timeoutMs?: number;
    retryCount?: number;
    responseType?: EResponseType;
}
