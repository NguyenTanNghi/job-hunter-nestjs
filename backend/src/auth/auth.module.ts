import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './passport/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './passport/jwt.strategy';
import ms from 'ms';
import { AuthController } from './auth.controller';

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
                    expiresIn: ms(configService.get<string>('JWT_ACCESS_EXPIRE')) / 1000 // ms() trả về miligiây (86.400.000 ms). jsonwebtoken nhận số là số GIÂY, nên cần chia 1000 để ra 86.400 giây = 1 ngày
                },
            }),
            inject: [ConfigService],
        }),],
    providers: [AuthService, LocalStrategy, JwtStrategy], // Đăng ký các chiến lược xác thực và dịch vụ xác thực
    exports: [AuthService],
    controllers: [AuthController],
})
export class AuthModule { }
