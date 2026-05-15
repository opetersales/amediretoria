const redis = require('../lib/redis');
const { TOTAL_VOTERS } = require('../config');

module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).end();
  const count = await redis.scard('voters');
  res.json({ votesCount: count, totalVoters: TOTAL_VOTERS, complete: count >= TOTAL_VOTERS });
};
