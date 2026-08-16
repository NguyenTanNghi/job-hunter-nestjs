import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/users.interface';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import { Response } from "express";

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService
    ) { }

    // Hàm này dùng để xác thực người dùng khi họ đăng nhập, username và password là 2 tham số của thư viện passport truyền vào
    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.usersService.findOneByUsername(username);
        if (user) {
            const isValid = this.usersService.isValidPassword(password, user?.password);
            if (isValid) {
                return user;
            }
        }
        return null;
    }

    // Hàm này dùng để tạo và trả về JWT token khi người dùng đăng nhập thành công
    async login(user: IUser, response: Response) {
        const { _id, name, email, role } = user;
        const payload = { sub: "token login", iss: "from server", _id, name, email, role }; // payload là dữ liệu sẽ được mã hóa trong JWT token

        const refresh_token = this.createRefreshToken(payload);

        // update refresh token db
        await this.usersService.updateUserToken(refresh_token, _id)

        // set refresh_token cookie
        response.cookie("refresh_token", refresh_token, {
            httpOnly: true,
            maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE'))
        });

        return {
            access_token: this.jwtService.sign(payload),
            user: {
                _id,
                name,
                email,
                role
            }
        };
    }

    async register(registerUserDto: RegisterUserDto) {
        return await this.usersService.register(registerUserDto);
    }

    createRefreshToken = (payload: any) => {
        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET"),
            expiresIn: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')) / 1000
        });
        return refreshToken;
    }

    processNewToken = async (refreshToken: string, response: Response) => {
        try {
            this.jwtService.verify(refreshToken, {
                secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET")
            });

            let user = await this.usersService.findUserByToken(refreshToken);
            if (user) {
                // update refresh_token
                const { _id, name, email, role } = user;
                const payload = {
                    sub: "token refresh",
                    iss: "from server",
                    _id,
                    name,
                    email,
                    role
                };

                const refresh_token = this.createRefreshToken(payload);

                // update user with new refresh token
                await this.usersService.updateUserToken(refresh_token, _id.toString());

                // set refresh_token cookie
                response.clearCookie("refresh_token");
                response.cookie("refresh_token", refresh_token, {
                    httpOnly: true,
                    maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE'))
                });

                return {
                    access_token: this.jwtService.sign(payload),
                    user: {
                        _id,
                        name,
                        email,
                        role
                    }
                };
            } else {
                throw new BadRequestException(`Refresh token không hợp lệ. Vui lòng login.`);
            }
        } catch (error) {
            throw new BadRequestException(`Refresh token không hợp lệ. Vui lòng login.`);
        }
    }
}