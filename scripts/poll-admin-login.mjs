async function pollLogin() {
  console.log('Polling Vercel deployment for /api/admin/login...');
  for (let i = 1; i <= 20; i++) {
    try {
      const res = await fetch('https://codex-tech-4aic.vercel.app/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'admin@codex.com',
          password: 'admin@123',
        }),
      });
      console.log(`[Attempt ${i}] Status: ${res.status}`);
      const data = await res.json().catch(() => null);
      if (data) {
        console.log('Response JSON:', data);
      } else {
        const text = await res.text().catch(() => '');
        console.log('Response Text:', text.slice(0, 100));
      }

      if (res.status === 200 && data?.success && data?.data?.token) {
        console.log('\n🎉 SUCCESS! Live Vercel Admin Login is 100% OPERATIONAL!');
        console.log('Admin User:', data.data.user);
        return;
      }
    } catch (e) {
      console.log(`[Attempt ${i}] Error:`, e.message);
    }
    await new Promise((r) => setTimeout(r, 5000));
  }
}

pollLogin();

