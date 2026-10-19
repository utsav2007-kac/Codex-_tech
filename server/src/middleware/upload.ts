import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadsDir = path.resolve(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `resume-${uniqueSuffix}${ext}`);
  },
});

const allowedMimes = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
];

const allowedExtensions = ['.pdf', '.doc', '.docx', '.txt'];

export const uploadResume = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowedExtensions.includes(ext) || !allowedMimes.includes(file.mimetype)) {
      return cb(new Error('Invalid file type. Only PDF, DOC, and DOCX files up to 5MB are permitted.'));
    }
    cb(null, true);
  },
});

// Storage abstraction interface for future S3/Cloudinary swapping
export const storageService = {
  getFilePath(filename: string): string {
    return path.join(uploadsDir, filename);
  },
  fileExists(filename: string): boolean {
    return fs.existsSync(path.join(uploadsDir, filename));
  },
  deleteFile(filename: string): void {
    const p = path.join(uploadsDir, filename);
    if (fs.existsSync(p)) {
      fs.unlinkSync(p);
    }
  },
};
