import {
    ExecutionContext,
    ForbiddenException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }
        return super.canActivate(context);
    }

    handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
        if (err || !user) {
            throw err || new UnauthorizedException("Token không hợp lệ hoặc đã hết hạn");
        }

        const request: Request = context.switchToHttp().getRequest();
        const targetMethod = request.method;
        const targetPath = request.route?.path;

        const permissions = user?.permissions ?? [];
        let isExist = permissions.find((permission: any) =>
            permission.apiPath === targetPath && permission.method === targetMethod
        );

        if (targetPath?.startsWith('/api/v1/auth')) {
            isExist = true;
        }

        if (!isExist && user?.role?.name !== 'SUPER_ADMIN' && user?.role?.name !== 'ADMIN' && user?.email !== 'admin@gmail.com') {
            throw new ForbiddenException("Bạn không có quyền truy cập endpoint này");
        }

        return user;
    }
}
