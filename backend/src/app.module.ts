import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
    imports: [
        MongooseModule.forRootAsync({ // sử dụng ConfigService để kết nối MongoDB
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get<string>('MONGODB_URL'),
            }),
            inject: [ConfigService],
        }),
        ConfigModule.forRoot({
            isGlobal: true,//cho phép sử dụng ở mọi module
        }),
        UsersModule,
        AuthModule
    ],
    controllers: [AppController],
    providers: [AppService,
        // Đăng ký JwtAuthGuard như một global guard để bảo vệ tất cả các route theo mặc định không cần khai báo @UseGuards(JwtAuthGuard) ở từng controller
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },],
})
export class AppModule { }
