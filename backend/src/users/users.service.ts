import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

@Injectable()
export class UsersService {
    //  constructor(@InjectModel(User.name) private userModel: Model<User>) { }// Sử dụng Model thông thường khi không có soft delete
    constructor(@InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>) { } // Sử dụng SoftDeleteModel thay vì Model để hỗ trợ soft delete

    // Hàm băm mật khẩu người dùng trước khi lưu vào cơ sở dữ liệu
    getHashPassword = (password: string) => {
        const salt = genSaltSync(10);
        const hash = hashSync(password, salt);
        return hash;
    }

    // Tạo người dùng mới
    async create(createUserDto: CreateUserDto) {
        const { email, password, name, address } = createUserDto;
        const hashedPassword = this.getHashPassword(password);
        const user = await this.userModel.create({ email, password: hashedPassword, name, address });
        return user;
    }

    // Lấy tất cả người dùng
    async findAll() {
        const users = await this.userModel.find();
        return users;
    }

    // Lấy một người dùng theo ID
    async findOne(id: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return "ID không hợp lệ";
        }
        const user = await this.userModel.findOne({ _id: id });
        return user;
    }

    // Lấy một người dùng theo tên đăng nhập (email)
    async findOneByUsername(username: string) {
        const user = await this.userModel.findOne({ email: username });
        return user;
    }

    // So sánh mật khẩu người dùng nhập với mật khẩu đã được băm trong cơ sở dữ liệu
    isValidPassword(password: string, hash: string) {
        return compareSync(password, hash);
    }

    // Cập nhật thông tin người dùng
    async update(updateUserDto: UpdateUserDto) {
        const { id } = updateUserDto;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return "ID không hợp lệ";
        }
        const user = await this.userModel.updateOne({ _id: id }, { ...updateUserDto });
        return user;
    }

    // Xóa người dùng
    async remove(id: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return "ID không hợp lệ";
        }
        const user = await this.userModel.softDelete({ _id: id }); // Sử dụng soft delete để xóa người dùng
        return user;
    }
}
