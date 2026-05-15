const crypto = require('crypto');
const redis = require('../lib/redis');
const { MEMBERS, POSITIONS, TOTAL_VOTERS } = require('../config');

function hashFingerprint(fp, secret) {
  return crypto.createHmac('sha256', secret).update(fp).digest('hex');
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();

  const { fingerprint, selections } = req.body || {};

  if (!fingerprint || typeof fingerprint !== 'string' || fingerprint.length < 10) {
    return res.status(400).json({ error: 'Identificação de dispositivo inválida.' });
  }
  if (!selections || typeof selections !== 'object' || Array.isArray(selections)) {
    return res.status(400).json({ error: 'Dados de votação inválidos.' });
  }

  // Validate all positions are present and valid
  const posIds = POSITIONS.map(p => p.id);
  for (const posId of posIds) {
    if (!selections[posId] || !MEMBERS.includes(selections[posId])) {
      return res.status(400).json({ error: `Cargo "${posId}" com seleção inválida.` });
    }
  }
  for (const key of Object.keys(selections)) {
    if (!posIds.includes(key)) {
      return res.status(400).json({ error: 'Dados de votação inválidos.' });
    }
  }

  const secret = process.env.FINGERPRINT_SECRET || 'change-this-secret-in-env';
  const hash = hashFingerprint(fingerprint, secret);

  // Atomic: check if already voted and add in one pipeline
  const pipeline = redis.pipeline();
  pipeline.sismember('voters', hash);
  pipeline.scard('voters');
  const [alreadyVotedRaw, countRaw] = await pipeline.exec();

  if (alreadyVotedRaw) {
    return res.status(403).json({ error: 'Este dispositivo já registrou um voto.' });
  }

  const currentCount = Number(countRaw) || 0;
  if (currentCount >= TOTAL_VOTERS) {
    return res.status(403).json({ error: 'O quórum de votação já foi atingido.' });
  }

  // Store vote anonymously — no link to fingerprint
  const vote = {
    id: crypto.randomBytes(6).toString('hex'),
    ts: Date.now(),
    selections
  };

  // Use pipeline for atomicity
  const writePipeline = redis.pipeline();
  writePipeline.sadd('voters', hash);
  writePipeline.rpush('votes', JSON.stringify(vote));
  await writePipeline.exec();

  res.json({ success: true });
};
