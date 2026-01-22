import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UsersModule } from './users/users.module';

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
        UsersModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
