import { Injectable } from '@nestjs/common';

@Injectable() // provider decorator
export class AppService {
  getHello(): string {
    return 'Hello World12!';
  }
}
