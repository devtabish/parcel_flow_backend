import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { IApiResponse } from 'src/common/interfaces/response.interface';
import { UpdateUserProfileDto } from '../dto/update-customer-profile.dto';
import { IUpdateCustomer } from '../interfaces/update-customer.interface';
import { UserRepository } from '../repositories/customer.repository';
import { UpdatePasswordDto } from '../dto/update-password.dto';
import { CustomerDocument } from '../schemas/customer.schema';

@Injectable()
export class UserService {
    constructor(private readonly repository: UserRepository) {}

    async getProfile(_id: string): Promise<IApiResponse> {
        try {
            const user = await this.repository.findById(_id);
            if (!user) throw new NotFoundException('User Not Found');
            return { message: 'OK', data: user };
        } catch (error) {
            throw error;
        }
    }

    async updateProfile(id: string, payload: UpdateUserProfileDto): Promise<IApiResponse> {
        const { firstName, lastName, email } = payload;
        const updatedObj = {};
        if (firstName) updatedObj['firstName'] = firstName;
        if (lastName) updatedObj['lastName'] = lastName;
        if (email) updatedObj['email'] = email;
        const user = await this.repository.findByIdAndUpdate(id, updatedObj);
        if (!user) throw new NotFoundException('User Not Found');
        return { message: 'Updated successfully', data: user };
    }

    async updateUserPassword(userId: string, payload: UpdatePasswordDto): Promise<IApiResponse> {
        const user = await this.repository.findOne({ _id: userId }, { password: 1 });
        if (!user) throw new NotFoundException('user not found');
        console.log(user.password, payload.oldPassword);
        if (user.password !== payload.oldPassword) throw new UnauthorizedException('current passowrd is incorrect');
        if (payload.oldPassword === payload.newPassword) throw new ConflictException('cannot use old password as a new password');
        await this.repository.findByIdAndUpdate(userId, { password: payload.newPassword }, { new: true });
        return {
            message: 'updated successfully',
        };
    }

    async upsertUser(params: IUpdateCustomer): Promise<CustomerDocument> {
        const result = await this.repository.findOneAndUpdate(
            {
                email: params.email,
                provider: params.provider,
            },
            {
                $set: {
                    email: params.email,
                    displayName: params.displayName,
                    avatarUrl: params.avatarUrl,
                    provider: params.provider,
                    accountId: params.accountId,
                    accessToken: params.accessToken,
                    refreshToken: params.refreshToken,
                    expiresAt: params.expiresAt,
                    scopes: params.scopes,
                    token: params.token,
                },
            },
            {
                new: true,
                upsert: true,
            },
        );

        return result;
    }
}
