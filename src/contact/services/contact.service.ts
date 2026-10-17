import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { SendMessageDto } from '../dto/send-message.dto';
import { IApiResponse } from 'src/common/interfaces/response.interface';

@Injectable()
export class ContactService {
    private transpoter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT),
        secure: false,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD,
        },
    });

    async sendMessage(payload: SendMessageDto): Promise<IApiResponse> {
        console.log('MAIL_USER:', process.env.MAIL_USER);
        console.log('MAIL_FROM:', process.env.MAIL_FROM);
        console.log('MAIL_TO:', process.env.MAIL_TO);
        await this.transpoter.sendMail({
            from: process.env.MAIL_FROM,
            to: process.env.MAIL_TO,
            replyTo: payload.email,
            subject: `New Contact Message from ${payload.email}`,
            html: `
            <h2>New Contact Form Message</h2>
            <p>
            <strong>Name:</strong> ${payload.name}
            </p>
            <p>
            <strong>Email:</strong> ${payload.email}
            </p>
            <p>
            <strong>Phone:</strong> ${payload.phoneNo}
            </p>
            <p>
            <strong>Message</strong> ${payload.message}
            </p>
            `,
        });
        return {
            message: 'Message sent successfully',
        };
    }
}
