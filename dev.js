/**
 * Servidor local para testes — usa memória no lugar do Redis.
 * Reiniciar o servidor zera os votos.
 *
 * Usage: npm run dev
 */

const express = require('express');
const crypto = require('crypto');
const path = require('path');
const { MEMBERS, POSITIONS, TOTAL_VOTERS } = require('./config');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── In-memory store (Redis simulado) ────────────────────────────
const store = {
  voters: new Set(), // fingerprint hashes que já votaram
  votes: []          // votos anônimos
};

const SECRET = 'local-dev-secret';

function hashFp(fp) {
  return crypto.createHmac('sha256', SECRET).update(fp).digest('hex');
}

// ── API ──────────────────────────────────────────────────────────

app.get('/api/config', (req, res) => {
  res.json({ members: MEMBERS, positions: POSITIONS, totalVoters: TOTAL_VOTERS });
});

app.get('/api/status', (req, res) => {
  const count = store.voters.size;
  res.json({ votesCount: count, totalVoters: TOTAL_VOTERS, complete: count >= TOTAL_VOTERS });
});

app.post('/api/check-device', (req, res) => {
  const { fingerprint } = req.body || {};
  if (!fingerprint || fingerprint.length < 10)
    return res.status(400).json({ error: 'Identificação inválida.' });

  const hash = hashFp(fingerprint);
  res.json({
    alreadyVoted: store.voters.has(hash),
    votesCount: store.voters.size,
    totalVoters: TOTAL_VOTERS
  });
});

app.post('/api/vote', (req, res) => {
  const { fingerprint, selections } = req.body || {};

  if (!fingerprint || fingerprint.length < 10)
    return res.status(400).json({ error: 'Identificação inválida.' });

  const posIds = POSITIONS.map(p => p.id);
  for (const id of posIds) {
    if (!selections?.[id] || !MEMBERS.includes(selections[id]))
      return res.status(400).json({ error: `Seleção inválida para: ${id}` });
  }

  const hash = hashFp(fingerprint);
  if (store.voters.has(hash))
    return res.status(403).json({ error: 'Este dispositivo já registrou um voto.' });
  if (store.voters.size >= TOTAL_VOTERS)
    return res.status(403).json({ error: 'O quórum de votação já foi atingido.' });

  store.voters.add(hash);
  store.votes.push({
    id: crypto.randomBytes(6).toString('hex'),
    ts: Date.now(),
    selections // sem vínculo ao fingerprint
  });

  console.log(`  [voto ${store.voters.size}/${TOTAL_VOTERS}] registrado`);
  res.json({ success: true });
});

app.get('/api/results', (req, res) => {
  const count = store.voters.size;

  if (count < TOTAL_VOTERS)
    return res.json({ ready: false, votesCount: count, totalVoters: TOTAL_VOTERS });

  const tally = {};
  POSITIONS.forEach(pos => {
    tally[pos.id] = {};
    MEMBERS.forEach(m => { tally[pos.id][m] = 0; });
  });

  store.votes.forEach(v => {
    Object.entries(v.selections).forEach(([posId, name]) => {
      if (tally[posId] && MEMBERS.includes(name)) tally[posId][name]++;
    });
  });

  const results = {};
  POSITIONS.forEach(pos => {
    results[pos.id] = Object.entries(tally[pos.id])
      .filter(([, c]) => c > 0)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));
  });

  res.json({ ready: true, results, positions: POSITIONS, totalVoters: TOTAL_VOTERS });
});

app.post('/api/admin/reset', (req, res) => {
  store.voters.clear();
  store.votes = [];
  console.log('  [admin] votação resetada');
  res.json({ success: true });
});

// ── Start ────────────────────────────────────────────────────────
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`\n  Cédula de Confiança — Servidor local`);
  console.log(`  http://localhost:${PORT}\n`);
  console.log(`  Dados em memória. Reiniciar o servidor zera os votos.\n`);
});
