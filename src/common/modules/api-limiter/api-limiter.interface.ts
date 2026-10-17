export interface IRequestLimiterOptions {
    lockInterval: number;
    allowedAttempts: number;
    lockedFor: number;
}

export interface IAddLimiterOptions extends IRequestLimiterOptions {
    key: string;
    ip: string;
}
