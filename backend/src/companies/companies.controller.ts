import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Company } from './schemas/company.schema';
import { IUser } from 'src/users/users.interface';
import { User } from 'src/auth/decorator/customize';

@Controller('companies')
export class CompaniesController {
    constructor(private readonly companiesService: CompaniesService) { }

    @Post()
    create(@Body() createCompanyDto: CreateCompanyDto, @User() user: IUser) { // @User() user: IUser lấy thông tin user đã xác thực
        // xài @User() user: IUser thay vì (@Request() req => req.user) vì đã tạo decorator User
        // return user;
        return this.companiesService.create(createCompanyDto, user);
    }

    @Get()
    findAll() {
        return this.companiesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.companiesService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
        return this.companiesService.update(id, updateCompanyDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.companiesService.remove(id);
    }
}
