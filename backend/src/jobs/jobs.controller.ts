import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { ResponseMessage, User } from 'src/auth/decorator/customize';
import { IUser } from 'src/users/users.interface';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @ResponseMessage('Tạo mới Job')
  create(@Body() createJobDto: CreateJobDto, @User() user: IUser) {
    return this.jobsService.create(createJobDto, user);
  }

  @Get()
  @ResponseMessage('Lấy danh sách Job với phân trang')
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limitPage: string,
    @Query() query: string,
  ) {
    return this.jobsService.findAll(+currentPage, +limitPage, query);
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin Job theo id')
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật Job')
  update(
    @Param('id') id: string,
    @Body() updateJobDto: UpdateJobDto,
    @User() user: IUser,
  ) {
    return this.jobsService.update(id, updateJobDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Xóa Job')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.jobsService.remove(id, user);
  }
}
