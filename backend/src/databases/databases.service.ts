import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Company, CompanyDocument } from 'src/companies/schemas/company.schema';
import { Job, JobDocument } from 'src/jobs/schemas/job.schema';
import { Permission, PermissionDocument } from 'src/permissions/schemas/permission.schema';
import { Role, RoleDocument } from 'src/roles/schemas/role.schema';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { ADMIN_ROLE, HR_ROLE, INIT_COMPANIES, INIT_JOBS, INIT_PERMISSIONS, USER_ROLE } from './sample';

@Injectable()
export class DatabasesService implements OnModuleInit {
  private readonly logger = new Logger(DatabasesService.name);

  constructor(
    @InjectModel(Company.name)
    private companyModel: SoftDeleteModel<CompanyDocument>,
    @InjectModel(Job.name)
    private jobModel: SoftDeleteModel<JobDocument>,
    @InjectModel(Permission.name)
    private permissionModel: SoftDeleteModel<PermissionDocument>,
    @InjectModel(Role.name)
    private roleModel: SoftDeleteModel<RoleDocument>,
    @InjectModel(User.name)
    private userModel: SoftDeleteModel<UserDocument>,
    private usersService: UsersService,
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    const isInitData = this.configService.get<string>('INIT_DATA_PASSWORD');

    if (isInitData) {
      const countPermission = await this.permissionModel.countDocuments({});
      const countRole = await this.roleModel.countDocuments({});
      const countUser = await this.userModel.countDocuments({});
      const countCompany = await this.companyModel.countDocuments({});
      const countJob = await this.jobModel.countDocuments({});

      // 1. Seed Permissions
      if (countPermission === 0) {
        await this.permissionModel.insertMany(INIT_PERMISSIONS);
        this.logger.log(`>>> Đã khởi tạo thành công ${INIT_PERMISSIONS.length} Permissions mẫu!`);
      }

      // 2. Seed Roles (SUPER_ADMIN & NORMAL_USER)
      if (countRole === 0) {
        const permissions = await this.permissionModel.find({}).select('_id');

        await this.roleModel.insertMany([
          {
            name: ADMIN_ROLE,
            description: 'Admin hệ thống có đầy đủ tất cả các quyền hạn',
            isActive: true,
            permissions: permissions.map(p => p._id),
          },
          {
            name: USER_ROLE,
            description: 'Người dùng thông thường hệ thống',
            isActive: true,
            permissions: [],
          },
        ]);
        this.logger.log('>>> Đã khởi tạo thành công 2 Roles mẫu (SUPER_ADMIN & NORMAL_USER)!');
      }

      // 3. Seed Users (admin@gmail.com & user@gmail.com)
      if (countUser === 0) {
        const adminRole = await this.roleModel.findOne({ name: ADMIN_ROLE });
        const userRole = await this.roleModel.findOne({ name: USER_ROLE });

        await this.userModel.insertMany([
          {
            name: "I'm Super Admin",
            email: 'admin@gmail.com',
            password: this.usersService.getHashPassword('123456'),
            age: 30,
            gender: 'MALE',
            address: 'Việt Nam',
            role: adminRole?._id,
          },
          {
            name: "I'm Normal User",
            email: 'user@gmail.com',
            password: this.usersService.getHashPassword('123456'),
            age: 22,
            gender: 'FEMALE',
            address: 'Hồ Chí Minh',
            role: userRole?._id,
          },
        ]);
        this.logger.log('>>> Đã khởi tạo thành công 2 tài khoản người dùng mẫu (admin@gmail.com & user@gmail.com)!');
      }

      // 4. Seed Companies
      if (countCompany === 0) {
        await this.companyModel.insertMany(INIT_COMPANIES);
        this.logger.log(`>>> Đã khởi tạo thành công ${INIT_COMPANIES.length} Công ty mẫu!`);
      }

      // 5. Seed Jobs
      if (countJob === 0) {
        await this.jobModel.insertMany(INIT_JOBS);
        this.logger.log(`>>> Đã khởi tạo thành công ${INIT_JOBS.length} Công việc (Job) mẫu!`);
      }

      if (countPermission > 0 && countRole > 0 && countUser > 0 && countCompany > 0 && countJob > 0) {
        this.logger.log('>>> SKIP SEED DATA: CSDL đã có sẵn đầy đủ dữ liệu mẫu. Bỏ qua seed.');
      } else {
        this.logger.log('>>> KHỞI TẠO DỮ LIỆU MẪU THÀNH CÔNG HOÀN TOÀN!');
      }
    }
  }
}
