import { Module } from '@nestjs/common';
import { FilesService } from 'src/files/files.service';
import { FilesController } from 'src/files/files.controller';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from 'src/files/multer.config';

@Module({
  imports: [
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
  ],
  controllers: [FilesController],
  providers: [FilesService, MulterConfigService],
})
export class FilesModule {}
