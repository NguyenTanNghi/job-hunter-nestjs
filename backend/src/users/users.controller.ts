import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { ResponseMessage, User, Public } from 'src/auth/decorator/customize';
import { IUser } from 'src/users/users.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @ResponseMessage('Tạo mới người dùng')
  create(@Body() createUserDto: CreateUserDto, @User() user: IUser) {
    return this.usersService.create(createUserDto, user);
  }

  @Get()
  @ResponseMessage('Fetch user with paginate')
  findAll(
    @Query("current") currentPage: string,
    @Query("pageSize") limitPage: string,
    @Query() query: string
  ) {
    return this.usersService.findAll(+currentPage, +limitPage, query);
  }

  @Public()
  @Get(':id')
  @ResponseMessage('Lấy thông tin người dùng theo id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch()
  @ResponseMessage('Cập nhật người dùng')
  update(@Body() updateUserDto: UpdateUserDto, @User() user: IUser) {
    return this.usersService.update(updateUserDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Xóa người dùng')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.usersService.remove(id, user);
  }
}
