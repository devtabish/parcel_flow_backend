import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsExceptionFilter } from 'src/common/decorators/ws-exception-filter.decorator';
import { WsValidationPipe } from 'src/common/decorators/ws-validation-pipe.decorator';

@WsValidationPipe()
@WsExceptionFilter()
@WebSocketGateway()
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
    private readonly logger = new Logger(SocketGateway.name);
    private id;

    handleConnection(socket: Socket): void {
        this.logger.log(`✅ socket connected: ${socket.id}`);
        socket.emit('connected', { message: 'Connection established successfully' });
    }

    handleDisconnect(socket: Socket): void {
        this.logger.log(`❌ socket disconnected: ${socket.id}`);
    }
}
