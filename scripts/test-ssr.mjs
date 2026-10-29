import { createServer } from 'vite';

async function testSSR() {
  const vite = await createServer({
    root: 'd:/web devlopment/client',
    server: { middlewareMode: true },
    appType: 'custom',
  });

  try {
    console.log('Testing Vite SSR module loading...');
    const { renderHome } = await vite.ssrLoadModule('/src/entry-server.tsx');
    const { html } = renderHome();
    console.log('✅ SSR renderHome() succeeded!');
    console.log('HTML length:', html.length);
    console.log('Contains headline:', html.includes('We Deliver Jobs'));
    console.log('Contains literal curly brace:', html.includes("{' '}") || html.includes("{ ' ' }"));
    console.log('Sample snippet:', html.slice(0, 300));
  } finally {
    await vite.close();
  }
}

testSSR().catch(console.error);
