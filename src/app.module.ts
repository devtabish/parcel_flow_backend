import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RouteDuplicateDetector } from './common/services/route-duplicate-detector.service';
import { DiscoveryModule } from '@nestjs/core';
import { CoreModule } from './core/core.module';
import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';
import { CronModule } from './cron/cron.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { UploadModule } from './upload/upload.module';
import { JwtModule } from '@nestjs/jwt';
import { TaskTrackerModule } from './common/modules/task-tracker/task-tracker.module';
import { AddressBookModule } from './address-book/address-book.module';
import { ContactModule } from './contact/contact.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ParcelManagementModule } from './parcel-management/parcel-management.module';
import { ParcelManagementModule } from './parcel-management/parcel-management.module';

@Module({
    imports: [
        DiscoveryModule,
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'public'),
        }),

        // tumhare baqi modules...

        ScheduleModule.forRoot(),
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: `.env.${process.env.NODE_ENV ?? 'dev'}`,
            ignoreEnvFile: false,
        }),
        JwtModule.registerAsync({
            global: true,
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.getOrThrow('JWT_SECRET'),
            }),
        }),
        AuthModule,
        AdminModule,
        CoreModule,
        // TempBlockIpModule,
        UserModule,
        UploadModule,
        CronModule,
        TaskTrackerModule,
        AddressBookModule,
        ContactModule,
        CloudinaryModule,
        ParcelManagementModule,
    ],
    controllers: [AppController],
    providers: [
        ResponseInterceptor,
        AppService,
        RouteDuplicateDetector,
        // {
        //     provide: APP_GUARD,
        //     useClass: TempBlockIpGuard,
        // },
    ],
})
export class AppModule {}
