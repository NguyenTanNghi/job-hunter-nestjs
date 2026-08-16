import { IsArray, IsBoolean, IsDate, IsNotEmpty, IsNotEmptyObject, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import mongoose from 'mongoose';

class Company {
  @IsNotEmpty({ message: '_id không được để trống' })
  _id: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: 'name không được để trống' })
  name: string;
}

export class CreateJobDto {
  @IsNotEmpty({ message: 'Name không được để trống' })
  name: string;

  @IsArray({ message: 'Skills có định dạng là array' })
  @IsString({ each: true, message: 'Skill có định dạng là string' })
  @IsNotEmpty({ message: 'Skills không được để trống' })
  skills: string[];

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => Company)
  company: Company;

  @IsOptional()
  location: string;

  @IsNotEmpty({ message: 'Salary không được để trống' })
  salary: number;

  @IsNotEmpty({ message: 'Quantity không được để trống' })
  quantity: number;

  @IsNotEmpty({ message: 'Level không được để trống' })
  level: string;

  @IsNotEmpty({ message: 'Description không được để trống' })
  description: string;

  @IsNotEmpty({ message: 'StartDate không được để trống' })
  @Transform(({ value }) => new Date(value))
  @IsDate({ message: 'StartDate có định dạng là Date' })
  startDate: Date;

  @IsNotEmpty({ message: 'EndDate không được để trống' })
  @Transform(({ value }) => new Date(value))
  @IsDate({ message: 'EndDate có định dạng là Date' })
  endDate: Date;

  @IsNotEmpty({ message: 'IsActive không được để trống' })
  @IsBoolean({ message: 'IsActive có định dạng là boolean' })
  isActive: boolean;
}
