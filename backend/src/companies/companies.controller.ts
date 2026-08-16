import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { IUser } from 'src/users/users.interface';
import { ResponseMessage, User } from 'src/auth/decorator/customize';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) { }

  @Post()
  @ResponseMessage('Tạo mới công ty')
  create(@Body() createCompanyDto: CreateCompanyDto, @User() user: IUser) {
    return this.companiesService. create(createCompanyDto, user);
  }

  @Get()
  @ResponseMessage('Lấy danh sách công ty thành công')
  findAll(
    @Query("current") currentPage: string,
    @Query("pageSize") limitPage: string,
    @Query() query: string
  ) {
    return this.companiesService.findAll(+currentPage, +limitPage, query);
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin công ty theo id')
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật công ty')
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto, @User() user: IUser) {
    return this.companiesService.update(id, updateCompanyDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Xóa công ty')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.companiesService.remove(id, user);
  }
}
