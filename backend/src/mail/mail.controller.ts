import { Controller, Get } from '@nestjs/common';
import { MailService } from 'src/mail/mail.service';
import { Public, ResponseMessage } from 'src/auth/decorator/customize';
import { MailerService } from '@nestjs-modules/mailer';

@Controller('mail')
export class MailController {
  constructor(
    private readonly mailService: MailService,
    private readonly mailerService: MailerService,
  ) {}

  @Get()
  @Public()
  @ResponseMessage('Test email')
  async handleTestEmail() {
    await this.mailerService.sendMail({
      to: 'haryphamdev@gmail.com',
      from: '"Support Team" <support@example.com>',
      subject: 'Welcome to Nice App! Confirm your Email',
      template: 'test',
      context: {
        receiver: 'Eric',
        jobs: [
          {
            name: 'Senior React Developer',
            company: 'Tech Corp',
            salary: '2,000 USD',
            skills: ['React', 'TypeScript', 'Node.js'],
          },
          {
            name: 'NestJS Backend Engineer',
            company: 'Global Software',
            salary: '2,500 USD',
            skills: ['NestJS', 'MongoDB', 'Docker'],
          },
        ],
      },
    });
    return 'ok';
  }
}
