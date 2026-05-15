const redis = require('../../lib/redis');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();

  const { password } = req.body || {};
  const adminPwd = process.env.ADMIN_PASSWORD;

  if (!adminPwd || password !== adminPwd) {
    return res.status(403).json({ error: 'Acesso negado.' });
  }

  await redis.del('voters');
  await redis.del('votes');

  res.json({ success: true, message: 'Votação resetada com sucesso.' });
};
