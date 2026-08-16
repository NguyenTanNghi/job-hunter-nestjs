import { Controller, HttpStatus, ParseFilePipeBuilder, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { ResponseMessage, Public } from 'src/auth/decorator/customize';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) { }

  @Post('upload')
  @ResponseMessage('Tải lên một tệp tin')
  @UseInterceptors(FileInterceptor('file')) //tên field sử dụng trong form-data
  uploadFile(@UploadedFile(
    new ParseFilePipeBuilder()
      .addFileTypeValidator({
        fileType: /^(jpg|jpeg|png|image\/png|gif|txt|pdf|doc|docx|text\/plain)$/i,
      })
      .addMaxSizeValidator({
        maxSize: 1024 * 1024 // 1MB
      })
      .build({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
      })) file: Express.Multer.File) {
    return {
      fileName: file.filename
    };
  }
}
