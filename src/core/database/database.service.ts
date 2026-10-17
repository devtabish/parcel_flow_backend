import { Injectable, Logger, OnApplicationShutdown } from '@nestjs/common';
import mongoose, { ConnectionStates } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';

@Injectable()
export class DatabaseService implements OnApplicationShutdown {
    private readonly logger = new Logger(DatabaseService.name);
    constructor(@InjectConnection() private readonly connection: mongoose.Connection) {}

    isHealthy(): boolean {
        return this.connection.readyState === (1 as ConnectionStates);
    }

    async ping(): Promise<boolean> {
        try {
            const databaseConnection = this.connection.db;
            if (!databaseConnection) return false;
            await databaseConnection.admin().ping();
            return true;
        } catch {
            return false;
        }
    }

    async onApplicationShutdown(): Promise<void> {
        await this.gracefulShutdown();
    }

    async gracefulShutdown(): Promise<void> {
        try {
            if (this.connection.readyState === (1 as ConnectionStates)) {
                await this.connection.close();
                console.log('✅ MongoDB connection closed');
            }
            console.log('✅ Database Disconnected Gracefully');
        } catch (error) {
            console.error('❌ Error during database graceful shutdown:', error);
        }
    }
}
