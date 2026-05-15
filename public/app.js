'use strict';

// ── State ─────────────────────────────────────────────────────────────────────
let members = [];
let positions = [];
const selections = {};
let deviceFingerprint = null;

// ── Screens ───────────────────────────────────────────────────────────────────
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0, 0);
}

// ── Toast ─────────────────────────────────────────────────────────────────────
let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast show';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.className = 'toast'; }, 3400);
}

// ── Fingerprint ───────────────────────────────────────────────────────────────
async function buildFingerprint() {
  const parts = [
    navigator.userAgent,
    navigator.language || '',
    navigator.platform || '',
    screen.width + 'x' + screen.height + 'x' + screen.colorDepth,
    String(window.devicePixelRatio || 1),
    String(navigator.hardwareConcurrency || 0),
    (() => { try { return Intl.DateTimeFormat().resolvedOptions().timeZone; } catch { return ''; } })(),
  ];

  try {
    const c = document.createElement('canvas');
    c.width = 240; c.height = 60;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, 240, 60);
    ctx.fillStyle = '#f0f0f0';
    ctx.font = '14px Arial';
    ctx.fillText('Cedula de Confianca institucional', 4, 24);
    ctx.strokeStyle = 'rgba(255,255,255,.4)';
    ctx.beginPath(); ctx.arc(60, 42, 14, 0, Math.PI * 2); ctx.stroke();
    parts.push(c.toDataURL());
  } catch { /* safari private */ }

  try {
    const gl = document.createElement('canvas').getContext('webgl');
    if (gl) {
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      if (ext) {
        parts.push(gl.getParameter(ext.UNMASKED_VENDOR_WEBGL));
        parts.push(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL));
      }
    }
  } catch { /* ignore */ }

  const raw = parts.join('|||');
  try {
    const buf = new TextEncoder().encode(raw);
    const hash = await crypto.subtle.digest('SHA-256', buf);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
  } catch {
    let h = 0;
    for (let i = 0; i < raw.length; i++) h = (Math.imul(31, h) + raw.charCodeAt(i)) | 0;
    return Math.abs(h).toString(16).padStart(8, '0') + Date.now().toString(16);
  }
}

// ── Boot ──────────────────────────────────────────────────────────────────────
async function boot() {
  showScreen('screen-loading');
  try {
    const [cfgRes, fp] = await Promise.all([fetch('/api/config'), buildFingerprint()]);
    deviceFingerprint = fp;
    const cfg = await cfgRes.json();
    members = cfg.members;
    positions = cfg.positions;

    const checkRes = await fetch('/api/check-device', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fingerprint: fp })
    });
    const check = await checkRes.json();

    if (check.alreadyVoted) {
      window.location.replace('results.html');
      return;
    } else {
      initOnboarding();
      showScreen('screen-onboarding');
    }
  } catch {
    showToast('Erro de conexão. Recarregue a página.');
    showScreen('screen-onboarding');
  }
}

// ── Onboarding ────────────────────────────────────────────────────────────────
const TOTAL_SLIDES = 4;
let currentSlide = 0;

function initOnboarding() {
  currentSlide = 0;
  renderSlideState();
  setupSwipe();
}

function renderSlideState() {
  const track = document.getElementById('ob-track');
  track.style.transform = `translateX(-${currentSlide * 100}%)`;

  // Dots
  document.querySelectorAll('.ob-dot').forEach((d, i) => {
    d.classList.toggle('active', i === currentSlide);
  });

  // Next button
  const nextBtn = document.getElementById('ob-next');
  const isLast = currentSlide === TOTAL_SLIDES - 1;
  nextBtn.style.display = isLast ? 'none' : 'block';
}

function goToSlide(idx) {
  currentSlide = Math.max(0, Math.min(TOTAL_SLIDES - 1, idx));
  renderSlideState();
}

function setupSwipe() {
  const wrap = document.getElementById('ob-track-wrap') ||
               document.querySelector('.ob-track-wrap');
  if (!wrap) return;

  let startX = 0, startY = 0, isDragging = false, isHorizonal = null;

  wrap.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    isDragging = true;
    isHorizonal = null;
  }, { passive: true });

  wrap.addEventListener('touchmove', e => {
    if (!isDragging) return;
    const dx = e.touches[0].clientX - startX;
    const dy = e.touches[0].clientY - startY;
    if (isHorizonal === null) {
      isHorizonal = Math.abs(dx) > Math.abs(dy);
    }
    if (isHorizonal) e.preventDefault();
  }, { passive: false });

  wrap.addEventListener('touchend', e => {
    if (!isDragging || !isHorizonal) { isDragging = false; return; }
    const dx = e.changedTouches[0].clientX - startX;
    isDragging = false;
    if (dx < -40 && currentSlide < TOTAL_SLIDES - 1) goToSlide(currentSlide + 1);
    else if (dx > 40 && currentSlide > 0) goToSlide(currentSlide - 1);
  }, { passive: true });
}

