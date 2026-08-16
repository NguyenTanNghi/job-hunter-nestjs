import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from './users.interface';
import aqp from 'api-query-params';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>) { }

  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  }

  async create(createUserDto: CreateUserDto, user: IUser) {
    const { email, password, name, age, gender, address, role, company } = createUserDto;

    const isExist = await this.userModel.findOne({ email });
    if (isExist) {
      throw new BadRequestException(`Email: ${email} đã tồn tại trên hệ thống. Vui lòng sử dụng email khác.`);
    }

    const hashedPassword = this.getHashPassword(password);
    const newUser = await this.userModel.create({
      email,
      password: hashedPassword,
      name,
      age,
      gender,
      address,
      role,
      company,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    });

    return {
      _id: newUser._id,
      createdAt: newUser.createdAt
    };
  }

  async register(registerUserDto: RegisterUserDto) {
    const { email, password, name, age, gender, address } = registerUserDto;

    const isExist = await this.userModel.findOne({ email });
    if (isExist) {
      throw new BadRequestException(`Email: ${email} đã tồn tại trên hệ thống. Vui lòng sử dụng email khác.`);
    }

    const hashedPassword = this.getHashPassword(password);
    const newRegister = await this.userModel.create({
      email,
      password: hashedPassword,
      name,
      age,
      gender,
      address,
      role: 'USER'
    });

    return {
      _id: newRegister._id,
      createdAt: newRegister.createdAt
    };
  }

  async findAll(currentPage: number, limitPage: number, query: string) {
    const { filter, sort, population } = aqp(query);
    delete filter.page;
    delete filter.limit;

    let offset = (currentPage - 1) * (limitPage);
    let defaultLimit = limitPage ? limitPage : 10;

    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.userModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .select('-password')
      .populate(population)
      .exec();

    return {
      meta: {
        current: currentPage,
        pageSize: defaultLimit,
        pages: totalPages,
        total: totalItems
      },
      result
    };
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException("ID không hợp lệ");
    }
    const user = await this.userModel.findOne({ _id: id }).select('-password');
    return user;
  }

  async findOneByUsername(username: string) {
    const user = await this.userModel.findOne({ email: username });
    return user;
  }

  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }

  async update(updateUserDto: UpdateUserDto, user: IUser) {
    const { _id } = updateUserDto;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw new BadRequestException("ID không hợp lệ");
    }
    const updated = await this.userModel.updateOne(
      { _id },
      {
        ...updateUserDto,
        updatedBy: {
          _id: user._id,
          email: user.email
        }
      }
    );
    return updated;
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException("ID không hợp lệ");
    }
    await this.userModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      }
    );
    return await this.userModel.softDelete({ _id: id });
  }

  updateUserToken = async (refreshToken: string, _id: string) => {
    return await this.userModel.updateOne(
      { _id },
      {
        refreshToken
      }
    );
  }

  findUserByToken = async (refreshToken: string) => {
    return await this.userModel.findOne({ refreshToken });
  }
}
