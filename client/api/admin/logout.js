export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Set-Cookie', 'codex_admin_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
  return res.status(200).json({ success: true, data: { message: 'Logged out successfully' } });
}
