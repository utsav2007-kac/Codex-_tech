const html = `<h2>The Architectural Reality of Modern Applicant Tracking Systems</h2>`;
let index = 0;
const res = html.replace(/<(h[23])(?:\s+id="([^"]*)")?([^>]*)>(.*?)<\/\1>/gi, (_full, tag, existingId, attrs, text) => {
  const rawText = text.replace(/<[^>]*>/g, '').trim();
  const id = existingId || `section-${index}-${rawText.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  index++;
  return `<${tag} id="${id}" ${attrs || ''}>${text}</${tag}>`;
});
console.log('Result:', res);
