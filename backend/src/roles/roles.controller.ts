import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RolesService } from 'src/roles/roles.service';
import { CreateRoleDto } from 'src/roles/dto/create-role.dto';
import { UpdateRoleDto } from 'src/roles/dto/update-role.dto';
import { ResponseMessage, User } from 'src/auth/decorator/customize';
import { IUser } from 'src/users/users.interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ResponseMessage('Tạo mới Role thành công')
  create(@Body() createRoleDto: CreateRoleDto, @User() user: IUser) {
    return this.rolesService.create(createRoleDto, user);
  }

  @Get()
  @ResponseMessage('Lấy danh sách Role phân trang thành công')
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limitPage: string,
    @Query() query: string,
  ) {
    return this.rolesService.findAll(+currentPage, +limitPage, query);
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin Role theo id thành công')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật Role thành công')
  update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @User() user: IUser,
  ) {
    return this.rolesService.update(id, updateRoleDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Xóa Role thành công')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.rolesService.remove(id, user);
  }
}
