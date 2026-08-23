import { PartialType } from '@nestjs/mapped-types';
import { CreateCompanyDto } from 'src/companies/dto/create-company.dto';

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) { }
