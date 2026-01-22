import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends OmitType(CreateUserDto, ['password'] as const) { // Kế thừa từ CreateUserDto, loại bỏ trường password
    id: string;
}
