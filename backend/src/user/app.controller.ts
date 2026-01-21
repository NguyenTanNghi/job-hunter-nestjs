import { Controller, Get, Delete } from '@nestjs/common';

@Controller('user') // route với tiền tố 'user'
export class UserController {
    @Get()
    findAll(): string {
        return 'This action returns all users 23';
    }

    @Get("/by-id")
    findById(): string {
        return 'This action will delete a user by i 1d';
    }
}
