import { Controller, Get, Post, UseGuards, Body, Res, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./local-auth.guard";
import { Public, ResponseMessage } from "./decorator/customize";
import { RegisterUserDto } from "src/users/dto/create-user.dto";
import { Response } from "express";

@Controller("auth")
export class AuthController {
    constructor(
        private authService: AuthService
    ) { }

    @Public()
    @UseGuards(LocalAuthGuard)
    @ResponseMessage('Đăng nhập người dùng')
    @Post('/login')
    handleLogin(
        @Req() req,
        @Res({ passthrough: true }) response: Response
    ) {
        return this.authService.login(req.user, response);
    }

    @Public()
    @ResponseMessage('Đăng ký tài khoản mới')
    @Post('/register')
    handleRegister(@Body() registerUserDto: RegisterUserDto) {
        return this.authService.register(registerUserDto);
    }

    @Get('/profile')
    @ResponseMessage('Lấy thông tin tài khoản')
    getProfile(@Req() req) {
        return req.user;
    }
}
