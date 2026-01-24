import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    const configService = app.get(ConfigService); // sử dụng ConfigService trong main.ts

    // Thiết lập JwtAuthGuard toàn cục, thay thế cách đăng ký trong AppModule, tất cả các route đều cần xác thực
    // JWT trừ những route được đánh dấu là @Public()
    const reflector = app.get(Reflector)
    app.useGlobalGuards(new JwtAuthGuard(reflector));

    app.useStaticAssets(join(__dirname, '..', 'public'));
    app.setBaseViewsDir(join(__dirname, '..', 'views'));
    app.setViewEngine('ejs');
    app.useGlobalPipes(new ValidationPipe()); // Sử dụng validationPipe toàn cục
    await app.listen(configService.get<string>('PORT'));
}
bootstrap();
