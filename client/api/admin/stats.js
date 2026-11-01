export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  return res.status(200).json({
    success: true,
    data: {
      totalLeads: 28,
      newLeads: 9,
      totalContacts: 22,
      totalEmployerRequests: 6,
      totalApplications: 45,
      totalSubscribers: 164,
      totalEnrollments: 14,
      totalStories: 6,
      totalLivePlacements: 14,
      totalReferrals: 11,
    },
  });
}

