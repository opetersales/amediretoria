const redis = require('../lib/redis');
const { MEMBERS, POSITIONS, TOTAL_VOTERS } = require('../config');

module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).end();

  const votesCount = await redis.scard('voters');

  if (votesCount < TOTAL_VOTERS) {
    return res.json({ ready: false, votesCount, totalVoters: TOTAL_VOTERS });
  }

  const raw = await redis.lrange('votes', 0, -1);
  const votes = raw.map(v => (typeof v === 'string' ? JSON.parse(v) : v));

  // Tally
  const tally = {};
  for (const pos of POSITIONS) {
    tally[pos.id] = {};
    for (const m of MEMBERS) tally[pos.id][m] = 0;
  }

  for (const vote of votes) {
    for (const [posId, name] of Object.entries(vote.selections || {})) {
      if (tally[posId] !== undefined && MEMBERS.includes(name)) {
        tally[posId][name]++;
      }
    }
  }

  const results = {};
  for (const pos of POSITIONS) {
    results[pos.id] = Object.entries(tally[pos.id])
      .filter(([, c]) => c > 0)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));
  }

  res.json({ ready: true, results, positions: POSITIONS, totalVoters: TOTAL_VOTERS });
};
