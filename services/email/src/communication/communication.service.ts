import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import nodemailer from "nodemailer";

@Injectable()
export default class CommunicationService {
  private readonly transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: configService.get("SMTP_HOST"),
      port: configService.get("SMTP_PORT"),
      secure: configService.get("SMTP_PORT") === 465,
      auth: {
        user: configService.get("SMTP_USER"),
        pass: configService.get("SMTP_PASSWORD"),
      },
    });
  }

  async send(data: {
    to: string;
    subject: string;
    text: string;
    html: string;
  }) {
    await this.transporter.sendMail({
      from: this.configService.get("FROM"),
      ...data,
    });
  }
}