// ── Vote form ─────────────────────────────────────────────────────────────────
function buildVoteForm() {
  const container = document.getElementById('positions-container');
  container.innerHTML = '';

  positions.forEach((pos, idx) => {
    const section = document.createElement('div');
    section.className = 'section';
    section.innerHTML = `
      <div class="section-header">Cargo ${String(idx + 1).padStart(2,'0')} de ${positions.length}</div>
      <div class="section-body">
        <div class="list-row" id="row-${pos.id}" data-pos="${pos.id}" data-idx="${idx}">
          <div class="row-num" id="num-${pos.id}">${idx + 1}</div>
          <div class="row-content">
            <div class="row-label">${pos.title}</div>
            <div class="row-value" id="val-${pos.id}">Toque para indicar</div>
          </div>
          <span class="row-chevron" id="chev-${pos.id}">&#8250;</span>
        </div>
        <div class="expandable" id="exp-${pos.id}">
          <div class="expand-desc">
            <div class="expand-desc-label">Perfil esperado para o cargo</div>
            ${pos.description.replace(/\n/g, '<br>')}
          </div>
          ${pos.skills && pos.skills.length ? `
          <div class="skills-wrap">
            <div class="skills-label">Habilidades valorizadas</div>
            <div class="skills-chips">
              ${pos.skills.map(s => `<span class="skill-chip">${s}</span>`).join('')}
            </div>
          </div>` : ''}
          <div class="ob-compatibility-label">
            Quem tem mais compatibilidade com o perfil de <strong>${pos.title}</strong>?
          </div>
          <div id="grid-${pos.id}"></div>
        </div>
      </div>
    `;
    container.appendChild(section);

    const grid = section.querySelector(`#grid-${pos.id}`);
    members.forEach(name => {
      const row = document.createElement('div');
      row.className = 'check-row';
      row.dataset.pos = pos.id;
      row.dataset.name = name;
      row.innerHTML = `<span class="check-row-label">${name}</span><span class="check-mark">&#10003;</span>`;
      row.addEventListener('click', () => selectMember(pos.id, name, idx));
      grid.appendChild(row);
    });

    section.querySelector(`#row-${pos.id}`).addEventListener('click', () => togglePosition(pos.id));
  });

  openPosition(positions[0].id);
  updateProgress();
}

function openPosition(posId) {
  positions.forEach(p => {
    document.getElementById(`exp-${p.id}`)?.classList.remove('open');
    document.getElementById(`row-${p.id}`)?.classList.remove('open');
  });
  document.getElementById(`exp-${posId}`)?.classList.add('open');
  document.getElementById(`row-${posId}`)?.classList.add('open');
  setTimeout(() => {
    document.getElementById(`row-${posId}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 80);
}

function togglePosition(posId) {
  const isOpen = document.getElementById(`exp-${posId}`)?.classList.contains('open');
  positions.forEach(p => {
    document.getElementById(`exp-${p.id}`)?.classList.remove('open');
    document.getElementById(`row-${p.id}`)?.classList.remove('open');
  });
  if (!isOpen) {
    document.getElementById(`exp-${posId}`)?.classList.add('open');
    document.getElementById(`row-${posId}`)?.classList.add('open');
  }
}

function selectMember(posId, name, posIdx) {
  selections[posId] = name;

  document.getElementById(`grid-${posId}`)
    .querySelectorAll('.check-row')
    .forEach(r => r.classList.toggle('selected', r.dataset.name === name));

  const val = document.getElementById(`val-${posId}`);
  val.textContent = name;
  val.classList.add('selected');

  document.getElementById(`row-${posId}`)?.classList.add('filled');

  updateProgress();

  const next = positions.find((p, i) => i > posIdx && !selections[p.id]);
  if (next) {
    setTimeout(() => openPosition(next.id), 280);
  } else {
    setTimeout(() => {
      positions.forEach(p => {
        document.getElementById(`exp-${p.id}`)?.classList.remove('open');
        document.getElementById(`row-${p.id}`)?.classList.remove('open');
      });
      document.getElementById('vote-scroll').scrollTo({ top: 9999, behavior: 'smooth' });
    }, 280);
  }
}

function updateProgress() {
  const done = positions.filter(p => selections[p.id]).length;
  document.getElementById('vote-progress').textContent = `${done} / ${positions.length}`;
  document.getElementById('btn-submit').disabled = done < positions.length;
}

// ── Submit ────────────────────────────────────────────────────────────────────
async function handleSubmit() {
  for (const pos of positions) {
    if (!selections[pos.id]) {
      showToast(`Selecione um candidato para: ${pos.title}`);
      openPosition(pos.id);
      return;
    }
  }

  const btn = document.getElementById('btn-submit');
  const orig = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Enviando…';

  try {
    const res = await fetch('/api/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fingerprint: deviceFingerprint, selections })
    });
    const data = await res.json();

    if (!res.ok) {
      showToast(data.error || 'Erro ao enviar voto.');
      btn.disabled = false;
      btn.innerHTML = orig;
      return;
    }

    showScreen('screen-confirm');
  } catch {
    showToast('Falha de conexão. Tente novamente.');
    btn.disabled = false;
    btn.innerHTML = orig;
  }
}

// ── Events ────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  // Onboarding next button
  document.getElementById('ob-next').addEventListener('click', () => {
    if (currentSlide < TOTAL_SLIDES - 1) goToSlide(currentSlide + 1);
  });

  // "Iniciar Votação" on last slide
  document.getElementById('btn-start').addEventListener('click', () => {
    buildVoteForm();
    showScreen('screen-vote');
  });

  document.getElementById('btn-back-vote').addEventListener('click', () => {
    showScreen('screen-onboarding');
    goToSlide(TOTAL_SLIDES - 1);
  });

  document.getElementById('btn-submit').addEventListener('click', handleSubmit);

  boot();
});
