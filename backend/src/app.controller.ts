import { Controller, Get, Post, Render, Request, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { LocalAuthGuard } from './auth/local-auth.guard';

@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService,
        private configService: ConfigService // sử dụng ConfigService trong AppController
    ) { }

    // @Get()//=> restful API
    // @Render("home") //=> SSR
    // handleHomePage() {
    //     const message = this.appService.getHello();
    //     return { message };
    // }

    @UseGuards(LocalAuthGuard) // Sử dụng AuthGuard với chiến lược 'local' để bảo vệ route này
    @Post('/login')
    handleLogin(@Request() req) {
        return req.user; // Trả về thông tin người dùng đã được xác thực
    }
}
