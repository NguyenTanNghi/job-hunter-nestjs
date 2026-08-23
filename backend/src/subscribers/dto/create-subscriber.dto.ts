import { IsArray, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateSubscriberDto {
  @IsNotEmpty({ message: 'Name không được để trống' })
  name: string;

  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @IsArray({ message: 'Skills phải là mảng string' })
  @IsString({ each: true, message: 'Mỗi skill phải là chuỗi' })
  @IsNotEmpty({ message: 'Skills không được để trống' })
  skills: string[];
}
