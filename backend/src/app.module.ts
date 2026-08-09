import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
import { CompaniesModule } from './companies/companies.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URL'),
        connectionFactory: (connection) => {
          connection.plugin(softDeletePlugin);
          return connection;
        }
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    AuthModule,
    CompaniesModule
  ],
  controllers: [AppController],
  providers: [AppService,
    // Đăng ký JwtAuthGuard như một global guard để bảo vệ tất cả các route theo mặc định không cần khai báo @UseGuards(JwtAuthGuard) ở từng controller
    // {
    //     provide: APP_GUARD,
    //     useClass: JwtAuthGuard,
    // },
  ],
})
export class AppModule { }
