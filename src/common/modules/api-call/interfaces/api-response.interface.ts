export interface IApiResponse<T> {
    error: boolean;
    body: T;
    statusCode: number;
    latency: string;
}
