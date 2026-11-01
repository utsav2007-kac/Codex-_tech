import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'codex_super_secret_jwt_key_2026_production_ready';

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
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (_) {
        body = {};
      }
    }
    body = body || {};

    const { email, password } = body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Email and password are required' },
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // Recognized admin user accounts
    const VALID_ADMINS = [
      {
        email: 'admin@codex.com',
        passwords: ['admin@123', 'CodexAdmin2026'],
        name: 'System Superadmin',
        role: 'SUPERADMIN',
      },
      {
        email: 'admin@codextechit.com',
        passwords: ['CodexAdmin2026', 'admin@123'],
        name: 'Codex Administrator',
        role: 'SUPERADMIN',
      },
      {
        email: 'kachhadiyautsav13@gmail.com',
        passwords: ['admin@123', 'CodexAdmin2026', 'pzuc tgdp hwas ixie', 'pzuctgdphwasixie'],
        name: 'Utsav Kachhadiya',
        role: 'SUPERADMIN',
      },
    ];

    if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
      VALID_ADMINS.push({
        email: process.env.ADMIN_EMAIL.trim().toLowerCase(),
        passwords: [process.env.ADMIN_PASSWORD.trim()],
        name: 'Environment Superadmin',
        role: 'SUPERADMIN',
      });
    }

    const matchedAdmin = VALID_ADMINS.find(
      (a) => a.email === cleanEmail && a.passwords.includes(cleanPassword)
    );

    if (!matchedAdmin) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Invalid administrator credentials. Please check email and password.',
        },
      });
    }

    const userPayload = {
      id: 1,
      email: matchedAdmin.email,
      name: matchedAdmin.name,
      role: matchedAdmin.role,
    };

    const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '7d' });

    res.setHeader(
      'Set-Cookie',
      `codex_admin_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`
    );

    return res.status(200).json({
      success: true,
      data: {
        user: userPayload,
        token,
      },
    });
  } catch (err) {
    console.error('[Admin Login Serverless Error]:', err);
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Authentication service encountered an error' },
    });
  }
}

