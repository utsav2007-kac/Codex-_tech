import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: { code: 'METHOD_NOT_ALLOWED', message: 'Only POST requests are allowed' },
    });
  }

  try {
    let data = req.body;
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (_) {
        data = {};
      }
    }
    data = data || {};

    const { name, email, phone, subject, message, honeypot } = data;

    // Honeypot bot protection
    if (honeypot) {
      return res.status(200).json({ success: true, data: { message: 'Message received.' } });
    }

    // Validation
    const errors = {};
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }
    if (!email || typeof email !== 'string' || !email.includes('@') || !email.includes('.')) {
      errors.email = 'Please enter a valid email address';
    }
    if (!subject || typeof subject !== 'string' || subject.trim().length < 3) {
      errors.subject = 'Subject must be at least 3 characters';
    }
    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request payload',
          fields: errors,
        },
      });
    }

    const cleanData = {
      name: name.trim(),
      email: email.trim(),
      phone: phone && typeof phone === 'string' && phone.trim() ? phone.trim() : 'Not provided',
      subject: subject.trim(),
      message: message.trim(),
    };

    const smtpUser = process.env.SMTP_USER || 'kachhadiyautsav13@gmail.com';
    const smtpPass = process.env.SMTP_PASS || 'pzuc tgdp hwas ixie';
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
    const smtpFrom = process.env.SMTP_FROM || `Codex Tech-IT <${smtpUser}>`;
    const recipientEmail = process.env.NOTIFY_EMAIL || 'kachhadiyautsav13@gmail.com';

    const emailHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
        <div style="border-bottom: 2px solid #ea580c; padding-bottom: 16px; margin-bottom: 20px;">
          <div style="display: inline-block; padding: 4px 10px; background-color: #ffedd5; color: #c2410c; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">
            New Website Inquiry
          </div>
          <h2 style="color: #0f172a; margin: 0 0 6px 0; font-size: 20px; font-weight: 800;">Contact Form Submission: ${cleanData.subject}</h2>
          <p style="color: #64748b; margin: 0; font-size: 13px;">Codex Tech-IT Contact &amp; Advisory Desk</p>
        </div>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 13.5px;">
          <tr>
            <td style="padding: 10px 12px; background-color: #f8fafc; font-weight: 600; color: #475569; width: 140px; border-bottom: 1px solid #f1f5f9;">Full Name:</td>
            <td style="padding: 10px 12px; color: #0f172a; font-weight: 700; border-bottom: 1px solid #f1f5f9;">${cleanData.name}</td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; background-color: #f8fafc; font-weight: 600; color: #475569; border-bottom: 1px solid #f1f5f9;">Email Address:</td>
            <td style="padding: 10px 12px; border-bottom: 1px solid #f1f5f9;">
              <a href="mailto:${cleanData.email}" style="color: #ea580c; font-weight: 600; text-decoration: none;">${cleanData.email}</a>
              <span style="color: #94a3b8; font-size: 12px; margin-left: 6px;">(Click reply in your email app to respond directly)</span>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; background-color: #f8fafc; font-weight: 600; color: #475569; border-bottom: 1px solid #f1f5f9;">Phone Number:</td>
            <td style="padding: 10px 12px; color: #0f172a; font-weight: 600; border-bottom: 1px solid #f1f5f9;">${cleanData.phone}</td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; background-color: #f8fafc; font-weight: 600; color: #475569; border-bottom: 1px solid #f1f5f9;">Subject:</td>
            <td style="padding: 10px 12px; color: #0f172a; font-weight: 700; border-bottom: 1px solid #f1f5f9;">${cleanData.subject}</td>
          </tr>
        </table>

        <div style="background-color: #f8fafc; border-left: 4px solid #ea580c; padding: 16px 20px; border-radius: 8px; margin-bottom: 24px;">
          <p style="margin: 0 0 8px 0; font-weight: 700; color: #0f172a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Message Details:</p>
          <p style="margin: 0; color: #334155; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${cleanData.message}</p>
        </div>

        <div style="font-size: 11.5px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 14px; text-align: center;">
          Delivered to designated admin mailbox (<code>${recipientEmail}</code>). Codex Tech-IT Platform.
        </div>
      </div>
    `;

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    await transporter.sendMail({
      from: smtpFrom,
      to: recipientEmail,
      replyTo: cleanData.email,
      subject: `[Contact Inquiry] ${cleanData.subject} - ${cleanData.name}`,
      html: emailHtml,
      text: `New Contact Submission from ${cleanData.name} (${cleanData.email}, Phone: ${cleanData.phone})\n\nSubject: ${cleanData.subject}\n\nMessage:\n${cleanData.message}`,
    });

    return res.status(201).json({
      success: true,
      data: {
        message: 'Message sent successfully! Our team will reply promptly.',
      },
    });
  } catch (err) {
    console.error('[Vercel Serverless Contact Error]:', err);
    return res.status(500).json({
      success: false,
      error: {
        code: 'EMAIL_DISPATCH_ERROR',
        message: 'Failed to send message: ' + (err.message || 'Please try again later.'),
      },
    });
  }
}
