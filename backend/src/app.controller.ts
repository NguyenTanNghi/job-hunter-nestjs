import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) { }

    @Get()//=> restful API
    @Render("home") //=> SSR
    getHello() {
        // return "";
    }
}
