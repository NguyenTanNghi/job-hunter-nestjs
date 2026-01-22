import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [MongooseModule.forRoot('mongodb+srv://nguyentannghi5722_db_user:3OZ6Wtkoi9auQzJe@cluster0.aw8bcwb.mongodb.net/')],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
