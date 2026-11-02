async function poll() {
  console.log('Polling Vercel for real database synchronization...');
  for (let i = 1; i <= 20; i++) {
    try {
      const res = await fetch('https://codex-tech-4aic.vercel.app/api/admin/stats');
      const data = await res.json().catch(() => null);
      if (data && data.success && data.data && data.data.recentLeads?.length > 0 && data.data.recentLeads[0].name === 'test2') {
        console.log('\n🎉 SUCCESS! Real MySQL database records are 100% LIVE on Vercel Admin!');
        console.log('Top Lead Name:', data.data.recentLeads[0].name, 'Email:', data.data.recentLeads[0].email);
        console.log('Total Leads:', data.data.leads);
        console.log('Total Contacts:', data.data.contacts);
        console.log('Total Applications:', data.data.applications);
        return;
      }
      console.log(`[Attempt ${i}] Waiting for deployment... (top lead: ${data?.data?.recentLeads?.[0]?.name || 'none'})`);
    } catch (e) {
      console.log(`[Attempt ${i}] Error:`, e.message);
    }
    await new Promise((r) => setTimeout(r, 4000));
  }
}
poll();

