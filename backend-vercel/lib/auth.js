function adminAuth(req) {
  const ADMIN_TOKEN = process.env.ADMIN_TOKEN || '';
  if (!ADMIN_TOKEN) return true;
  const token = req.headers['x-admin-token'];
  return token && token === ADMIN_TOKEN;
}

module.exports = { adminAuth };
