import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET || 'codex_jwt_secret_dev_key',
  databaseUrl: process.env.DATABASE_URL || 'mysql://root:@localhost:3306/codex_tech_it',
  admin: {
    email: process.env.ADMIN_EMAIL || 'admin@codex.com',
    password: process.env.ADMIN_PASSWORD || 'admin@123',
  },
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.example.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.SMTP_FROM || 'Codex Tech-IT <notifications@codextechit.com>',
  },
  notifyEmail: process.env.NOTIFY_EMAIL || 'careers@codextechit.com',
  anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
};
