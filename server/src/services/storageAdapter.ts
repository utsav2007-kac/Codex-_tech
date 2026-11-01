import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

export interface UploadedFileResult {
  url: string;
  filename: string;
  width: number;
  height: number;
  bytes: number;
  mimeType: string;
}

export class StorageAdapter {
  private static localUploadsDir = path.resolve(__dirname, '../../uploads');
  private static clientPublicDir = path.resolve(__dirname, '../../../client/public/uploads');
  private static clientDistDir = path.resolve(__dirname, '../../../client/dist/uploads');

  /**
   * Initializes upload folders
   */
  public static ensureDir(subfolder: string = 'blog'): string {
    const dir = path.join(this.localUploadsDir, subfolder);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    // Also mirror to client public and dist if they exist
    const publicSub = path.join(this.clientPublicDir, subfolder);
    if (!fs.existsSync(publicSub)) {
      try { fs.mkdirSync(publicSub, { recursive: true }); } catch (_) {}
    }
    const distSub = path.join(this.clientDistDir, subfolder);
    if (!fs.existsSync(distSub)) {
      try { fs.mkdirSync(distSub, { recursive: true }); } catch (_) {}
    }
    return dir;
  }

  /**
   * Validates image magic bytes (strictly rejects SVG, executables, HTML, polyglots)
   */
  public static validateMagicBytes(buffer: Buffer): { valid: boolean; ext: string; mime: string } {
    if (!buffer || buffer.length < 12) {
      return { valid: false, ext: '', mime: '' };
    }

    // JPEG: FF D8 FF
    if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
      return { valid: true, ext: 'jpg', mime: 'image/jpeg' };
    }

    // PNG: 89 50 4E 47 0D 0A 1A 0A
    if (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47 &&
      buffer[4] === 0x0d &&
      buffer[5] === 0x0a &&
      buffer[6] === 0x1a &&
      buffer[7] === 0x0a
    ) {
      return { valid: true, ext: 'png', mime: 'image/png' };
    }

    // WebP: RIFF .... WEBP
    if (
      buffer.toString('ascii', 0, 4) === 'RIFF' &&
      buffer.toString('ascii', 8, 12) === 'WEBP'
    ) {
      return { valid: true, ext: 'webp', mime: 'image/webp' };
    }

    // GIF: GIF87a or GIF89a
    const gifHeader = buffer.toString('ascii', 0, 6);
    if (gifHeader === 'GIF87a' || gifHeader === 'GIF89a') {
      return { valid: true, ext: 'gif', mime: 'image/gif' };
    }

    // AVIF: ftypavif or ftypavis
    if (buffer.length >= 16 && buffer.toString('ascii', 4, 12).includes('ftyp')) {
      const brand = buffer.toString('ascii', 8, 12);
      if (brand === 'avif' || brand === 'avis') {
        return { valid: true, ext: 'avif', mime: 'image/avif' };
      }
    }

    return { valid: false, ext: '', mime: '' };
  }

  /**
   * Processes a blog image: strips EXIF, resizes responsibly, converts to WebP
   */
  public static async saveBlogImage(
    buffer: Buffer,
    originalName: string
  ): Promise<UploadedFileResult> {
    const magic = this.validateMagicBytes(buffer);
    if (!magic.valid) {
      throw new Error(
        'Invalid or corrupted image format. Only authentic JPG, PNG, WebP, GIF, and AVIF files are supported. SVG and polyglot files are rejected for security.'
      );
    }

    const subfolder = 'blog';
    const baseDir = this.ensureDir(subfolder);
    const timestamp = Date.now();
    const cleanBase = path.basename(originalName, path.extname(originalName)).replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 40) || 'image';
    const filename = `${cleanBase}-${timestamp}.webp`;
    const destPath = path.join(baseDir, filename);

    // Sharp instance with decompression bomb limit and auto-rotation
    const sharpInstance = sharp(buffer, { limitInputPixels: 268402689 })
      .rotate() // Auto-orient based on EXIF before stripping
      .resize({
        width: 2000,
        height: 2000,
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: 85, effort: 4 });

    const metadata = await sharpInstance.metadata();
    const info = await sharpInstance.toFile(destPath);

    // Sync to public/uploads and dist/uploads for zero-delay serving in all environments
    try {
      const publicPath = path.join(this.clientPublicDir, subfolder, filename);
      fs.copyFileSync(destPath, publicPath);
    } catch (_) {}

    try {
      const distPath = path.join(this.clientDistDir, subfolder, filename);
      fs.copyFileSync(destPath, distPath);
    } catch (_) {}

    return {
      url: `/uploads/${subfolder}/${filename}`,
      filename,
      width: info.width || metadata.width || 1200,
      height: info.height || metadata.height || 800,
      bytes: info.size,
      mimeType: 'image/webp'
    };
  }

  /**
   * Processes a testimonial avatar: center-crops to square 256x256 WebP
   */
  public static async saveAvatar(
    buffer: Buffer,
    reviewerName: string
  ): Promise<UploadedFileResult> {
    const magic = this.validateMagicBytes(buffer);
    if (!magic.valid) {
      throw new Error(
        'Invalid or corrupted image format. Please upload a valid JPG, PNG, or WebP photo.'
      );
    }

    const subfolder = 'avatars';
    const baseDir = this.ensureDir(subfolder);
    const timestamp = Date.now();
    const cleanName = reviewerName.toLowerCase().replace(/[^a-z0-9_-]/g, '-').slice(0, 30) || 'avatar';
    const filename = `avatar-${cleanName}-${timestamp}.webp`;
    const destPath = path.join(baseDir, filename);

    const info = await sharp(buffer, { limitInputPixels: 268402689 })
      .rotate()
      .resize(256, 256, {
        fit: 'cover',
        position: 'center'
      })
      .webp({ quality: 90 })
      .toFile(destPath);

    // Sync
    try {
      const publicPath = path.join(this.clientPublicDir, subfolder, filename);
      fs.copyFileSync(destPath, publicPath);
    } catch (_) {}

    try {
      const distPath = path.join(this.clientDistDir, subfolder, filename);
      fs.copyFileSync(destPath, distPath);
    } catch (_) {}

    return {
      url: `/uploads/${subfolder}/${filename}`,
      filename,
      width: 256,
      height: 256,
      bytes: info.size,
      mimeType: 'image/webp'
    };
  }

  /**
   * Safely delete a file from uploads
   */
  public static deleteFile(fileUrl: string) {
    if (!fileUrl || !fileUrl.startsWith('/uploads/')) return;
    try {
      const relPath = fileUrl.replace('/uploads/', '');
      const filePath = path.join(this.localUploadsDir, relPath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      const publicPath = path.join(this.clientPublicDir, relPath);
      if (fs.existsSync(publicPath)) {
        fs.unlinkSync(publicPath);
      }
      const distPath = path.join(this.clientDistDir, relPath);
      if (fs.existsSync(distPath)) {
        fs.unlinkSync(distPath);
      }
    } catch (_) {}
  }
}

