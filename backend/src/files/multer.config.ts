import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MulterModuleOptions, MulterOptionsFactory } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path, { join } from 'path';
import fs from 'fs';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  // Trả ra link thư mục root
  getRootPath = () => {
    return process.cwd();
  };

  // Tạo thư mục nếu chưa tồn tại
  ensureExists(targetDirectory: string) {
    fs.mkdir(targetDirectory, { recursive: true }, (error) => {
      if (!error) {
        console.log('Directory successfully created, or it already exists.');
        return;
      }
      switch (error.code) {
        case 'EEXIST':
          break;
        case 'ENOTDIR':
          break;
        default:
          console.error(error);
          break;
      }
    });
  }

  // Cấu hình nơi lưu và cách lưu file
  createMulterOptions(): MulterModuleOptions {
    return {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const folder = req?.headers?.folder_type ?? "default";
          this.ensureExists(`public/images/${folder}`);
          cb(null, join(this.getRootPath(), `public/images/${folder}`))
        },
        filename: (req, file, cb) => {
          let extName = path.extname(file.originalname);
          let baseName = path.basename(file.originalname, extName);
          let finalName = `${baseName}-${Date.now()}${extName}`
          cb(null, finalName)
        }
      }),
      fileFilter: (req, file, cb) => {
        const allowedFileTypes = /^(jpg|jpeg|png|gif|txt|pdf|doc|docx)$/i;
        const isValidExtname = allowedFileTypes.test(path.extname(file.originalname).replace('.', ''));
        const isValidMimetype = allowedFileTypes.test(file.mimetype);

        if (isValidExtname || isValidMimetype) {
          return cb(null, true);
        } else {
          cb(new HttpException(`File không đúng định dạng. Chỉ chấp nhận các định dạng: jpg, jpeg, png, gif, txt, pdf, doc, docx`, HttpStatus.UNPROCESSABLE_ENTITY), false);
        }
      },
      limits: {
        fileSize: 1024 * 1024 * 5 // 5MB limit
      }
    };
  }
}
