export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const kpiData = {
    totalLeads: 10,
    newLeads: 4,
    totalContacts: 23,
    totalEmployerRequests: 5,
    totalApplications: 12,
    totalSubscribers: 156,
    totalEnrollments: 14,
    totalStories: 6,
    totalLivePlacements: 14,
    totalReferrals: 9,
  };

  const recentLeads = [
    {
      id: 10,
      name: 'Utsav Kachhadiya',
      email: 'kachhadiyautsav13@gmail.com',
      phone: '+91 98765 43210',
      current_role: 'Full Stack Engineer',
      experience_level: 'MID (3-5 Years)',
      visa_status: 'US_CITIZEN_GC',
      service_interest: 'Direct Enterprise Placement',
      preferred_datetime: 'Immediate / ASAP',
      status: 'NEW',
      created_at: '2026-11-01T11:28:56.000Z',
    },
    {
      id: 9,
      name: 'Sarah Connor',
      email: 'sarah.connor@example.com',
      phone: '+1 (555) 0199',
      current_role: 'Senior DevOps Architect',
      experience_level: 'SENIOR (5-8 Years)',
      visa_status: 'US_CITIZEN_GC',
      service_interest: 'DevOps & Cloud Pod',
      preferred_datetime: 'Weekdays 2:00 PM CST',
      status: 'CONTACTED',
      created_at: '2026-10-31T14:21:00.000Z',
    },
    {
      id: 8,
      name: 'David Lee',
      email: 'david.lee@cloudsystems.io',
      phone: '+1 (469) 555-8912',
      current_role: 'Principal Java Architect',
      experience_level: 'DIRECTOR (8+ Years)',
      visa_status: 'H1B_TRANSFER',
      service_interest: 'Enterprise Staffing',
      preferred_datetime: 'Tomorrow Morning',
      status: 'QUALIFIED',
      created_at: '2026-10-30T10:15:00.000Z',
    },
    {
      id: 7,
      name: 'Priya Patel',
      email: 'priya.patel@techsolutions.com',
      phone: '+1 (555) 234-5678',
      current_role: 'Data Engineering Lead',
      experience_level: 'SENIOR (5-8 Years)',
      visa_status: 'OPT_STEM',
      service_interest: 'Data Engineering Pod',
      preferred_datetime: 'Evenings CST',
      status: 'NEW',
      created_at: '2026-10-29T16:45:00.000Z',
    },
    {
      id: 6,
      name: 'Michael Roberts',
      email: 'm.roberts@enterprise.io',
      phone: '+1 (555) 789-0123',
      current_role: 'Site Reliability Engineer',
      experience_level: 'MID (3-5 Years)',
      visa_status: 'US_CITIZEN_GC',
      service_interest: 'Direct Placement',
      preferred_datetime: 'Flexible',
      status: 'CONTACTED',
      created_at: '2026-10-28T09:30:00.000Z',
    },
  ];

  const recentApplications = [
    {
      id: 2,
      name: 'Utsav Kachhadiya',
      email: 'kachhadiyautsav13@gmail.com',
      phone: '+91 98765 43210',
      job: {
        title: 'Lead AWS Cloud Solutions Architect',
      },
      status: 'NEW',
      created_at: '2026-10-31T14:17:33.000Z',
    },
    {
      id: 1,
      name: 'Alex Morgan',
      email: 'alex.morgan@cloudarch.io',
      phone: '+1 (555) 349-2810',
      job: {
        title: 'Lead AWS Cloud Solutions Architect',
      },
      status: 'INTERVIEWING',
      created_at: '2026-10-26T13:02:20.000Z',
    },
  ];

  return res.status(200).json({
    success: true,
    data: {
      kpi: kpiData,
      leads: kpiData.totalLeads,
      new_leads: kpiData.newLeads,
      contacts: kpiData.totalContacts,
      employer_requests: kpiData.totalEmployerRequests,
      applications: kpiData.totalApplications,
      subscribers: kpiData.totalSubscribers,
      enrollments: kpiData.totalEnrollments,
      stories: kpiData.totalStories,
      live_placements: kpiData.totalLivePlacements,
      referrals: kpiData.totalReferrals,
      recentLeads,
      recentApplications,
    },
  });
}
