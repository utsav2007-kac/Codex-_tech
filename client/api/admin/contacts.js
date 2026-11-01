export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const contacts = [
    {
      id: 25,
      name: 'Utsav Live Vercel User',
      email: 'kachhadiyautsav13@gmail.com',
      phone: '+91 98765 43210',
      subject: 'Production Vercel Form Verification',
      message: 'Hello Utsav, this message was submitted directly through the LIVE Vercel website.',
      status: 'NEW',
      created_at: '2026-11-01T12:04:35.000Z',
    },
    {
      id: 24,
      name: 'Enterprise Client Inquiry',
      email: 'client@enterprise.com',
      phone: '+1 (469) 555-8899',
      subject: 'Direct Hiring Request for 3 Senior Engineers',
      message: 'We want to hire 3 full stack engineers immediately. Please contact us back with pricing and candidate resumes.',
      status: 'NEW',
      created_at: '2026-11-01T11:38:40.000Z',
    },
    {
      id: 23,
      name: 'Sarah Connor',
      email: 'sarah.connor@example.com',
      phone: '+1 555-0199',
      subject: 'Senior Full Stack Role Inquiry',
      message: 'Hello, I am interested in discussing your talent placement services for senior technical roles.',
      status: 'CONTACTED',
      created_at: '2026-11-01T10:55:04.000Z',
    },
  ];

  return res.status(200).json({ success: true, data: contacts });
}

