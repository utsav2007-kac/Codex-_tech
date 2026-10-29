import { z } from 'zod';

export const VisaStatusEnum = z.enum(['F1', 'H1B_H4', 'US_CITIZEN_GC', 'OTHER', 'NA']);
export type VisaStatus = z.infer<typeof VisaStatusEnum>;

export const LeadStatusEnum = z.enum(['NEW', 'CONTACTED', 'CLOSED']);
export type LeadStatus = z.infer<typeof LeadStatusEnum>;

export const ToolTypeEnum = z.enum(['RESUME', 'LINKEDIN', 'MATCH', 'READINESS']);
export type ToolType = z.infer<typeof ToolTypeEnum>;

// 1. Consultation / Lead Form Schema
export const consultationSchema = z.object({
  name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(7, 'Please provide a valid phone number'),
  country_code: z.string().default('+1'),
  current_role: z.string().min(2, 'Current role or target field is required'),
  experience_level: z.string().min(1, 'Please select your experience level'),
  visa_status: VisaStatusEnum.default('NA'),
  service_interest: z.string().min(2, 'Please select a service of interest'),
  preferred_datetime: z.string().optional().default(''),
  source: z.string().optional().default('website'),
  plan: z.string().optional().default(''),
  message: z.string().optional().default(''),
  consent: z.boolean().refine((val) => val === true, 'You must agree to the privacy policy and consent to be contacted'),
  honeypot: z.string().max(0, 'Spam detected').optional().default(''),
});
export type ConsultationInput = z.infer<typeof consultationSchema>;

// 2. Contact Form Schema
export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional().default(''),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  honeypot: z.string().max(0, 'Spam detected').optional().default(''),
});
export type ContactInput = z.infer<typeof contactSchema>;

// 3. Employer Request Schema
export const employerRequestSchema = z.object({
  company: z.string().min(2, 'Company name is required'),
  contact_person: z.string().min(2, 'Contact person name is required'),
  email: z.string().email('Valid business email is required'),
  phone: z.string().min(7, 'Phone number is required'),
  roles_needed: z.string().min(2, 'Roles needed is required'),
  tech_stack: z.string().min(2, 'Target technical stack is required'),
  headcount: z.string().min(1, 'Headcount estimate is required'),
  hiring_model: z.string().min(2, 'Hiring model is required (Contract, Full-time, etc.)'),
  timeline: z.string().min(2, 'Target hiring timeline is required'),
  notes: z.string().optional().default(''),
  honeypot: z.string().max(0, 'Spam detected').optional().default(''),
});
export type EmployerRequestInput = z.infer<typeof employerRequestSchema>;

// 4. Job Application Schema (Fields accompanying resume)
export const applicationSchema = z.object({
  job_id: z.coerce.number().int().positive('Valid job opening ID is required'),
  name: z.string().min(2, 'Full name is required'),
  email: z.string().email('Valid email address is required'),
  phone: z.string().min(7, 'Valid phone number is required'),
  linkedin_url: z.string().url('Valid LinkedIn URL is required').optional().or(z.literal('')),
  cover_note: z.string().optional().default(''),
  honeypot: z.string().max(0, 'Spam detected').optional().default(''),
});
export type ApplicationInput = z.infer<typeof applicationSchema>;

// 5. Refer & Earn Schema
export const referralSchema = z.object({
  referrer_name: z.string().min(2, 'Your name is required'),
  referrer_email: z.string().email('Your valid email is required'),
  referrer_phone: z.string().min(7, 'Your phone number is required'),
  referee_name: z.string().min(2, "Candidate's name is required"),
  referee_email: z.string().email("Candidate's valid email is required"),
  referee_phone: z.string().min(7, "Candidate's phone number is required"),
  role_skill: z.string().min(2, 'Target role or skills are required'),
  honeypot: z.string().max(0, 'Spam detected').optional().default(''),
});
export type ReferralInput = z.infer<typeof referralSchema>;

// 6. Newsletter Subscription Schema
export const subscribeSchema = z.object({
  email: z.string().email('Valid email is required'),
  honeypot: z.string().max(0, 'Spam detected').optional().default(''),
});
export type SubscribeInput = z.infer<typeof subscribeSchema>;

