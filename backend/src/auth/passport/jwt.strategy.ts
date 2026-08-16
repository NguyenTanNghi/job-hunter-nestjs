
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IUser } from 'src/users/users.interface';

// Chiến lược xác thực JWT sử dụng token từ header Authorization
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private configService: ConfigService) {
        // Giải mã token từ header Authorization
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
        });
    }

    // Trả về thông tin người dùng từ payload của JWT
    async validate(payload: IUser) {
        const { _id, name, email, role } = payload;

        // request.user sẽ chứa thông tin người dùng sau khi xác thực thành công
        return { _id, name, email, role };
    }
}
