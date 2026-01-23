
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Chiến lược xác thực JWT sử dụng token từ header Authorization
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') { }
