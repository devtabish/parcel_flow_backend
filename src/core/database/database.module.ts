import { Module, OnModuleInit } from '@nestjs/common';
import { InjectConnection, MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Connection, ConnectionStates } from 'mongoose';
import { DatabaseService } from './database.service';

@Module({
    imports: [
        MongooseModule.forRootAsync({
            inject: [ConfigService],

            useFactory: (configService: ConfigService) => ({
                // lazyConnection: true,
                uri: configService.getOrThrow<string>('MONGODB_URI'),
                connectionFactory: (connection: Connection): Connection => {
                    connection.on('open', () => {
                        console.log('Database Connected');
                    });

                    connection.on('close', () => {
                        console.warn('Database Disconnected');
                    });

                    connection.on('error', (err) => {
                        console.error('Database Error:', err?.message);
                    });
                    return connection;
                },
            }),
        }),
    ],
    providers: [DatabaseService],
    exports: [DatabaseService],
})
export class DatabaseModule implements OnModuleInit {
    constructor(@InjectConnection() private readonly connection: Connection) {}

    onModuleInit(): void {
        this.verifyConnection();
    }

    private verifyConnection(): void {
        if (this.connection.readyState === (1 as ConnectionStates)) console.log('✅ MongoDB is connected');
        else console.warn(`⚠️ MongoDB is not connected (state: ${this.connection.readyState})`);
    }
}
