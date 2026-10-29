import { Router } from 'express';
import { publicController } from '../controllers/publicController';
import { formsController } from '../controllers/formsController';
import { toolsController } from '../controllers/toolsController';
import { adminController } from '../controllers/adminController';
import { blogController } from '../controllers/blogController';
import { requireAdminAuth } from '../middleware/auth';
import { formLimiter, loginLimiter } from '../middleware/rateLimit';
import { uploadResume, uploadBlogImage } from '../middleware/upload';

const router = Router();

// --- PUBLIC BLOG ENDPOINTS ---
router.get('/blog/posts', blogController.getPosts);
router.get('/blog/posts/:slug', blogController.getPostBySlug);
router.get('/blog/categories', blogController.getCategories);
router.get('/blog/featured', blogController.getFeatured);
router.post('/blog/posts/:slug/view', blogController.recordPostView);

// --- PUBLIC READ ENDPOINTS ---
router.get('/health', publicController.health);
router.get('/posts', publicController.getPosts);
router.get('/posts/:slug', publicController.getPostBySlug);
router.get('/jobs', publicController.getJobs);
router.get('/jobs/:slug', publicController.getJobBySlug);
router.get('/courses', publicController.getCourses);
router.get('/courses/:slug', publicController.getCourseBySlug);
router.get('/stories', publicController.getStories);
router.get('/stories/:slug', publicController.getStoryBySlug);
router.get('/live-placements', publicController.getLivePlacements);
router.get('/faqs', publicController.getFaqs);
router.get('/testimonials', publicController.getTestimonials);
router.get('/webinars', publicController.getWebinars);
router.get('/interview-questions', publicController.getInterviewQuestions);
router.get('/settings/public', publicController.getPublicSettings);
router.get('/chat/answer', publicController.getChatAnswer);

// --- PUBLIC FORM SUBMISSION ENDPOINTS ---
router.post('/leads', formLimiter, formsController.submitLead);
router.post('/contact', formLimiter, formsController.submitContact);
router.post('/employer-requests', formLimiter, formsController.submitEmployerRequest);
router.post('/applications', formLimiter, uploadResume.single('resume'), formsController.submitApplication);
router.post('/referrals', formLimiter, formsController.submitReferral);
router.post('/subscribe', formLimiter, formsController.submitSubscribe);
router.post('/enrollments', formLimiter, formsController.submitEnrollment);
router.post('/webinar-registrations', formLimiter, formsController.submitWebinarRegistration);
router.post('/downloads', formLimiter, formsController.submitDownload);
router.post('/tools/email-report', formLimiter, formsController.submitToolReport);

// --- TOOLS ENDPOINTS ---
router.post('/tools/resume-analyzer', uploadResume.single('resume'), toolsController.analyzeResumeHandler);
router.post('/tools/linkedin-analyzer', toolsController.analyzeLinkedInHandler);
router.post('/tools/job-match', toolsController.matchJobHandler);
router.post('/tools/interview-readiness', toolsController.evaluateReadinessHandler);

// --- ADMIN AUTH & CONTROL ---
router.post('/admin/login', loginLimiter, adminController.login);
router.post('/admin/logout', adminController.logout);
router.get('/admin/me', requireAdminAuth, adminController.getMe);
router.get('/admin/stats', requireAdminAuth, adminController.getStats);
router.get('/admin/submissions/:type', requireAdminAuth, adminController.getSubmissions);
router.patch('/admin/submissions/:type/:id/status', requireAdminAuth, adminController.updateStatus);
router.put('/admin/submissions/:type/:id/status', requireAdminAuth, adminController.updateStatus);
router.delete('/admin/submissions/:type/:id', requireAdminAuth, adminController.deleteSubmission);

// Direct aliases for submissions
router.get('/admin/:type(leads|contacts|employer-requests|applications|referrals|subscribers|enrollments|tool-reports|downloads)', requireAdminAuth, adminController.getSubmissions);
router.patch('/admin/:type(leads|contacts|employer-requests|applications|referrals|subscribers|enrollments)/:id/status', requireAdminAuth, adminController.updateStatus);
router.put('/admin/:type(leads|contacts|employer-requests|applications|referrals|subscribers|enrollments)/:id/status', requireAdminAuth, adminController.updateStatus);
router.delete('/admin/:type(leads|contacts|employer-requests|applications|referrals|subscribers|enrollments)/:id', requireAdminAuth, adminController.deleteSubmission);

// Content management CRUD routes
router.post('/admin/:model(jobs|stories|live-placements|faqs|testimonials)', requireAdminAuth, adminController.createContentItem);
router.put('/admin/:model(jobs|stories|live-placements|faqs|testimonials)/:id', requireAdminAuth, adminController.updateContentItem);
router.patch('/admin/:model(jobs|stories|live-placements|faqs|testimonials)/:id/status', requireAdminAuth, adminController.toggleContentStatus);
router.delete('/admin/:model(posts|jobs|courses|stories|live-placements|faqs|testimonials)/:id', requireAdminAuth, adminController.deleteContentItem);

router.get('/admin/export/:type', requireAdminAuth, adminController.exportCsv);
router.get('/admin/resume/:id', requireAdminAuth, adminController.downloadResume);
router.get('/admin/settings', requireAdminAuth, adminController.getSettings);
router.put('/admin/settings', requireAdminAuth, adminController.updateSettings);

// --- ADMIN BLOG MANAGEMENT ---
router.get('/admin/blog/posts', requireAdminAuth, blogController.adminGetPosts);
router.get('/admin/blog/posts/:id', requireAdminAuth, blogController.adminGetPost);
router.post('/admin/blog/posts', requireAdminAuth, blogController.adminCreatePost);
router.put('/admin/blog/posts/:id', requireAdminAuth, blogController.adminUpdatePost);
router.delete('/admin/blog/posts/:id', requireAdminAuth, blogController.adminDeletePost);
router.patch('/admin/blog/posts/:id/status', requireAdminAuth, blogController.adminUpdateStatus);
router.post('/admin/blog/upload-image', requireAdminAuth, uploadBlogImage.single('image'), blogController.adminUploadImage);
router.get('/admin/blog/meta', requireAdminAuth, blogController.adminGetMeta);

export default router;
