import { Controller, Get, Post, UseGuards, Body, Res, Req } from "@nestjs/common";
import { AuthService } from "src/auth/auth.service";
import { LocalAuthGuard } from "src/auth/local-auth.guard";
import { Public, ResponseMessage, User } from "src/auth/decorator/customize";
import { RegisterUserDto } from "src/users/dto/create-user.dto";
import { Response } from "express";
import { IUser } from "src/users/users.interface";

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

    @Get('/account')
    @ResponseMessage('Lấy thông tin người dùng')
    handleGetAccount(@User() user: IUser) {
        return { user };
    }

    @Public()
    @ResponseMessage('Lấy thông tin người dùng bằng refresh token')
    @Get('/refresh')
    handleRefreshToken(
        @Req() req,
        @Res({ passthrough: true }) response: Response
    ) {
        const refreshToken = req.cookies['refresh_token'];
        return this.authService.processNewToken(refreshToken, response);
    }

    @ResponseMessage('Đăng xuất người dùng')
    @Post('/logout')
    handleLogout(
        @User() user: IUser,
        @Res({ passthrough: true }) response: Response
    ) {
        return this.authService.logout(user, response);
    }
}
