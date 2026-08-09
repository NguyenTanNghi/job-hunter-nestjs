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
  constructor(@InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>) { }

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

  async findOneByUsername(username: string) {
    const user = await this.userModel.findOne({ email: username });
    return user;
  }

  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }

  async update(updateUserDto: UpdateUserDto) {
    const { id } = updateUserDto;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return "ID không hợp lệ";
    }
    const user = await this.userModel.updateOne({ _id: id }, { ...updateUserDto });
    return user;
  }

  async remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return "ID không hợp lệ";
    }
    const user = await this.userModel.softDelete({ _id: id });
    return user;
  }
}