// 7. Course Enrollment Schema
export const enrollmentSchema = z.object({
  course_id: z.coerce.number().int().positive('Valid course ID is required'),
  name: z.string().min(2, 'Full name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(7, 'Valid phone number is required'),
  batch_pref: z.string().min(2, 'Preferred batch timing is required'),
  message: z.string().optional().default(''),
  honeypot: z.string().max(0, 'Spam detected').optional().default(''),
});
export type EnrollmentInput = z.infer<typeof enrollmentSchema>;

// 8. Webinar Registration Schema
export const webinarRegistrationSchema = z.object({
  webinar_id: z.coerce.number().int().positive('Valid webinar ID is required'),
  name: z.string().min(2, 'Full name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(7, 'Valid phone number is required'),
  honeypot: z.string().max(0, 'Spam detected').optional().default(''),
});
export type WebinarRegistrationInput = z.infer<typeof webinarRegistrationSchema>;

// 9. Gated Download Schema
export const gatedDownloadSchema = z.object({
  resource_key: z.string().min(2, 'Resource key is required'),
  name: z.string().min(2, 'Full name is required'),
  email: z.string().email('Valid email is required'),
  honeypot: z.string().max(0, 'Spam detected').optional().default(''),
});
export type GatedDownloadInput = z.infer<typeof gatedDownloadSchema>;

// 10. Tool Report Schema
export const toolReportSchema = z.object({
  tool: ToolTypeEnum,
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  score: z.number().int().min(0).max(100),
  report_json: z.record(z.any()),
  honeypot: z.string().max(0, 'Spam detected').optional().default(''),
});
export type ToolReportInput = z.infer<typeof toolReportSchema>;

// 11. Admin Login Schema
export const adminLoginSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
export type AdminLoginInput = z.infer<typeof adminLoginSchema>;

// 12. Tools Input Schemas
export const resumeAnalyzeSchema = z.object({
  resume_text: z.string().min(50, 'Resume text or parsed content must be at least 50 characters').optional(),
  target_role: z.string().optional().default('Software Engineer'),
});
export type ResumeAnalyzeInput = z.infer<typeof resumeAnalyzeSchema>;

export const linkedInAnalyzeSchema = z.object({
  headline: z.string().min(5, 'Headline must be at least 5 characters'),
  about: z.string().min(20, 'About summary must be at least 20 characters'),
  skills: z.string().min(3, 'At least 1-2 skills are required'),
  target_role: z.string().optional().default('Full Stack Engineer'),
});
export type LinkedInAnalyzeInput = z.infer<typeof linkedInAnalyzeSchema>;

export const jobMatchSchema = z.object({
  resume_text: z.string().min(50, 'Resume content must be at least 50 characters'),
  job_description: z.string().min(50, 'Job description must be at least 50 characters'),
});
export type JobMatchInput = z.infer<typeof jobMatchSchema>;

export const interviewReadinessSchema = z.object({
  track: z.string().min(2, 'Career track is required'),
  experience_years: z.string().min(1, 'Experience level is required'),
  technical_confidence: z.number().min(1).max(5),
  system_design_confidence: z.number().min(1).max(5),
  behavioral_confidence: z.number().min(1).max(5),
  live_coding_experience: z.boolean(),
  mock_interviews_done: z.number().min(0),
});
export type InterviewReadinessInput = z.infer<typeof interviewReadinessSchema>;

// 13. Blog Schemas
export const blogPostInputSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  slug: z.string().min(2, 'Slug is required'),
  excerpt: z.string().min(10, 'Excerpt must be at least 10 characters'),
  content_markdown: z.string().optional(),
  content_html: z.string().min(20, 'Content HTML must be at least 20 characters'),
  category_id: z.number().int().positive().optional().nullable(),
  category: z.string().optional(),
  author_id: z.number().int().positive().optional().nullable(),
  cover_image: z.string().min(1, 'Cover image URL is required'),
  cover_alt: z.string().optional().default(''),
  canonical_url: z.string().url().optional().or(z.literal('')).nullable(),
  meta_title: z.string().optional().nullable(),
  meta_description: z.string().optional().nullable(),
  reading_time_min: z.number().int().min(1).default(5),
  status: z.enum(['draft', 'published', 'scheduled', 'archived', 'DRAFT', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED']).default('draft'),
  published_at: z.string().or(z.date()).optional().nullable(),
  scheduled_for: z.string().or(z.date()).optional().nullable(),
  featured: z.boolean().or(z.number()).optional().default(false),
  seo_title: z.string().optional().nullable(),
  seo_description: z.string().optional().nullable(),
  og_image: z.string().optional().nullable(),
  tag_ids: z.array(z.number().int()).optional().default([]),
  tags: z.array(z.any()).optional().default([]),
  faqs: z.array(z.object({
    question: z.string().min(3),
    answer: z.string().min(5),
    sort_order: z.number().optional()
  })).optional().default([]),
});
export type BlogPostInput = z.infer<typeof blogPostInputSchema>;

export const blogQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(9),
  category: z.string().optional(),
  tag: z.string().optional(),
  q: z.string().optional(),
  sort: z.string().optional(),
  status: z.enum(['draft', 'published', 'scheduled', 'archived', 'all', 'DRAFT', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED', 'ALL']).optional(),
  sortBy: z.enum(['published_at', 'views_count', 'title']).default('published_at'),
  order: z.enum(['asc', 'desc']).default('desc'),
});
export type BlogQueryInput = z.infer<typeof blogQuerySchema>;

