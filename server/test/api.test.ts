import { describe, it, expect } from 'vitest';
import request from 'supertest';

const API_BASE = 'http://localhost:5000';

describe('Codex Tech-IT API Comprehensive Test Suite', () => {
  // 1. Health & DB
  it('GET /api/health should return ok with database connected', async () => {
    const res = await request(API_BASE).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('ok');
    expect(res.body.data.database).toBe('connected');
  });

  // 2. Public Content Routes
  it('GET /api/courses should return active courses array', async () => {
    const res = await request(API_BASE).get('/api/courses');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(10);
  });

  it('GET /api/courses/:slug should return course details', async () => {
    const res = await request(API_BASE).get('/api/courses/java-full-stack');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.slug).toBe('java-full-stack');
    expect(res.body.data.curriculum).toBeDefined();
  });

  it('GET /api/jobs should return available career postings', async () => {
    const res = await request(API_BASE).get('/api/jobs');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('GET /api/stories should return candidate case studies', async () => {
    const res = await request(API_BASE).get('/api/stories');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(8);
  });

  it('GET /api/live-placements should return verified placement records', async () => {
    const res = await request(API_BASE).get('/api/live-placements');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(10);
  });

  it('GET /api/faqs should return at least 24 questions', async () => {
    const res = await request(API_BASE).get('/api/faqs');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(24);
  });

  it('GET /api/chat/answer?q=refund should match keyword answer', async () => {
    const res = await request(API_BASE).get('/api/chat/answer?q=refund');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.answer).toBeDefined();
    expect(res.body.data.answer.length).toBeGreaterThan(10);
  });

  // 3. Form Submissions
  it('POST /api/leads should validate and save lead with email log fallback', async () => {
    const res = await request(API_BASE)
      .post('/api/leads')
      .send({
        name: 'Automated Tester',
        email: `test_${Date.now()}@example.com`,
        phone: '+1 (555) 987-6543',
        country_code: '+1',
        current_role: 'QA Engineer',
        experience_level: '3-5 years',
        visa_status: 'US_CITIZEN_GC',
        service_interest: 'job-placement',
        consent: true,
      });

    expect([200, 201]).toContain(res.status);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBeDefined();
  });

  it('POST /api/leads should reject honeypot bots with 400', async () => {
    const res = await request(API_BASE)
      .post('/api/leads')
      .send({
        name: 'Spam Bot',
        email: 'bot@spam.com',
        phone: '1234567890',
        current_role: 'Spammer',
        experience_level: '1',
        service_interest: 'test',
        consent: true,
        honeypot: 'i-am-a-bot',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/contact should save contact message', async () => {
    const res = await request(API_BASE)
      .post('/api/contact')
      .send({
        name: 'Inquiry User',
        email: 'inquiry@example.com',
        phone: '+1 555 123 4567',
        subject: 'Corporate Staffing Inquiry',
        message: 'We are seeking 4 senior React developers for a 6-month contract assignment.',
      });

    expect([200, 201]).toContain(res.status);
    expect(res.body.success).toBe(true);
  });

  it('POST /api/subscribe should handle newsletter signups and duplicate gracefully', async () => {
    const email = `subscriber_${Date.now()}@example.com`;
    const res1 = await request(API_BASE).post('/api/subscribe').send({ email });
    expect([200, 201]).toContain(res1.status);
    expect(res1.body.success).toBe(true);

    // Duplicate should still return 200 without 500 error
    const res2 = await request(API_BASE).post('/api/subscribe').send({ email });
    expect([200, 201]).toContain(res2.status);
    expect(res2.body.success).toBe(true);
  });

  // 4. Tools Endpoints
  it('POST /api/tools/resume-analyzer should score sample resume and return ATS metrics', async () => {
    const res = await request(API_BASE)
      .post('/api/tools/resume-analyzer')
      .send({
        resume_text: `John Doe\nSoftware Engineer\nSummary: 5+ years experience developing Java microservices on AWS.\nSkills: Java, Spring Boot, React, SQL, Docker, Kubernetes.\nExperience:\nSenior Developer at Tech Corp: Implemented REST APIs improving latency by 35%.\nEducation: BS in Computer Science.`,
        target_role: 'Full Stack Engineer',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.score).toBeGreaterThanOrEqual(30);
    expect(res.body.data.breakdown).toBeDefined();
  });

  it('POST /api/tools/job-match should calculate match score percentage', async () => {
    const res = await request(API_BASE)
      .post('/api/tools/job-match')
      .send({
        resume_text: 'Proficient in Python, AWS, Docker, PostgreSQL, React, and CI/CD pipelines.',
        job_description: 'Looking for a Senior Python Developer with AWS, Docker, Kubernetes, and PostgreSQL experience.',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.matchPercentage).toBeGreaterThanOrEqual(50);
  });

  // 5. Admin Security & Authentication
  it('GET /api/admin/leads should block unauthenticated access with 401', async () => {
    const res = await request(API_BASE).get('/api/admin/leads');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/admin/login should fail with invalid credentials', async () => {
    const res = await request(API_BASE)
      .post('/api/admin/login')
      .send({
        email: 'admin@codextechit.com',
        password: 'WrongPassword123!',
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/admin/login should succeed with seed credentials and set auth cookie', async () => {
    const res = await request(API_BASE)
      .post('/api/admin/login')
      .send({
        email: 'admin@codextechit.com',
        password: 'CodexAdmin2026!',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe('admin@codextechit.com');

    // Cookie check
    const cookies = res.headers['set-cookie'];
    expect(cookies).toBeDefined();
  });
});
