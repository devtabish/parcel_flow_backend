import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RedisCacheService } from 'src/common/modules/redis-cache/redis-cache.service';
import { CustomerDocument } from 'src/user/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { ISetAdminAuth, ISetUserAuth } from './interface/set-auth.interface';
import { AdminDocument } from 'src/admin/schemas/admin.schema';
import { IJwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { IUpdateAuth } from './interface/update-Auth.interface';

@Injectable()
export class RedisAuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly redisCacheService: RedisCacheService,
    ) {}

    async setUserAuth(userId: string, data: ISetUserAuth): Promise<void> {
        const newData = {
            _id: data._id,
            email: data.email,
            userType: data.userType,
            token: data.token,
        };
        await this.redisCacheService.setHash('auth', userId, newData);
    }

    async setAdminAuth(userId: string, data: ISetAdminAuth): Promise<void> {
        const newData = {
            _id: data._id,
            email: data.email,
            password: data.password,
            userType: data.userType,
            token: data.token,
        };
        await this.redisCacheService.setHash('auth', userId, newData);
    }

    async validateUserAuth(token: string): Promise<CustomerDocument> {
        try {
            const jwtPayload: IJwtPayload = await this.jwtService.verifyAsync(token);
            const user = await this.redisCacheService.getHash<CustomerDocument>('auth', jwtPayload.sub);
            if (!user || user?.token !== token) throw new UnauthorizedException('Invalid Token');

            return user;
        } catch (error) {
            console.log('Validate User auth Error :', error);
            if (error?.name === 'JsonWebTokenError') throw new UnauthorizedException('Invalid Token');

            throw new UnauthorizedException();
        }
    }

    async validateAdminAuth(token: string): Promise<AdminDocument> {
        try {
            const jwtPayload: IJwtPayload = await this.jwtService.verifyAsync(token);
            const admin = await this.redisCacheService.getHash<AdminDocument>('auth', jwtPayload.sub);
            if (!admin || admin.token !== token) throw new UnauthorizedException('Invalid Token');

            return admin;
        } catch (error) {
            console.log('Validate Admin auth Error :', error);
            if (error?.name === 'JsonWebTokenError') throw new UnauthorizedException('Invalid Token');

            throw error;
        }
    }

    async updateAuth(userId: string, data: IUpdateAuth): Promise<void> {
        const user = await this.redisCacheService.getHash<IUpdateAuth>('auth', userId);
        const updated = { ...(user || {}), ...data };
        await this.redisCacheService.setHash('auth', userId, updated);
    }

    async deleteAuth(userId: string): Promise<void> {
        await this.redisCacheService.deleteHash('auth', userId);
    }
}
