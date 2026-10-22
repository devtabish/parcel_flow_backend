import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AdminService } from 'src/admin/services/admin.service';
import { ERoles } from 'src/common/enums/roles.enum';
import { IJwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { IApiResponse } from 'src/common/interfaces/response.interface';
import { RedisAuthService } from 'src/common/modules/redis-auth/redis-auth.service';
import { AdminRepositoryService } from 'src/admin/services/admin-repository.service';
import { AdminSignupDto } from 'src/admin/dto/admin-signup.dto';
import { AdminLoginDto } from 'src/admin/dto/admin-login.dto';
import { LoginCustomerDto } from '../dto/login-customer.dto';
import { CustomerRepositoryService } from 'src/customer/services/customer-repository.service';
import { RegisterCustomerDto } from '../dto/register-customer.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/user/schemas/user.schema';
import { Model } from 'mongoose';
import { LoginRiderDto } from '../dto/login-rider.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly redisAuthService: RedisAuthService,
        private readonly jwtService: JwtService,
        private readonly adminService: AdminService,
        private readonly adminRepositoryService: AdminRepositoryService,
        private readonly userRepositoryService: CustomerRepositoryService,
        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>,
    ) {}

    async registerSuperAdmin(payload: AdminSignupDto): Promise<IApiResponse> {
        try {
            const admin = await this.adminService.createAdministrator(payload.email, payload.password);
            const jwtPayload: IJwtPayload = {
                sub: admin._id.toString(),
                type: 'admin',
            };
            const token = await this.jwtService.signAsync(jwtPayload);
            await this.redisAuthService.setAdminAuth(admin._id.toString(), {
                _id: admin._id.toString(),
                email: admin.email,
                userType: ERoles.ADMINISTRATOR,
                password: admin.password,
                token,
            });
            const adminData = admin.toObject ? admin.toObject() : { ...admin };
            delete adminData.password;

            return { message: 'Logged In Successfully', data: { ...admin.toObject(), token } };
        } catch (error) {
            throw error;
        }
    }

    async adminLogin(payload: AdminLoginDto): Promise<IApiResponse> {
        const { email, password } = payload;
        const admin = await this.adminRepositoryService.findOneAuth({ email: email.toLowerCase() });
        if (!admin) throw new NotFoundException('admin not found, register first');
        if (password !== admin.password) throw new UnauthorizedException('Invalid credentials');
        const jwtPayload: IJwtPayload = {
            sub: admin._id.toString(),
            type: 'admin',
        };
        const token = await this.jwtService.signAsync(jwtPayload);
        await this.redisAuthService.setAdminAuth(admin._id.toString(), {
            _id: admin._id.toString(),
            email: admin.email,
            userType: ERoles.ADMINISTRATOR,
            password: admin.password,
            token,
        });
        const adminData = admin.toObject ? admin.toObject() : { ...admin };
        delete adminData.password;

        return { message: 'Logged In Successfully', data: { ...adminData, token } };
    }

    async logoutCustomer(userId: string): Promise<IApiResponse> {
        await this.redisAuthService.deleteAuth(userId);
        return { message: 'Logged Out Successfully' };
    }

    async logoutAdmin(userId: string): Promise<IApiResponse> {
        await this.redisAuthService.deleteAuth(userId);
        return { message: 'Logged Out Successfully' };
    }

    async registerCustomer(payload: RegisterCustomerDto): Promise<IApiResponse> {
        const { email, password, userName } = payload;
        const findUser = await this.userRepositoryService.findOne({ email });
        if (findUser) throw new BadRequestException('customer already registered, go for login');
        const user = await this.userRepositoryService.create({ email, password, userName, userType: ERoles.CUSTOMER });
        const userData = user.toObject ? user.toObject() : { ...user };
        delete userData.password;
        return {
            data: userData,
            message: 'user created successfully',
        };
    }

    async loginCustomer(payload: LoginCustomerDto): Promise<IApiResponse> {
        try {
            const { email, password } = payload;
            const user = await this.userRepositoryService.findOne({ email }, '+password', { lean: true });
            if (!user) throw new NotFoundException('user not found, register first');
            if (user.userType !== ERoles.CUSTOMER) throw new UnauthorizedException('Invalid credentials');
            if (password !== user.password) throw new UnauthorizedException('Invalid credentials');

            const jwtPayload: IJwtPayload = {
                sub: user._id.toString(),
                type: 'user',
            };
            const token = await this.jwtService.signAsync(jwtPayload);
            await this.redisAuthService.setUserAuth(user._id.toString(), {
                _id: user._id.toString(),
                email: user.email,
                userType: ERoles.CUSTOMER,
                token,
            });
            const userData = user.toObject ? user.toObject() : { ...user };
            delete userData.password;
            return {
                message: 'logged in successfully',
                data: { token, ...userData },
            };
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async loginRider(payload: LoginRiderDto): Promise<IApiResponse> {
        try {
            const { email, password } = payload;
            const user = await this.userModel.findOne({ email }, '+password', { lean: true });
            console.log(user, 'userrrrrrrrr');
            if (!user) throw new NotFoundException('user not found, register first');
            if (user.userType !== ERoles.RIDER) throw new UnauthorizedException('Invalid credentials');
            if (password !== user.password) throw new UnauthorizedException('Invalid credentials');

            const jwtPayload: IJwtPayload = {
                sub: user._id.toString(),
                type: 'user',
            };
            const token = await this.jwtService.signAsync(jwtPayload);
            await this.redisAuthService.setUserAuth(user._id.toString(), {
                _id: user._id.toString(),
                email: user.email,
                userType: ERoles.RIDER,
                token,
            });
            const userData = user.toObject ? user.toObject() : { ...user };
            delete userData.password;
            return {
                message: 'logged in successfully',
                data: { token, ...userData },
            };
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}

// async otpLoginUser(payload: OtpLoginUserDto): Promise<IApiResponse> {
//     const { email, otp } = payload;
//     const isValidOtp: boolean = await this.redisLoginOtpService.verifyLoginOtp({ email, otp });
//     if (!isValidOtp) throw new UnauthorizedException('Invalid OTP');
//     const userCheck = await this.userRepositoryService.findOne({ email: payload.email }, { provider: 1 });
//     if (userCheck && userCheck.provider !== ELoginProvider.OTP) throw new BadRequestException('User already exists');

//     const user = await this.userService.upsertUser({ email, provider: ELoginProvider.OTP });
//     const jwtPayload: IJwtPayload = {
//         sub: user._id.toString(),
//         type: 'user',
//     };
//     const token = await this.jwtService.signAsync(jwtPayload);
//     await this.redisAuthService.setUserAuth(user._id.toString(), {
//         _id: user._id.toString(),
//         email: user.email,
//         displayName: user.displayName,
//         userType: ERoles.USER,
//         provider: user.provider,
//         token,
//     });

//     return { message: 'Registered Successfully', data: { ...user.toObject(), token } };
// }
