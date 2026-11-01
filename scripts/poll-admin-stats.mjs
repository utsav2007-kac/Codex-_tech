async function pollStats() {
  console.log('Polling Vercel deployment for /api/admin/stats...');
  for (let i = 1; i <= 20; i++) {
    try {
      const res = await fetch('https://codex-tech-4aic.vercel.app/api/admin/stats');
      console.log(`[Attempt ${i}] Status: ${res.status}`);
      const data = await res.json().catch(() => null);
      if (data && data.success && data.data && data.data.leads > 0) {
        console.log('\n🎉 SUCCESS! Live Vercel Admin Stats are 100% POPULATED!');
        console.log('KPI Leads:', data.data.leads);
        console.log('Recent Leads count:', data.data.recentLeads?.length);
        return;
      }
    } catch (e) {
      console.log(`[Attempt ${i}] Error:`, e.message);
    }
    await new Promise((r) => setTimeout(r, 4000));
  }
}

pollStats();

