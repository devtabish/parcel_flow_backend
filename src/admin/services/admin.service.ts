import { Injectable, UnprocessableEntityException, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IApiResponse } from 'src/common/interfaces/response.interface';
import { ERoles } from 'src/common/enums/roles.enum';
import { AdminRepository } from '../repositories/admin.repository';
import { AdminDocument } from '../schemas/admin.schema';
import { UpdateAdminProfileDto } from '../dto/update-admin-profile.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { GetAdminProfileDto } from '../dto/get-admin-profile.dto';
import { Model, Types } from 'mongoose';
import { CreateRiderDto } from '../dto/create-rider.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/user/schemas/user.schema';

@Injectable()
export class AdminService {
    constructor(
        private readonly repository: AdminRepository,
        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>,
    ) {}

    async createAdministrator(email: string, password: string): Promise<AdminDocument | null> {
        try {
            const count = await this.repository.countDocuments({ userType: 'administrator', superAdmin: true });
            if (count > 1) throw new UnprocessableEntityException('Super Administrator Already Exists');

            return await this.repository.save({
                email: email,
                userType: ERoles.ADMINISTRATOR,
                password,
                superAdmin: true,
            });
        } catch (error) {
            throw error;
        }
    }

    async createRider(payload: CreateRiderDto): Promise<IApiResponse> {
        const { email, password, userName } = payload;
        const normalizedEmail = email.trim().toLowerCase();
        const existingUser = await this.userModel.findOne({ email: normalizedEmail }).exec();
        if (existingUser) throw new ConflictException('Email already registered');
        const rider = await this.userModel.create({
            email: normalizedEmail,
            userName: userName.trim(),
            password,
            userType: ERoles.RIDER,
        });
        const riderData = rider.toObject();
        delete riderData.password;

        return {
            message: 'Rider created successfully',
            data: riderData,
        };
    }

    async getProfile(payload: GetAdminProfileDto): Promise<IApiResponse> {
        try {
            const { adminId } = payload;
            const admin = await this.repository.findOne({ _id: new Types.ObjectId(adminId) });
            if (!admin) throw new NotFoundException('Admin Not Found');
            return { message: 'OK', data: admin };
        } catch (error) {
            throw error;
        }
    }

    async updateProfile(adminId: string, payload: UpdateAdminProfileDto): Promise<IApiResponse> {
        const { name, phoneNo, email, address } = payload;
        const updatedObj = {};
        if (name) updatedObj['name'] = name;
        if (phoneNo) updatedObj['phoneNo'] = phoneNo;
        if (email) updatedObj['email'] = email;
        if (address) updatedObj['address'] = address;
        const admin = await this.repository.findOne({ _id: adminId });
        if (!admin) throw new NotFoundException('admin not found');
        await this.repository.findOneAndUpdate({ _id: adminId }, { $set: updatedObj }, { new: true });
        return {
            message: 'updated successfully',
        };
    }

    async changePassword(userId: string | null, payload: ChangePasswordDto): Promise<IApiResponse> {
        try {
            const { oldPassword, newPassword } = payload;
            const admin = await this.repository.findOneAuth({ _id: userId });
            if (oldPassword !== admin.password) throw new BadRequestException('Incorrect Old Password');
            // const isMatch = await bcrypt.compare(oldPassword, admin.password);
            // if (!isMatch) throw new UnprocessableEntityException('Incorrect Old Password');

            await this.repository.findByIdAndUpdate(admin._id.toString(), { password: newPassword });
            return { message: 'Password Changed Successfully' };
        } catch (error) {
            throw error;
        }
    }
}
