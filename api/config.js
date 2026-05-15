const { MEMBERS, POSITIONS, TOTAL_VOTERS } = require('../config');

module.exports = (req, res) => {
  if (req.method !== 'GET') return res.status(405).end();
  res.json({ members: MEMBERS, positions: POSITIONS, totalVoters: TOTAL_VOTERS });
};
