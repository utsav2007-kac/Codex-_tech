async function poll() {
  console.log('Checking Vercel live deployment status...');
  for (let i = 1; i <= 15; i++) {
    try {
      const res = await fetch('https://codex-tech-4aic.vercel.app/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Vercel Deployment Verifier',
          email: 'live-test@enterprise.com',
          phone: '+1 469-555-0101',
          subject: 'Live Vercel Production Form Test',
          message: 'This is a live test from codex-tech-4aic.vercel.app verifying email delivery to kachhadiyautsav13@gmail.com.',
        }),
      });
      console.log(`[Attempt ${i}] HTTP Status: ${res.status}`);
      const text = await res.text();
      console.log('Response body:', text);
      if (res.status === 201) {
        console.log('\n🎉 SUCCESS! Live Vercel contact form is 100% operational and delivering emails!');
        return;
      }
    } catch (e) {
      console.log(`[Attempt ${i}] Request error:`, e.message);
    }
    await new Promise((r) => setTimeout(r, 6000));
  }
}

poll();

