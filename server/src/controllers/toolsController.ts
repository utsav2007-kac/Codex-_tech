import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import {
  analyzeResume,
  analyzeLinkedIn,
  calculateJobMatch,
  evaluateInterviewReadiness,
} from '../services/toolEngines';
import {
  resumeAnalyzeSchema,
  linkedInAnalyzeSchema,
  jobMatchSchema,
  interviewReadinessSchema,
} from '@codex/shared';

export const toolsController = {
  // 1. Resume Analyzer
  async analyzeResumeHandler(req: Request, res: Response, next: NextFunction) {
    try {
      let resumeText = '';
      const targetRole = (req.body.target_role as string) || 'Software Engineer';

      if (req.file) {
        const fileBuffer = fs.readFileSync(req.file.path);
        const mime = req.file.mimetype;
        const ext = req.file.originalname.toLowerCase();

        if (mime === 'application/pdf' || ext.endsWith('.pdf')) {
          const parsed = await pdfParse(fileBuffer);
          resumeText = parsed.text;
        } else if (
          mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
          ext.endsWith('.docx')
        ) {
          const parsed = await mammoth.extractRawText({ buffer: fileBuffer });
          resumeText = parsed.value;
        } else if (mime === 'text/plain' || ext.endsWith('.txt')) {
          resumeText = fileBuffer.toString('utf-8');
        } else {
          resumeText = fileBuffer.toString('utf-8');
        }

        // Clean up temporary upload if not keeping as permanent application
        try {
          fs.unlinkSync(req.file.path);
        } catch (e) {
          // ignore
        }
      } else if (req.body.resume_text) {
        resumeText = req.body.resume_text;
      }

      if (!resumeText || resumeText.trim().length < 40) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'CONTENT_TOO_SHORT',
            message: 'Resume content was empty or unreadable. Please paste resume text directly or upload an unscanned PDF/DOCX.',
          },
        });
      }

      const report = analyzeResume(resumeText, targetRole);
      res.json({ success: true, data: report });
    } catch (err: any) {
      next(err);
    }
  },

  // 2. LinkedIn Analyzer
  async analyzeLinkedInHandler(req: Request, res: Response, next: NextFunction) {
    try {
      const data = linkedInAnalyzeSchema.parse(req.body);
      const report = analyzeLinkedIn(data.headline, data.about, data.skills, data.target_role);
      res.json({ success: true, data: report });
    } catch (err) {
      next(err);
    }
  },

  // 3. Job Match Score
  async matchJobHandler(req: Request, res: Response, next: NextFunction) {
    try {
      const data = jobMatchSchema.parse(req.body);
      const report = calculateJobMatch(data.resume_text, data.job_description);
      res.json({ success: true, data: report });
    } catch (err) {
      next(err);
    }
  },

  // 4. Interview Readiness Assessment
  async evaluateReadinessHandler(req: Request, res: Response, next: NextFunction) {
    try {
      const data = interviewReadinessSchema.parse(req.body);
      const report = evaluateInterviewReadiness(data);
      res.json({ success: true, data: report });
    } catch (err) {
      next(err);
    }
  },
};
