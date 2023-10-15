// mail.service.ts

import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

import { SendEmailDto } from './dto/send-email.dto';
import { EnvironmentsInterface } from '../common/interfaces/environment.interface';

@Injectable()
export class EmailService {
  private transporter: Mail;

  private readonly emailHost: string;
  private readonly emailPort: number;
  private readonly emailUser: string;
  private readonly emailPassword: string;
  private readonly env: string;

  constructor() {
    this.emailHost = process.env.EMAIL_HOST;
    this.emailPort = Number(process.env.EMAIL_PORT);
    this.emailUser = process.env.EMAIL_USER;
    this.emailPassword = process.env.EMAIL_PASSWORD;
    this.env = process.env.ENV;

    this.transporter = nodemailer.createTransport({
      host: this.emailHost,
      port: this.emailPort,
      secure: true,
      auth: {
        user: this.emailUser,
        pass: this.emailPassword,
      },
    });
  }

  async send(sendEmailDto: SendEmailDto): Promise<void> {
    const { body, subject, to } = sendEmailDto;

    const mailOptions: nodemailer.SendMailOptions = {
      from: `Pricecloud<${this.emailUser}>`,
      to,
      subject: `${
        this.env !== EnvironmentsInterface.production &&
        `${this.env.toUpperCase()} | `
      }${subject}`,
      html: body,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
