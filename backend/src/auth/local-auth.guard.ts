
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
// Chiến lược xác thực cục bộ sử dụng tên đăng nhập và mật khẩu
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') { }
