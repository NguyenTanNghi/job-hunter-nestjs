import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Company, CompanyDocument } from './schemas/company.schema';
import { InjectModel } from '@nestjs/mongoose/dist/common/mongoose.decorators';
import mongoose from 'mongoose';

@Injectable()
export class CompaniesService {
    constructor(
        @InjectModel(Company.name) // InjectModel để tiêm CompanyModel vào service
        private companyModel: SoftDeleteModel<CompanyDocument>// Cấu hình SoftDeleteModel để sử dụng soft delete
    ) { }
    async create(createCompanyDto: CreateCompanyDto) {
        return await this.companyModel.create({ ...createCompanyDto });
    }

    async findAll() {
        return await this.companyModel.find();
    }

    async findOne(id: number) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return "ID không hợp lệ";
        }
        const company = await this.companyModel.findOne({ _id: id });
        return company;
    }

    async update(id: number, updateCompanyDto: UpdateCompanyDto) {

    }

    async remove(id: number) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return "ID không hợp lệ";
        }
        const company = await this.companyModel.softDelete({ _id: id }); // Sử dụng soft delete để xóa người dùng
        return company;
    }
}
