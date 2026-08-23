import { Module } from '@nestjs/common';
import { CompaniesService } from 'src/companies/companies.service';
import { CompaniesController } from 'src/companies/companies.controller';
import { Company, CompanySchema } from 'src/companies/schemas/company.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: Company.name, schema: CompanySchema }])],
  controllers: [CompaniesController],
  providers: [CompaniesService],
})
export class CompaniesModule { }
