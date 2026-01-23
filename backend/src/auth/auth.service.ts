import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService) { }

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
    async login(user: any) {
        const payload = { username: user.email, sub: user._id };
        return {
            access_token: this.jwtService.sign(payload), // Tạo JWT token với payload đã định nghĩa
        };
    }
}