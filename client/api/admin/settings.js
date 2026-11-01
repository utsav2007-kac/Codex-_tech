import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    // Send test email
    const smtpUser = process.env.SMTP_USER || 'kachhadiyautsav13@gmail.com';
    const smtpPass = process.env.SMTP_PASS || 'pzuc tgdp hwas ixie';
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
    const recipient = req.body?.email || process.env.NOTIFY_EMAIL || 'kachhadiyautsav13@gmail.com';

    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: { user: smtpUser, pass: smtpPass },
        tls: { rejectUnauthorized: false },
      });

      await transporter.sendMail({
        from: `Codex Tech-IT <${smtpUser}>`,
        to: recipient,
        subject: '[Test Verification] Codex Tech-IT Settings Test',
        html: `<p>Settings test email dispatched to <strong>${recipient}</strong>.</p>`,
      });

      return res.status(200).json({
        success: true,
        data: { message: `Test email sent to ${recipient}` },
      });
    } catch (e) {
      return res.status(500).json({
        success: false,
        error: { message: e.message },
      });
    }
  }

  return res.status(200).json({
    success: true,
    data: {
      site_name: 'Codex Tech-IT',
      tagline: 'We Deliver Jobs Faster',
      notify_email: 'kachhadiyautsav13@gmail.com',
      primary_email: 'contact@codextechit.com',
      phone_usa: '+1 (469) 555-0198',
      phone_india: '+91 40 6789 0123',
      announcement: 'Now booking free career consultations. Reserve your slot →',
      socials: {
        linkedin: 'https://linkedin.com/company/codex-tech-it',
        twitter: 'https://twitter.com/codextechit',
        github: 'https://github.com/codextechit',
        youtube: 'https://youtube.com/@codextechit',
      },
    },
  });
}

