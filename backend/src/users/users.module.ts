import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],// đăng ký mô hình User trong module người dùng
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService] // xuất dịch vụ người dùng để các module khác có thể sử dụng
})
export class UsersModule { }
