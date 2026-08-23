import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PermissionsService } from 'src/permissions/permissions.service';
import { CreatePermissionDto } from 'src/permissions/dto/create-permission.dto';
import { UpdatePermissionDto } from 'src/permissions/dto/update-permission.dto';
import { ResponseMessage, User } from 'src/auth/decorator/customize';
import { IUser } from 'src/users/users.interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('permissions')
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @ResponseMessage('Tạo mới Permission thành công')
  create(
    @Body() createPermissionDto: CreatePermissionDto,
    @User() user: IUser,
  ) {
    return this.permissionsService.create(createPermissionDto, user);
  }

  @Get()
  @ResponseMessage('Lấy danh sách Permission phân trang thành công')
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limitPage: string,
    @Query() query: string,
  ) {
    return this.permissionsService.findAll(+currentPage, +limitPage, query);
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin Permission theo id thành công')
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật Permission thành công')
  update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
    @User() user: IUser,
  ) {
    return this.permissionsService.update(id, updatePermissionDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Xóa Permission thành công')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.permissionsService.remove(id, user);
  }
}
