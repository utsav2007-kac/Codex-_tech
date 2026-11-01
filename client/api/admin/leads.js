export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const leads = [
    {
      id: 10,
      name: 'Utsav Kachhadiya',
      email: 'kachhadiyautsav13@gmail.com',
      phone: '+91 98765 43210',
      country_code: '+91',
      current_role: 'Full Stack Engineer',
      experience_level: 'MID (3-5 Years)',
      visa_status: 'US_CITIZEN_GC',
      service_interest: 'Direct Enterprise Placement',
      preferred_datetime: 'Immediate / ASAP',
      source: 'website_modal',
      message: 'Looking for senior React/Node full stack engineering opportunities.',
      status: 'NEW',
      created_at: '2026-11-01T11:28:56.000Z',
    },
    {
      id: 9,
      name: 'Sarah Connor',
      email: 'sarah.connor@example.com',
      phone: '+1 (555) 0199',
      country_code: '+1',
      current_role: 'Senior DevOps Architect',
      experience_level: 'SENIOR (5-8 Years)',
      visa_status: 'US_CITIZEN_GC',
      service_interest: 'DevOps & Cloud Pod',
      preferred_datetime: 'Weekdays 2:00 PM CST',
      source: 'website_modal',
      message: 'AWS Kubernetes migration experience with CI/CD optimization.',
      status: 'CONTACTED',
      created_at: '2026-10-31T14:21:00.000Z',
    },
    {
      id: 8,
      name: 'David Lee',
      email: 'david.lee@cloudsystems.io',
      phone: '+1 (469) 555-8912',
      country_code: '+1',
      current_role: 'Principal Java Architect',
      experience_level: 'DIRECTOR (8+ Years)',
      visa_status: 'H1B_TRANSFER',
      service_interest: 'Enterprise Staffing',
      preferred_datetime: 'Tomorrow Morning',
      source: 'website_modal',
      message: 'Distributed systems with Apache Kafka, Spring Boot microservices.',
      status: 'QUALIFIED',
      created_at: '2026-10-30T10:15:00.000Z',
    },
  ];

  return res.status(200).json({ success: true, data: leads });
}

