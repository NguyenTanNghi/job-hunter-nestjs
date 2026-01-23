import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './passport/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './passport/jwt.strategy';

@Module({
    imports: [
        UsersModule,
        PassportModule,
        // Cấu hình JwtModule sử dụng ConfigService để lấy các biến môi trường
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: {
                    expiresIn: configService.get<string>('JWT_EXPIRE')
                },
            }),
            inject: [ConfigService],
        }),],
    providers: [AuthService, LocalStrategy, JwtStrategy], // Đăng ký các chiến lược xác thực và dịch vụ xác thực
    exports: [AuthService],
})
export class AuthModule { }
