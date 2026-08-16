import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Company, CompanyDocument } from './schemas/company.schema';
import { InjectModel } from '@nestjs/mongoose/dist/common/mongoose.decorators';
import mongoose from 'mongoose';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name)
    private companyModel: SoftDeleteModel<CompanyDocument>
  ) { }
  async create(createCompanyDto: CreateCompanyDto, user: IUser) {
    return await this.companyModel.create({
      ...createCompanyDto,
      createdBy: {
        _id: new mongoose.Types.ObjectId(user._id),
        email: user.email,
      },
    });
  }

  async findAll(currentPage: number, limitPage: number, query: string) {
    const { filter, sort, population } = aqp(query);
    delete filter.current;
    delete filter.pageSize;
    let offset = (currentPage - 1) * (limitPage);
    let defaultLimit = limitPage ? limitPage : 10;
    const totalItems = (await this.companyModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.companyModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .exec();

    return {
      meta: {
        current: currentPage,
        pageSize: defaultLimit,
        pages: totalPages,
        total: totalItems
      },
      result
    }
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return "ID không hợp lệ";
    }
    const company = await this.companyModel.findOne({ _id: id });
    return company;
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return "ID không hợp lệ";
    }
    const company = await this.companyModel.updateOne(
      { _id: id },
      {
        ...updateCompanyDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return company;
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return "ID không hợp lệ";
    }
    await this.companyModel.updateOne({ _id: id }, {
      deletedBy: {
        _id: user._id,
        email: user.email,
      },
    });

    const company = await this.companyModel.softDelete({ _id: id });
    return company;
  }
}
