import { IsNotEmpty } from 'class-validator';

export class UpdateResumeDto {
  @IsNotEmpty({ message: 'status không được để trống' })
  status: string;
}
