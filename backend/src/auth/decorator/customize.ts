import { createParamDecorator, ExecutionContext, SetMetadata } from "@nestjs/common";

// Decorator để đánh dấu các route là công khai, không yêu cầu xác thực
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

// Decorator để lấy thông tin người dùng từ request sau khi đã xác thực
export const User = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);