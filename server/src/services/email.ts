import nodemailer from 'nodemailer';
import { prisma } from './db';
import { config } from '../config';

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

export async function getNotificationEmail(): Promise<string> {
  try {
    const generalSetting = await prisma.siteSetting.findUnique({ where: { key: 'general' } });
    const general = (generalSetting?.value as Record<string, any>) || {};
    if (general.notify_email && typeof general.notify_email === 'string' && general.notify_email.trim()) {
      return general.notify_email.trim();
    }
  } catch (err) {
    console.warn('Could not fetch siteSetting for notify_email, falling back to config:', err);
  }
  return config.notifyEmail || 'admin@codextechit.com';
}

export async function getSmtpConfig() {
  try {
    const smtpSetting = await prisma.siteSetting.findUnique({ where: { key: 'smtp' } });
    if (smtpSetting && smtpSetting.value && typeof smtpSetting.value === 'object') {
      const val = smtpSetting.value as Record<string, any>;
      if (val.host && val.user && val.pass) {
        return {
          host: val.host,
          port: parseInt(val.port, 10) || 587,
          secure: parseInt(val.port, 10) === 465,
          user: val.user,
          pass: val.pass,
          from: val.from || config.smtp.from,
        };
      }
    }
  } catch (_) {}

  return {
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.port === 465,
    user: config.smtp.user,
    pass: config.smtp.pass,
    from: config.smtp.from,
  };
}

export async function sendEmail({ to, subject, html, text, replyTo }: SendEmailOptions): Promise<boolean> {
  const plainText = text || html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const smtp = await getSmtpConfig();

  // If SMTP is not fully configured, log to DB and console as per specification
  if (!smtp.user || !smtp.pass || smtp.pass === 'secret_password' || smtp.user.includes('example.com') || smtp.host.includes('example.com')) {
    console.log(`[EMAIL DISPATCH DEV FALLBACK] To: ${to} | Subject: ${subject}`);
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
      host: smtp.host,
      port: smtp.port,
      secure: smtp.secure,
      auth: {
        user: smtp.user,
        pass: smtp.pass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    await transporter.sendMail({
      from: smtp.from,
      to,
      replyTo: replyTo || undefined,
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
