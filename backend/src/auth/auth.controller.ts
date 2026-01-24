import { Controller, Get, Post, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./local-auth.guard";
import { Public } from "./decorator/customize";

@Controller("auth")
export class AuthController {
    constructor(
        private authService: AuthService
    ) { }

    // @Get()//=> restful API
    // @Render("home") //=> SSR
    // handleHomePage() {
    //     const message = this.appService.getHello();
    //     return { message };
    // }

    @Public() // Đánh dấu route này là công khai, không yêu cầu xác thực
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
