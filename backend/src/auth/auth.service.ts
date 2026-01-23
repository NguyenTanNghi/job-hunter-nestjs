import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) { }

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
}