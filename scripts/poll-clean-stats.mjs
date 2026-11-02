async function poll() {
  console.log('Polling Vercel for clean metrics...');
  for (let i = 1; i <= 20; i++) {
    try {
      const res = await fetch('https://codex-tech-4aic.vercel.app/api/admin/stats');
      const data = await res.json().catch(() => null);
      if (data && data.success && data.data && data.data.leads === 0 && data.data.recentLeads?.length === 0) {
        console.log('🎉 SUCCESS! All fake data has been purged from Vercel!');
        console.log('Live KPIs:', data.data.kpi);
        console.log('Recent Leads count:', data.data.recentLeads.length);
        return;
      }
      console.log(`[Attempt ${i}] Current leads: ${data?.data?.leads}`);
    } catch (e) {
      console.log(`[Attempt ${i}] Error:`, e.message);
    }
    await new Promise((r) => setTimeout(r, 4000));
  }
}
poll();

