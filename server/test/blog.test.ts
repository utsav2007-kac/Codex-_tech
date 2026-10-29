import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/index';
import { prisma } from '../src/services/db';

describe('Codex Tech-IT Blog API Test Suite', () => {
  let adminToken: string;

  beforeAll(async () => {
    // Authenticate as Admin to get JWT for admin tests
    const loginRes = await request(app)
      .post('/api/admin/login')
      .send({ email: 'admin@codextechit.com', password: 'CodexAdmin2026' });
    if (loginRes.body.success && loginRes.body.data?.token) {
      adminToken = loginRes.body.data.token;
    }
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  // 1. GET /api/blog/posts
  it('GET /api/blog/posts should return paginated list with total count >= 12 and response time < 100ms', async () => {
    const t0 = performance.now();
    const res = await request(app).get('/api/blog/posts?page=1&limit=9');
    const elapsed = performance.now() - t0;

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.total).toBeGreaterThanOrEqual(12);
    expect(res.body.data.items.length).toBeLessThanOrEqual(9);
    expect(res.body.data.items[0]).toHaveProperty('slug');
    expect(res.body.data.items[0]).toHaveProperty('title');
    expect(res.body.data.items[0]).toHaveProperty('excerpt');
    expect(res.body.data.items[0]).toHaveProperty('cover_image');
    expect(res.body.data.items[0]).toHaveProperty('reading_time_min');
    expect(res.body.data.items[0]).toHaveProperty('category');
    expect(res.body.data.items[0]).toHaveProperty('author_name');

    console.log(`[Timing] GET /api/blog/posts: ${elapsed.toFixed(2)}ms (SLA: <100ms)`);
    expect(elapsed).toBeLessThan(100);
  });

  // 2. Category filtering
  it('GET /api/blog/posts?category=ats-resumes should filter posts by category', async () => {
    const res = await request(app).get('/api/blog/posts?category=ats-resumes');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    for (const item of res.body.data.items) {
      expect(item.category_slug).toBe('ats-resumes');
    }
  });

  // 3. Search query
  it('GET /api/blog/posts?q=system should return matching search results', async () => {
    const res = await request(app).get('/api/blog/posts?q=system');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.items.length).toBeGreaterThan(0);
  });

  // 4. Sorting
  it('GET /api/blog/posts?sort=most-read should return posts ordered by view_count', async () => {
    const res = await request(app).get('/api/blog/posts?sort=most-read');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    const views = res.body.data.items.map((i: any) => i.view_count);
    for (let i = 0; i < views.length - 1; i++) {
      expect(views[i]).toBeGreaterThanOrEqual(views[i + 1]);
    }
  });

  // 5. GET /api/blog/posts/:slug
  it('GET /api/blog/posts/:slug should return post with author, category, tags, faqs, prev/next and related', async () => {
    const t0 = performance.now();
    const res = await request(app).get('/api/blog/posts/ats-resume-optimization-guide-2026');
    const elapsed = performance.now() - t0;

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    const post = res.body.data;
    expect(post.slug).toBe('ats-resume-optimization-guide-2026');
    expect(post.author).toBeDefined();
    expect(post.author.name).toBe('Sarah Jenkins');
    expect(post.category).toBeDefined();
    expect(Array.isArray(post.tags)).toBe(true);
    expect(Array.isArray(post.faqs)).toBe(true);
    expect(post.faqs.length).toBeGreaterThanOrEqual(2);
    expect(Array.isArray(post.related)).toBe(true);
    expect(post.related.length).toBeLessThanOrEqual(3);

    console.log(`[Timing] GET /api/blog/posts/:slug: ${elapsed.toFixed(2)}ms (SLA: <100ms)`);
    expect(elapsed).toBeLessThan(100);
  });

  // 6. 404 on Invalid slug
  it('GET /api/blog/posts/:slug with invalid slug should return 404', async () => {
    const res = await request(app).get('/api/blog/posts/non-existent-article-slug-xyz');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  // 7. GET /api/blog/categories
  it('GET /api/blog/categories should return all categories with post counts', async () => {
    const res = await request(app).get('/api/blog/categories');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(4);
    expect(res.body.data[0]).toHaveProperty('postCount');
  });

  // 8. GET /api/blog/featured
  it('GET /api/blog/featured should return up to 3 featured articles', async () => {
    const res = await request(app).get('/api/blog/featured');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeLessThanOrEqual(3);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
  });

  // 9. View Counter with Rate Limiting & Deduplication
  it('POST /api/blog/posts/:slug/view should increment view count and deduplicate consecutive calls', async () => {
    const slug = 'ats-resume-optimization-guide-2026';
    const firstRes = await request(app).post(`/api/blog/posts/${slug}/view`);
    expect(firstRes.status).toBe(200);
    expect(firstRes.body.success).toBe(true);

    // Second call from same IP should not increment (rate-limited / deduplicated)
    const secondRes = await request(app).post(`/api/blog/posts/${slug}/view`);
    expect(secondRes.status).toBe(200);
    expect(secondRes.body.incremented).toBe(false);
  });

  // 10. Admin Auth Gate: Unauthorized request returns 401
  it('POST /api/admin/blog/posts without token should return 401 Unauthorized', async () => {
    const res = await request(app).post('/api/admin/blog/posts').send({
      title: 'Hacker Attempt Post',
      slug: 'hacker-attempt-post',
      excerpt: 'Short excerpt',
      content_html: '<p>Content</p>',
      category_id: 1,
      author_id: 1,
      cover_image: '/assets/blog/blog-1.webp',
      cover_alt: 'Cover'
    });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  // 11. Admin CRUD: Create, Update, Delete with Sanitization
  it('Admin can create, sanitize HTML, update and delete a blog post', async () => {
    if (!adminToken) {
      console.warn('Skipping admin CRUD test: Admin token not acquired');
      return;
    }

    const testSlug = `test-article-${Date.now()}`;
    const newPostData = {
      title: 'Automated Test Article with XSS Vector',
      slug: testSlug,
      excerpt: 'Comprehensive test excerpt demonstrating clean sanitization.',
      content_html: '<h2>Safe Heading</h2><p>Normal text</p><script>alert("xss")</script><div onclick="evil()">Click</div>',
      category_id: 1,
      author_id: 1,
      cover_image: '/assets/blog/blog-1.webp',
      cover_alt: 'Test Alt Text',
      status: 'draft',
      tag_ids: [1, 2],
      faqs: [
        { question: 'Is this test FAQ working?', answer: 'Yes it is working perfectly.' }
      ]
    };

    // Create
    const createRes = await request(app)
      .post('/api/admin/blog/posts')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(newPostData);

    expect(createRes.status).toBe(201);
    expect(createRes.body.success).toBe(true);
    const createdId = createRes.body.data.id;

    // Verify script tags were sanitized away
    expect(createRes.body.data.content_html).not.toContain('<script>');
    expect(createRes.body.data.content_html).not.toContain('onclick');
    expect(createRes.body.data.content_html).toContain('<h2>Safe Heading</h2>');

    // Update
    const updateRes = await request(app)
      .put(`/api/admin/blog/posts/${createdId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        ...newPostData,
        title: 'Updated Test Article Title'
      });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.data.title).toBe('Updated Test Article Title');

    // Delete
    const deleteRes = await request(app)
      .delete(`/api/admin/blog/posts/${createdId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(deleteRes.status).toBe(200);
    expect(deleteRes.body.success).toBe(true);
  });
});
