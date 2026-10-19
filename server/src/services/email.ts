import nodemailer from 'nodemailer';
import { prisma } from './db';
import { config } from '../config';

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: SendEmailOptions): Promise<boolean> {
  const plainText = text || html.replace(/<[^>]+>/g, ' ');

  // If SMTP is not fully configured, log to DB and console as per specification
  if (!config.smtp.user || config.smtp.user.includes('example.com')) {
    console.log(`[EMAIL LOG DEV FALLBACK] To: ${to} | Subject: ${subject}`);
    try {
      await prisma.emailLog.create({
        data: {
          to_email: to,
          subject,
          body: html,
          status: 'LOGGED_DEV',
        },
      });
      return true;
    } catch (err: any) {
      console.error('Failed to log email to DB:', err.message);
      return false;
    }
  }

  try {
    const transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.port === 465,
      auth: {
        user: config.smtp.user,
        pass: config.smtp.pass,
      },
    });

    await transporter.sendMail({
      from: config.smtp.from,
      to,
      subject,
      text: plainText,
      html,
    });

    await prisma.emailLog.create({
      data: {
        to_email: to,
        subject,
        body: html,
        status: 'SENT',
      },
    });
    return true;
  } catch (error: any) {
    console.error('Email sending failed:', error.message);
    try {
      await prisma.emailLog.create({
        data: {
          to_email: to,
          subject,
          body: html,
          status: 'FAILED',
          error: error.message,
        },
      });
    } catch (dbErr) {
      // ignore
    }
    return false;
  }
}
