import { createParamDecorator, ExecutionContext, SetMetadata } from "@nestjs/common";

// Decorator để đánh dấu các route là công khai, không yêu cầu xác thực
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const IS_PUBLIC_PERMISSION = 'isPublicPermission';
export const SkipCheckPermission = () => SetMetadata(IS_PUBLIC_PERMISSION, true);

// Decorator để gán thông điệp tùy chỉnh cho response
export const RESPONSE_MESSAGE_KEY = 'responseMessage';
export const ResponseMessage = (message: string) => SetMetadata(RESPONSE_MESSAGE_KEY, message);

// Decorator để lấy thông tin người dùng từ request sau khi đã xác thực
export const User = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);