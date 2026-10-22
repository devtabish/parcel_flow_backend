import { Global, Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AdminModule } from '../admin/admin.module';
import { AdminAuthController } from './controllers/admin-auth.controller';
import { RedisAuthModule } from 'src/common/modules/redis-auth/redis-auth.module';
import { CustomerModule } from 'src/customer/customer.module';
import { CustomerAuthController } from './controllers/customer-auth.controller';
import { UserModule } from 'src/user/user.module';
import { RiderAuthController } from './controllers/rider-auth.controller';

@Global()
@Module({
    imports: [CustomerModule, AdminModule, RedisAuthModule, UserModule],
    controllers: [CustomerAuthController, AdminAuthController, RiderAuthController],
    providers: [AuthService],
    exports: [],
})
export class AuthModule {}
