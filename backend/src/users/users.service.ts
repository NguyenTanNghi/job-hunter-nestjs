import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { genSaltSync, hashSync } from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) { } // Inject mô hình User vào dịch vụ người dùng

    getHashPassword = (password: string) => {
        const salt = genSaltSync(10);
        const hash = hashSync(password, salt);
        return hash;
    }

    async create(createUserDto: CreateUserDto) {
        const { email, password, name, address } = createUserDto;
        const hashedPassword = this.getHashPassword(password);
        const user = await this.userModel.create({ email, password: hashedPassword, name, address });
        return user;
    }

    async findAll() {
        const users = await this.userModel.find();
        return users;
    }

    async findOne(id: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return "ID không hợp lệ";
        }
        const user = await this.userModel.findOne({ _id: id });
        return user;
    }

    async update(updateUserDto: UpdateUserDto) {
        const { id } = updateUserDto;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return "ID không hợp lệ";
        }
        const user = await this.userModel.updateOne({ _id: id }, { $set: { ...updateUserDto } });
        return user;
    }

    async remove(id: string) {
        await this.userModel.findByIdAndDelete(id);
        return { message: 'Xóa user thành công' };
    }
}
