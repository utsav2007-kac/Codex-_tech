// Ensure Vercel serverless environment flag is set before importing server
process.env.VERCEL = process.env.VERCEL || '1';

// Vercel Serverless Function entrypoint for Codex Tech-IT API
let app;

module.exports = (req, res) => {
  if (!app) {
    try {
      const serverModule = require('../server/dist/index.js');
      app = serverModule.default || serverModule;
    } catch (err) {
      console.error('[Vercel Serverless] Failed to load server bundle:', err);
      return res.status(500).json({
        success: false,
        error: {
          code: 'SERVER_INITIALIZATION_ERROR',
          message: 'Backend server module failed to load: ' + err.message,
        },
      });
    }
  }

  // Normalize path if /api prefix was trimmed by Vercel rewrite
  if (
    !req.url.startsWith('/api') &&
    !req.url.startsWith('/robots.txt') &&
    !req.url.startsWith('/sitemap.xml') &&
    !req.url.startsWith('/rss.xml')
  ) {
    req.url = '/api' + req.url;
  }

  return app(req, res);
};
