function setCors(req, res) {
  const origin = req.headers.origin || '*';
  const allowOrigin = process.env.FRONT_URL || origin || '*';
  res.setHeader('Access-Control-Allow-Origin', allowOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-token, verif-hash, verif_hash');
}

function handleOptions(req, res) {
  if (req.method === 'OPTIONS') {
    setCors(req, res);
    res.statusCode = 200;
    res.end();
    return true;
  }
  return false;
}

module.exports = { setCors, handleOptions };
