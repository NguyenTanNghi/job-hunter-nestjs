import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ResumesService } from 'src/resumes/resumes.service';
import { CreateUserCvDto } from 'src/resumes/dto/create-resume.dto';
import { UpdateResumeDto } from 'src/resumes/dto/update-resume.dto';
import { ResponseMessage, User } from 'src/auth/decorator/customize';
import { IUser } from 'src/users/users.interface';

@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @Post()
  @ResponseMessage('Tạo mới Resume thành công')
  create(@Body() createUserCvDto: CreateUserCvDto, @User() user: IUser) {
    return this.resumesService.create(createUserCvDto, user);
  }

  @Get()
  @ResponseMessage('Lấy danh sách Resume phân trang thành công')
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limitPage: string,
    @Query() query: string,
  ) {
    return this.resumesService.findAll(+currentPage, +limitPage, query);
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin Resume theo id thành công')
  findOne(@Param('id') id: string) {
    return this.resumesService.findOne(id);
  }

  @Post('by-user')
  @ResponseMessage('Lấy danh sách Resume theo người dùng thành công')
  findByUser(@User() user: IUser) {
    return this.resumesService.findByUser(user);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật trạng thái Resume thành công')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @User() user: IUser,
  ) {
    return this.resumesService.update(id, status, user);
  }

  @Delete(':id')
  @ResponseMessage('Xóa Resume thành công')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.resumesService.remove(id, user);
  }
}
