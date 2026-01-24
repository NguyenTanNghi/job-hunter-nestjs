import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './passport/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './passport/jwt.strategy';
import ms from 'ms';

@Module({
    imports: [
        UsersModule,
        PassportModule,
        // Cấu hình JwtModule sử dụng ConfigService để lấy các biến môi trường
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_ACCESS_TOKEN'),
                signOptions: {
                    expiresIn: ms(configService.get<string>('JWT_ACCESS_EXPIRE')) // chuyển đổi thời gian từ chuỗi sang số giây
                },
            }),
            inject: [ConfigService],
        }),],
    providers: [AuthService, LocalStrategy, JwtStrategy], // Đăng ký các chiến lược xác thực và dịch vụ xác thực
    exports: [AuthService],
})
export class AuthModule { }
