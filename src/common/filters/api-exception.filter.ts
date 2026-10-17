import { Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { FastifyReply } from 'fastify';
import { IApiResponse } from '../interfaces/response.interface';
import { Socket } from 'socket.io';

@Catch()
export class ApiExceptionFilter extends BaseWsExceptionFilter {
    private readonly logger = new Logger(ApiExceptionFilter.name);

    catch(exception: HttpException | WsException, host: ArgumentsHost): void {
        // this.logger.error(exception.stack);
        const ctxType = host.getType();

        if (ctxType === 'http') {
            const ctx = host.switchToHttp();
            const res = ctx.getResponse<FastifyReply>();

            let status = HttpStatus.INTERNAL_SERVER_ERROR;
            let message = 'Something went wrong';

            if (exception instanceof HttpException) {
                const response = exception.getResponse() as IApiResponse;
                status = exception.getStatus();
                message = response?.message || exception.message;
            }
            if (message == 'Something went wrong') this.logger.error(exception.stack);
            if (Array.isArray(message)) message = message[message.length - 1];

            const errorResponse: IApiResponse = { success: false, message };
            res.status(status).send(errorResponse);
            return;
        }
        if (ctxType === 'ws') {
            let message = 'Something went wrong';
            if (exception instanceof WsException) message = exception.message;
            else if (exception instanceof HttpException) {
                const response = exception.getResponse() as IApiResponse;
                message = response?.message || exception.message;
            }
            if (message == 'Something went wrong') this.logger.error(exception.stack);
            if (Array.isArray(message)) message = message[message.length - 1];

            const ctx = host.switchToWs();
            const socket = ctx.getClient();
            const pattern = ctx.getPattern();
            (socket as Socket).emit('exception', { success: false, event: pattern, message });
        }
    }
}
