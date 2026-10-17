import { Global, Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AdminModule } from '../admin/admin.module';
import { UserModule } from 'src/user/user.module';
import { UserAuthController } from './controllers/user-auth.controller';
import { AdminAuthController } from './controllers/admin-auth.controller';
import { RedisAuthModule } from 'src/common/modules/redis-auth/redis-auth.module';

@Global()
@Module({
    imports: [UserModule, AdminModule, RedisAuthModule],
    controllers: [UserAuthController, AdminAuthController],
    providers: [AuthService],
    exports: [],
})
export class AuthModule {}
