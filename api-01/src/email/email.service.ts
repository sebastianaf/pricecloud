// mail.service.ts

import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

import { SendEmailDto } from './dto/send-email.dto';

@Injectable()
export class EmailService {
  private transporter: Mail;

  private readonly emailHost: string;
  private readonly emailPort: number;
  private readonly emailUser: string;
  private readonly emailPassword: string;

  constructor() {
    this.emailHost = process.env.EMAIL_HOST;
    this.emailPort = Number(process.env.EMAIL_PORT);
    this.emailUser = process.env.EMAIL_USER;
    this.emailPassword = process.env.EMAIL_PASSWORD;

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
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: body,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
