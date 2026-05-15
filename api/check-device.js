const crypto = require('crypto');
const redis = require('../lib/redis');
const { TOTAL_VOTERS } = require('../config');

function hashFingerprint(fp, secret) {
  return crypto.createHmac('sha256', secret).update(fp).digest('hex');
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();

  const { fingerprint } = req.body || {};
  if (!fingerprint || typeof fingerprint !== 'string' || fingerprint.length < 10) {
    return res.status(400).json({ error: 'Identificação de dispositivo inválida.' });
  }

  const secret = process.env.FINGERPRINT_SECRET || 'change-this-secret-in-env';
  const hash = hashFingerprint(fingerprint, secret);

  const [alreadyVoted, votesCount] = await Promise.all([
    redis.sismember('voters', hash),
    redis.scard('voters')
  ]);

  res.json({
    alreadyVoted: Boolean(alreadyVoted),
    votesCount: votesCount,
    totalVoters: TOTAL_VOTERS
  });
};
