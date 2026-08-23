import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SubscribersService } from 'src/subscribers/subscribers.service';
import { CreateSubscriberDto } from 'src/subscribers/dto/create-subscriber.dto';
import { UpdateSubscriberDto } from 'src/subscribers/dto/update-subscriber.dto';
import { ResponseMessage, User, SkipCheckPermission } from 'src/auth/decorator/customize';
import { IUser } from 'src/users/users.interface';

@Controller('subscribers')
export class SubscribersController {
  constructor(private readonly subscribersService: SubscribersService) {}

  @Post()
  @ResponseMessage('Tạo mới subscriber')
  create(@Body() createSubscriberDto: CreateSubscriberDto, @User() user: IUser) {
    return this.subscribersService.create(createSubscriberDto, user);
  }

  @Post('skills')
  @ResponseMessage("Lấy thông tin subscribe skills của user")
  @SkipCheckPermission()
  getUserSkills(@User() user: IUser) {
    return this.subscribersService.getUserSkills(user);
  }

  @Get()
  @ResponseMessage('Lấy danh sách subscriber với phân trang')
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limitPage: string,
    @Query() qs: string,
  ) {
    return this.subscribersService.findAll(+currentPage, +limitPage, qs);
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin subscriber theo id')
  findOne(@Param('id') id: string) {
    return this.subscribersService.findOne(id);
  }

  @Patch()
  @ResponseMessage('Cập nhật thông tin subscriber')
  @SkipCheckPermission()
  update(@Body() updateSubscriberDto: UpdateSubscriberDto, @User() user: IUser) {
    return this.subscribersService.update(updateSubscriberDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Xóa subscriber')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.subscribersService.remove(id, user);
  }
}
