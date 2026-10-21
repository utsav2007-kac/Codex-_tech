import http from 'http';

function post(path, body) {
  return new Promise((resolve, reject) => {
    const dataString = JSON.stringify(body);
    const req = http.request(
      {
        hostname: 'localhost',
        port: 5000,
        path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(dataString),
        },
      },
      (res) => {
        let responseBody = '';
        res.on('data', (chunk) => (responseBody += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(responseBody) });
          } catch (e) {
            resolve({ status: res.statusCode, raw: responseBody });
          }
        });
      }
    );
    req.on('error', reject);
    req.write(dataString);
    req.end();
  });
}

function get(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:5000${path}`, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => (responseBody += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(responseBody) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: responseBody });
        }
      });
    }).on('error', reject);
  });
}

async function runTests() {
  console.log('🧪 Testing Codex Tech-IT MySQL API Endpoints...\n');

  const results = [];

  // 1. DB Status & Health
  try {
    const res = await get('/api/health');
    results.push({
      route: 'db-status (GET /api/health)',
      status: res.status,
      success: res.data?.success && res.data?.data?.database === 'connected',
      details: `Database: ${res.data?.data?.database}, Uptime: ${Math.round(res.data?.data?.uptime || 0)}s`,
    });
  } catch (err) {
    results.push({ route: 'db-status', status: 'ERR', success: false, details: err.message });
  }

  // 2. Consultation / Lead
  try {
    const res = await post('/api/leads', {
      name: 'Senior Dev Audit Tester',
      email: `audit.lead.${Date.now()}@example.com`,
      phone: '5551234567',
      country_code: '+1',
      current_role: 'Full Stack Engineer',
      experience_level: 'MID',
      visa_status: 'US_CITIZEN_GC',
      service_interest: 'JOB_PLACEMENT',
      preferred_datetime: '2026-10-25T14:00',
      source: 'audit-suite',
      consent: true,
      message: 'Automated Senior Dev Audit verification test.',
    });
    results.push({
      route: 'consultation (POST /api/leads)',
      status: res.status,
      success: res.data?.success === true,
      details: `Created Lead ID: ${res.data?.data?.id || 'N/A'}`,
    });
  } catch (err) {
    results.push({ route: 'consultation', status: 'ERR', success: false, details: err.message });
  }

  // 3. Contact Form
  try {
    const res = await post('/api/contact', {
      name: 'Audit Inquirer',
      email: `audit.contact.${Date.now()}@example.com`,
      phone: '+1 555-987-6543',
      subject: 'Audit Verification Query',
      message: 'Verifying end-to-end MySQL persistence and email dispatch pipelines.',
    });
    results.push({
      route: 'contact (POST /api/contact)',
      status: res.status,
      success: res.data?.success === true,
      details: `Created Contact ID: ${res.data?.data?.id || 'N/A'}`,
    });
  } catch (err) {
    results.push({ route: 'contact', status: 'ERR', success: false, details: err.message });
  }

  // 4. Employer Inquiry / Request
  try {
    const res = await post('/api/employer-requests', {
      company: 'Audit Tech Labs Inc',
      contact_person: 'Jane Director',
      email: `audit.employer.${Date.now()}@auditcorp.com`,
      phone: '+1 555-333-4444',
      roles_needed: 'Senior React / Three.js Engineers',
      tech_stack: 'React, Three.js, TypeScript, Node.js',
      headcount: '2-5',
      hiring_model: 'DIRECT_HIRE',
      timeline: 'IMMEDIATELY',
      notes: 'Automated test of employer talent pipeline.',
    });
    results.push({
      route: 'employer-inquiry (POST /api/employer-requests)',
      status: res.status,
      success: res.data?.success === true,
      details: `Created EmployerRequest ID: ${res.data?.data?.id || 'N/A'}`,
    });
  } catch (err) {
    results.push({ route: 'employer-inquiry', status: 'ERR', success: false, details: err.message });
  }

  // 5. Newsletter Subscription
  try {
    const res = await post('/api/subscribe', {
      email: `audit.subscriber.${Date.now()}@example.com`,
    });
    results.push({
      route: 'newsletter (POST /api/subscribe)',
      status: res.status,
      success: res.data?.success === true,
      details: res.data?.data?.message || 'Subscribed successfully',
    });
  } catch (err) {
    results.push({ route: 'newsletter', status: 'ERR', success: false, details: err.message });
  }

  // 6. Assessment (Interview Readiness)
  try {
    const res = await post('/api/tools/interview-readiness', {
      track: 'Full Stack Engineer',
      experience_years: '3-5 years',
      technical_confidence: 4,
      system_design_confidence: 4,
      behavioral_confidence: 4,
      live_coding_experience: true,
      mock_interviews_done: 3,
    });
    results.push({
      route: 'assessment (POST /api/tools/interview-readiness)',
      status: res.status,
      success: res.data?.success === true,
      details: `Score: ${res.data?.data?.score}%, Status: ${res.data?.data?.status || 'Calculated'}`,
    });
  } catch (err) {
    results.push({ route: 'assessment', status: 'ERR', success: false, details: err.message });
  }

  console.table(results);

  const allPassed = results.every((r) => r.success);
  if (allPassed) {
    console.log('\n✅ ALL 6 MYSQL API ROUTES VERIFIED & FUNCTIONAL WITH ZERO FAILURES!');
  } else {
    console.log('\n❌ SOME ROUTES FAILED!');
    process.exit(1);
  }
}

runTests().catch(console.error);
