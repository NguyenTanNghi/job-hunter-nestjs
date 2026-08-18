import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Company, CompanyDocument } from 'src/companies/schemas/company.schema';
import { Job, JobDocument } from 'src/jobs/schemas/job.schema';
import { INIT_COMPANIES, INIT_JOBS_DATA } from './sample';
import mongoose from 'mongoose';

import * as crypto from 'crypto';

@Injectable()
export class DatabasesService implements OnModuleInit {
  private readonly logger = new Logger(DatabasesService.name);

  constructor(
    @InjectModel(Company.name)
    private companyModel: SoftDeleteModel<CompanyDocument>,
    @InjectModel(Job.name)
    private jobModel: SoftDeleteModel<JobDocument>,
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    const initPassword = this.configService.get<string>('INIT_DATA_PASSWORD');

    if (!initPassword) {
      this.logger.warn('>>> SKIP SEED DATA: Biến môi trường INIT_DATA_PASSWORD chưa được cấu hình.');
      return;
    }

    const inputHash = crypto.createHash('sha256').update(initPassword).digest('hex');
    const EXPECTED_HASH = 'eee120347a7ede9a4ec366d06006556052b4c210e08a90b6cb2e306848ca70ff';

    if (inputHash !== EXPECTED_HASH) {
      this.logger.warn('>>> SKIP SEED DATA: Mật khẩu INIT_DATA_PASSWORD trong .env không đúng.');
      return;
    }

    // 2. Kiểm tra nếu CSDL đã có dữ liệu Company hoặc Job thì không seed lại
    const countCompany = await this.companyModel.countDocuments({});
    const countJob = await this.jobModel.countDocuments({});

    if (countCompany > 0 || countJob > 0) {
      this.logger.log(`>>> SKIP SEED DATA: CSDL đã có sẵn dữ liệu (${countCompany} công ty, ${countJob} jobs). Bỏ qua seed.`);
      return;
    }

    this.logger.log('>>> BẮT ĐẦU SEED DỮ LIỆU MẪU CHO COMPANY VÀ JOB...');

    const defaultAdminUser = {
      _id: new mongoose.Types.ObjectId('647b51974d59e754db118e95'),
      email: 'admin@gmail.com',
    };

    // 3. Khởi tạo dữ liệu Company
    const createdCompanies = [];
    for (const comp of INIT_COMPANIES) {
      const newComp = await this.companyModel.create({
        ...comp,
        createdBy: defaultAdminUser,
      });
      createdCompanies.push(newComp);
    }
    this.logger.log(`>>> Đã khởi tạo thành công ${createdCompanies.length} Công ty mẫu!`);

    // 4. Khởi tạo dữ liệu Job tương ứng
    let jobCount = 0;
    for (const jobData of INIT_JOBS_DATA) {
      const company = createdCompanies[jobData.companyIndex];
      if (company) {
        await this.jobModel.create({
          name: jobData.name,
          skills: jobData.skills,
          company: {
            _id: company._id,
            name: company.name,
            logo: company.logo,
          },
          location: jobData.location,
          salary: jobData.salary,
          quantity: jobData.quantity,
          level: jobData.level,
          description: jobData.description,
          startDate: jobData.startDate,
          endDate: jobData.endDate,
          isActive: jobData.isActive,
          createdBy: defaultAdminUser,
        });
        jobCount++;
      }
    }
    this.logger.log(`>>> Đã khởi tạo thành công ${jobCount} Công việc (Job) mẫu!`);
    this.logger.log('>>> KHỞI TẠO DỮ LIỆU MẪU THÀNH CÔNG HOÀN TOÀN!');
  }
}
