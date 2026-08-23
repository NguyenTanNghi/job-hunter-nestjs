import { PartialType } from '@nestjs/mapped-types';
import { CreatePermissionDto } from 'src/permissions/dto/create-permission.dto';

export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {}
