const http = require('http');

async function testAdminStats() {
  // 1. Login to get cookie/token
  const loginData = JSON.stringify({
    email: 'admin@codex.com',
    password: 'admin@123'
  });

  const req = http.request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(loginData)
    }
  }, (res) => {
    let body = '';
    const cookie = res.headers['set-cookie'];
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
      console.log('Login status:', res.statusCode);
      const parsed = JSON.parse(body);
      const token = parsed.data?.token || parsed.token;
      console.log('Login success:', parsed.success);

      // 2. Fetch /api/admin/stats
      const authHeader = token ? { 'Authorization': `Bearer ${token}` } : {};
      const cookieHeader = cookie ? { 'Cookie': cookie.join('; ') } : {};
      
      const statsReq = http.request({
        hostname: 'localhost',
        port: 5000,
        path: '/api/admin/stats',
        method: 'GET',
        headers: {
          ...authHeader,
          ...cookieHeader
        }
      }, (statsRes) => {
        let statsBody = '';
        statsRes.on('data', c => statsBody += c);
        statsRes.on('end', () => {
          console.log('Stats status:', statsRes.statusCode);
          console.log('Stats body:', JSON.stringify(JSON.parse(statsBody), null, 2));
        });
      });
      statsReq.end();
    });
  });

  req.write(loginData);
  req.end();
}

testAdminStats();
