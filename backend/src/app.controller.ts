import { Controller, Get, Post, Render, Request, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService,
        private configService: ConfigService, // sử dụng ConfigService trong AppController
        private authService: AuthService
    ) { }

    // @Get()//=> restful API
    // @Render("home") //=> SSR
    // handleHomePage() {
    //     const message = this.appService.getHello();
    //     return { message };
    // }

    @UseGuards(LocalAuthGuard) // Sử dụng AuthGuard với chiến lược 'local' để bảo vệ route này để đăng nhập
    @Post('/login')
    handleLogin(@Request() req) {
        return this.authService.login(req.user);// Trả về JWT token sau khi đăng nhập thành công
    }

    // @UseGuards(JwtAuthGuard) // Bảo vệ route này bằng token JWT
    @Get('/profile')
    getProfile(@Request() req) {
        return req.user;
    }
}
