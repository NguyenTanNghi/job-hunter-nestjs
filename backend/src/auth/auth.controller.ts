import { Controller, Get, Post, Request, UseGuards, Body } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./local-auth.guard";
import { Public, ResponseMessage } from "./decorator/customize";
import { RegisterUserDto } from "src/users/dto/create-user.dto";

@Controller("auth")
export class AuthController {
    constructor(
        private authService: AuthService
    ) { }

    @Public()
    @UseGuards(LocalAuthGuard)
    @ResponseMessage('Đăng nhập người dùng')
    @Post('/login')
    handleLogin(@Request() req) {
        return this.authService.login(req.user);
    }

    @Public()
    @ResponseMessage('Đăng ký tài khoản mới')
    @Post('/register')
    handleRegister(@Body() registerUserDto: RegisterUserDto) {
        return this.authService.register(registerUserDto);
    }

    @Get('/profile')
    @ResponseMessage('Lấy thông tin tài khoản')
    getProfile(@Request() req) {
        return req.user;
    }
}
