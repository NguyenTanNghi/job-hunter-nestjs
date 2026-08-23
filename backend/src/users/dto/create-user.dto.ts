import { IsEmail, IsMongoId, IsNotEmpty, IsNotEmptyObject, IsObject, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import mongoose from "mongoose";

class Company {
  @IsNotEmpty({ message: 'ID Company không được để trống' })
  _id: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: 'Tên công ty không được để trống' })
  name: string;
}

export class CreateUserDto {
  @IsNotEmpty({ message: 'Tên không được để trống' })
  name: string;

  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  password: string;

  @IsNotEmpty({ message: 'Tuổi không được để trống' })
  age: number;

  @IsNotEmpty({ message: 'Giới tính không được để trống' })
  gender: string;

  @IsNotEmpty({ message: 'Địa chỉ không được để trống' })
  address: string;

  @IsNotEmpty({ message: 'Role không được để trống' })
  @IsMongoId({ message: "Role có định dạng là mongo Id" })
  role: string;

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => Company)
  company: Company;
}

export class RegisterUserDto {
  @IsNotEmpty({ message: 'Tên không được để trống' })
  name: string;

  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  password: string;

  @IsNotEmpty({ message: 'Tuổi không được để trống' })
  age: number;

  @IsNotEmpty({ message: 'Giới tính không được để trống' })
  gender: string;

  @IsNotEmpty({ message: 'Địa chỉ không được để trống' })
  address: string;
}

export class UserLoginDto {
  @IsString()
  @IsNotEmpty({ message: 'username không được để trống' })
  @ApiProperty({ example: 'admin@gmail.com', description: 'Tên đăng nhập' })
  readonly username: string;

  @IsString()
  @IsNotEmpty({ message: 'password không được để trống' })
  @ApiProperty({ example: '123456', description: 'Mật khẩu' })
  readonly password: string;
}
