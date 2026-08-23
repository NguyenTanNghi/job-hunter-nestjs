import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "src/auth/auth.service";
import { Injectable, UnauthorizedException } from "@nestjs/common";

// Chiến lược xác thực cục bộ sử dụng tên đăng nhập và mật khẩu
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super();
    }
    async validate(username: string, password: string): Promise<any> {
        const user = await this.authService.validateUser(username, password);
        if (!user) {
            throw new UnauthorizedException("Tên đăng nhập hoặc mật khẩu không đúng");
        }
        return user; //req.user
    }
}