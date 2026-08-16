import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/users.interface';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';

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
    async login(user: IUser) {
        const { _id, name, email, role } = user;
        const payload = { sub: "token login", iss: "from server", _id, name, email, role }; // payload là dữ liệu sẽ được mã hóa trong JWT token

        const refresh_token = this.createRefreshToken(payload);

        return {
            access_token: this.jwtService.sign(payload),
            refresh_token,
            user: {
                _id,
                name,
                email,
                // role
            }
        }; // Trả về access_token và thông tin user cho client
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
}