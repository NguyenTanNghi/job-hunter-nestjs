
import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Chiến lược xác thực JWT sử dụng token từ header Authorization
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext) {
        return super.canActivate(context);
    }

    // Tùy chỉnh phản hồi khi xác thực thất bại
    handleRequest(err: any, user: any, info: any) {
        if (err || !user) {
            throw err || new UnauthorizedException("Token không hợp lệ hoặc đã hết hạn");
        }
        return user;
    }
}
