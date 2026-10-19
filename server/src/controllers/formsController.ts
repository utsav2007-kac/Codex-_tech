import { Request, Response, NextFunction } from 'express';
import { prisma } from '../services/db';
import { sendEmail } from '../services/email';
import { config } from '../config';
import {
  consultationSchema,
  contactSchema,
  employerRequestSchema,
  applicationSchema,
  referralSchema,
  subscribeSchema,
  enrollmentSchema,
  webinarRegistrationSchema,
  gatedDownloadSchema,
  toolReportSchema,
} from '@codex/shared';

export const formsController = {
  // 1. Consultation / Lead Form
  async submitLead(req: Request, res: Response, next: NextFunction) {
    try {
      const data = consultationSchema.parse(req.body);

      const lead = await prisma.lead.create({
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          country_code: data.country_code,
          current_role: data.current_role,
          experience_level: data.experience_level,
          visa_status: data.visa_status,
          service_interest: data.service_interest,
          preferred_datetime: data.preferred_datetime || null,
          source: data.source || 'website',
          plan: data.plan || null,
          message: data.message || null,
          consent: data.consent,
          status: 'NEW',
        },
      });

      // Notify admin
      await sendEmail({
        to: config.notifyEmail,
        subject: `New Career Consultation: ${data.name} (${data.service_interest})`,
        html: `<h3>New Consultation Booking</h3>
               <p><strong>Name:</strong> ${data.name}</p>
               <p><strong>Email:</strong> ${data.email}</p>
               <p><strong>Phone:</strong> ${data.country_code} ${data.phone}</p>
               <p><strong>Current Role:</strong> ${data.current_role}</p>
               <p><strong>Experience:</strong> ${data.experience_level}</p>
               <p><strong>Visa Status:</strong> ${data.visa_status}</p>
               <p><strong>Service Interest:</strong> ${data.service_interest}</p>
               <p><strong>Selected Plan:</strong> ${data.plan || 'N/A'}</p>
               <p><strong>Preferred Time:</strong> ${data.preferred_datetime || 'ASAP'}</p>
               <p><strong>Message:</strong> ${data.message || 'None'}</p>`,
      });

      // User confirmation
      await sendEmail({
        to: data.email,
        subject: 'Your Free Consultation is Confirmed - Codex Tech-IT',
        html: `<p>Hi ${data.name},</p>
               <p>Thank you for booking a career consultation with Codex Tech-IT. We deliver jobs faster by aligning your technical positioning with high-growth employer demands.</p>
               <p>Our talent advisor will reach out within 24 business hours to schedule your strategy session.</p>
               <p>Best regards,<br/>The Codex Tech-IT Team</p>`,
      });

      res.status(201).json({
        success: true,
        data: {
          id: lead.id,
          message: 'Your consultation request has been received. Our team will contact you shortly.',
        },
      });
    } catch (err) {
      next(err);
    }
  },

  // 2. Contact Form
  async submitContact(req: Request, res: Response, next: NextFunction) {
    try {
      const data = contactSchema.parse(req.body);

      const contact = await prisma.contact.create({
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone || null,
          subject: data.subject,
          message: data.message,
          status: 'NEW',
        },
      });

      await sendEmail({
        to: config.notifyEmail,
        subject: `Contact Inquiry: ${data.subject} (${data.name})`,
        html: `<p><strong>Name:</strong> ${data.name}</p>
               <p><strong>Email:</strong> ${data.email}</p>
               <p><strong>Phone:</strong> ${data.phone || 'N/A'}</p>
               <p><strong>Subject:</strong> ${data.subject}</p>
               <p><strong>Message:</strong><br/>${data.message}</p>`,
      });

      res.status(201).json({
        success: true,
        data: { id: contact.id, message: 'Message sent successfully. We will reply promptly.' },
      });
    } catch (err) {
      next(err);
    }
  },

  // 3. Request Talent (Employer)
  async submitEmployerRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const data = employerRequestSchema.parse(req.body);

      const request = await prisma.employerRequest.create({
        data: {
          company: data.company,
          contact_person: data.contact_person,
          email: data.email,
          phone: data.phone,
          roles_needed: data.roles_needed,
          tech_stack: data.tech_stack,
          headcount: data.headcount,
          hiring_model: data.hiring_model,
          timeline: data.timeline,
          notes: data.notes || null,
          status: 'NEW',
        },
      });

      await sendEmail({
        to: config.notifyEmail,
        subject: `Employer Talent Request: ${data.company} (${data.roles_needed})`,
        html: `<p><strong>Company:</strong> ${data.company}</p>
               <p><strong>Contact:</strong> ${data.contact_person} (${data.email}, ${data.phone})</p>
               <p><strong>Roles Needed:</strong> ${data.roles_needed}</p>
               <p><strong>Tech Stack:</strong> ${data.tech_stack}</p>
               <p><strong>Headcount:</strong> ${data.headcount}</p>
               <p><strong>Hiring Model:</strong> ${data.hiring_model}</p>
               <p><strong>Timeline:</strong> ${data.timeline}</p>
               <p><strong>Notes:</strong> ${data.notes || 'N/A'}</p>`,
      });

      res.status(201).json({
        success: true,
        data: { id: request.id, message: 'Your talent inquiry has been received. Our account director will contact you within 4 hours.' },
      });
    } catch (err) {
      next(err);
    }
  },

  // 4. Job Application (Multipart)
  async submitApplication(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'FILE_REQUIRED',
            message: 'Please upload your resume in PDF, DOC, or DOCX format (Max 5MB).',
          },
        });
      }

      const data = applicationSchema.parse(req.body);

      const application = await prisma.application.create({
        data: {
          job_id: data.job_id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          linkedin_url: data.linkedin_url || null,
          resume_path: req.file.filename,
          resume_original_name: req.file.originalname,
          cover_note: data.cover_note || null,
          status: 'NEW',
        },
      });

      res.status(201).json({
        success: true,
        data: {
          id: application.id,
          message: 'Your application has been received successfully. Our recruiting team will review your qualifications.',
        },
      });
    } catch (err) {
      next(err);
    }
  },

  // 5. Refer & Earn
  async submitReferral(req: Request, res: Response, next: NextFunction) {
    try {
      const data = referralSchema.parse(req.body);

      const referral = await prisma.referral.create({
        data: {
          referrer_name: data.referrer_name,
          referrer_email: data.referrer_email,
          referrer_phone: data.referrer_phone,
          referee_name: data.referee_name,
          referee_email: data.referee_email,
          referee_phone: data.referee_phone,
          role_skill: data.role_skill,
          status: 'NEW',
        },
      });

      res.status(201).json({
        success: true,
        data: { id: referral.id, message: 'Referral submitted! Thank you for expanding the Codex talent network.' },
      });
    } catch (err) {
      next(err);
    }
  },

  // 6. Newsletter Subscription
  async submitSubscribe(req: Request, res: Response, next: NextFunction) {
    try {
      const data = subscribeSchema.parse(req.body);

      await prisma.subscriber.upsert({
        where: { email: data.email },
        update: { is_active: true },
        create: { email: data.email, is_active: true },
      });

      res.status(200).json({
        success: true,
        data: { message: 'You have been subscribed to Codex Tech-IT hiring & career insights.' },
      });
    } catch (err) {
      next(err);
    }
  },

  // 7. Course Enrollment
  async submitEnrollment(req: Request, res: Response, next: NextFunction) {
    try {
      const data = enrollmentSchema.parse(req.body);

      const enrollment = await prisma.enrollment.create({
        data: {
          course_id: data.course_id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          batch_pref: data.batch_pref,
          message: data.message || null,
          status: 'NEW',
        },
      });

      res.status(201).json({
        success: true,
        data: { id: enrollment.id, message: 'Enrollment confirmed! Our training coordinator will send batch details.' },
      });
    } catch (err) {
      next(err);
    }
  },

  // 8. Webinar Registration
  async submitWebinarRegistration(req: Request, res: Response, next: NextFunction) {
    try {
      const data = webinarRegistrationSchema.parse(req.body);

      const reg = await prisma.webinarRegistration.create({
        data: {
          webinar_id: data.webinar_id,
          name: data.name,
          email: data.email,
          phone: data.phone,
        },
      });

      res.status(201).json({
        success: true,
        data: { id: reg.id, message: 'You are registered! Check your inbox for the calendar invite and join link.' },
      });
    } catch (err) {
      next(err);
    }
  },

  // 9. Gated Resource Download
  async submitDownload(req: Request, res: Response, next: NextFunction) {
    try {
      const data = gatedDownloadSchema.parse(req.body);

      const download = await prisma.download.create({
        data: {
          resource_key: data.resource_key,
          name: data.name,
          email: data.email,
        },
      });

      res.status(201).json({
        success: true,
        data: {
          id: download.id,
          message: 'Access granted! Your download is starting.',
          downloadUrl: `/api/resources/file/${encodeURIComponent(data.resource_key)}`,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  // 10. Tool Report Email
  async submitToolReport(req: Request, res: Response, next: NextFunction) {
    try {
      const data = toolReportSchema.parse(req.body);

      const report = await prisma.toolReport.create({
        data: {
          tool: data.tool,
          name: data.name,
          email: data.email,
          score: data.score,
          report_json: data.report_json,
        },
      });

      await sendEmail({
        to: data.email,
        subject: `Your ${data.tool} Assessment Report - Codex Tech-IT (Score: ${data.score}/100)`,
        html: `<h3>Hello ${data.name},</h3>
               <p>Here is your ${data.tool} diagnostic evaluation report from Codex Tech-IT.</p>
               <p><strong>Overall Score:</strong> ${data.score}/100</p>
               <p>For custom coaching, visit <a href="${config.clientUrl}/services">Codex Tech-IT Services</a>.</p>`,
      });

      res.status(201).json({
        success: true,
        data: { id: report.id, message: 'Report generated and emailed successfully.' },
      });
    } catch (err) {
      next(err);
    }
  },
};
