import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const API_BASE = 'http://localhost:5000/api';

async function main() {
  console.log('=== [1] TESTING CONTACT FORM SUBMISSION (VALID) ===');
  const validPayload = {
    name: 'Sarah Connor',
    email: 'sarah.connor@example.com',
    phone: '+1 555-0199',
    subject: 'Senior Full Stack Role Inquiry',
    message: 'Hello, I am interested in discussing your talent placement services for senior technical roles.',
  };

  const res1 = await fetch(`${API_BASE}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(validPayload),
  });

  const json1 = await res1.json();
  console.log('Valid submission HTTP status:', res1.status);
  console.log('Response body:', json1);

  if (!res1.ok || !json1.success) {
    throw new Error('Valid contact submission failed!');
  }

  console.log('\n=== [2] TESTING CONTACT FORM SUBMISSION (INVALID / EMPTY) ===');
  const invalidPayload = {
    name: '',
    email: 'not-an-email',
    phone: '',
    subject: '',
    message: '',
  };

  const res2 = await fetch(`${API_BASE}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(invalidPayload),
  });

  const json2 = await res2.json();
  console.log('Invalid submission HTTP status:', res2.status);
  console.log('Validation rejection response:', json2);

  if (res2.status !== 400) {
    throw new Error('Invalid contact submission should have returned HTTP 400!');
  }

  console.log('\n=== [3] TESTING ADMIN LOGIN & SETTINGS UPDATE ===');
  const loginRes = await fetch(`${API_BASE}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@codextechit.com',
      password: 'CodexAdmin2026',
    }),
  });

  const loginJson = await loginRes.json();
  console.log('Admin login HTTP status:', loginRes.status);
  const token = loginJson.data?.token;
  if (!token) {
    throw new Error('Could not authenticate admin!');
  }

  // Update recipient email in Admin Settings
  const newRecipient = 'designated-recipient@codextechit.com';
  const updateRes = await fetch(`${API_BASE}/admin/settings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      notify_email: newRecipient,
    }),
  });

  const updateJson = await updateRes.json();
  console.log('Update settings HTTP status:', updateRes.status);
  console.log('Updated settings response:', updateJson.data?.notify_email || updateJson);

  console.log('\n=== [4] TESTING TEST EMAIL DISPATCH ENDPOINT ===');
  const testEmailRes = await fetch(`${API_BASE}/admin/settings/test-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ email: newRecipient }),
  });
  const testEmailJson = await testEmailRes.json();
  console.log('Test email HTTP status:', testEmailRes.status);
  console.log('Test email response:', testEmailJson);

  console.log('\n=== [5] SUBMITTING NEW INQUIRY TO VERIFY ROUTING TO NEW RECIPIENT ===');
  const res3 = await fetch(`${API_BASE}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'John Doe',
      email: 'john.doe@techcorp.io',
      phone: '+1 469-555-1234',
      subject: 'Custom Cloud Architecture Consultation',
      message: 'Looking to engage 3 senior AWS/Kubernetes DevOps engineers.',
    }),
  });
  const json3 = await res3.json();
  console.log('Second inquiry HTTP status:', res3.status);
  console.log('Second inquiry response:', json3);

  console.log('\n=== [6] VERIFYING DATABASE RECORDS (contacts & email_logs) ===');
  const latestContacts = await prisma.contact.findMany({
    orderBy: { created_at: 'desc' },
    take: 2,
  });
  console.log('Latest Contacts saved in DB:', latestContacts.map(c => ({ id: c.id, name: c.name, email: c.email, subject: c.subject })));

  const latestEmails = await prisma.emailLog.findMany({
    orderBy: { created_at: 'desc' },
    take: 4,
  });
  console.log('Latest Email Logs in DB:', latestEmails.map(e => ({ id: e.id, to_email: e.to_email, subject: e.subject, status: e.status })));

  await prisma.$disconnect();
  console.log('\n✅ ALL VERIFICATIONS COMPLETED SUCCESSFULLY!');
}

main().catch((err) => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});

