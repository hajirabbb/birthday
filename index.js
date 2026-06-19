/* ══════════════════════════════════════════════
   BIRTHDAY WEBSITE — main script
   ══════════════════════════════════════════════ */

/* ── 1. LOADING SCREEN ───────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    loader.classList.add('done');
    setTimeout(() => loader.remove(), 900);

    // confetti on load
    confetti({
      particleCount: 260,
      spread: 180,
      origin: { y: 0.55 },
      colors: ['#d4a840', '#6b8f4e', '#f0e8c8', '#c07030', '#a8c840']
    });
  }, 1800);
});

/* ── 2. CUSTOM CURSOR ────────────────────────── */
const cursor = document.getElementById('cursor');
document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top  = e.clientY + 'px';
});
document.addEventListener('mouseleave', () => cursor.style.opacity = '0');
document.addEventListener('mouseenter', () => cursor.style.opacity = '1');

/* ── 3. STARFIELD ────────────────────────────── */
(function initStarfield() {
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d');
  let W, H, stars = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < 160; i++) {
    stars.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.4 + 0.3,
      a: Math.random(),
      da: (Math.random() - 0.5) * 0.008,
      dx: (Math.random() - 0.5) * 0.12,
      dy: (Math.random() - 0.5) * 0.12
    });
  }

  function drawStars() {
    ctx.clearRect(0, 0, W, H);
    stars.forEach(s => {
      s.x += s.dx; s.y += s.dy;
      s.a += s.da;
      if (s.a <= 0 || s.a >= 1) s.da *= -1;
      if (s.x < 0) s.x = W; if (s.x > W) s.x = 0;
      if (s.y < 0) s.y = H; if (s.y > H) s.y = 0;

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(220,210,160,${Math.max(0, Math.min(1, s.a))})`;
      ctx.fill();
    });
    requestAnimationFrame(drawStars);
  }
  drawStars();
})();

/* ── 4. PARALLAX HERO ────────────────────────── */
window.addEventListener('scroll', () => {
  const hero = document.getElementById('hero');
  const scrollY = window.scrollY;
  hero.style.backgroundPositionY = (scrollY * 0.4) + 'px';

  // shift floating hearts slightly with scroll for depth
  const hearts = document.querySelectorAll('.hearts span');
  hearts.forEach((h, i) => {
    h.style.transform = `translateY(${scrollY * (0.05 + i * 0.02)}px)`;
  });
});

/* ── 5. SCROLL REVEAL (alternating directions) ── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.hidden').forEach(el => observer.observe(el));

/* ── 6. ENVELOPE LETTER ──────────────────────── */
let envelopeOpened = false;
function openEnvelope() {
  if (envelopeOpened) return;
  envelopeOpened = true;
  const env = document.getElementById('envelope');
  const letter = document.getElementById('letter');
  env.classList.add('open');
  env.querySelector('.envelope-hint').textContent = '💌';
  setTimeout(() => {
    letter.classList.add('open');
  }, 500);
}

/* ── 7. COUNTDOWN ────────────────────────────── */
// ★ CHANGE THIS DATE to the real date you met ★
const TOGETHER_SINCE = new Date('2025-12-15T00:00:00');

function updateCountdown() {
  const now  = new Date();
  const diff = now - TOGETHER_SINCE;
  if (diff < 0) return;

  const totalSecs  = Math.floor(diff / 1000);
  const secs  = totalSecs % 60;
  const mins  = Math.floor(totalSecs / 60) % 60;
  const hours = Math.floor(totalSecs / 3600) % 24;
  const days  = Math.floor(totalSecs / 86400);

  document.getElementById('count-days').textContent  = days.toLocaleString();
  document.getElementById('count-hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('count-mins').textContent  = String(mins).padStart(2, '0');
  document.getElementById('count-secs').textContent  = String(secs).padStart(2, '0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

/* ── 8. MEMORY JAR ───────────────────────────── */
const reasons = [
  "You never give up easily 💪",
  "You think like a builder 🔨",
  "You make me feel safe 🤍",
  "You care in quiet ways 🌸",
  "Your laugh is my favourite sound 😊",
  "You make the hard days easier 🌤",
  "You inspire me every single day ✨",
  "You love deeply and genuinely ❤️",
  "You're the best person I know 🌟",
  "You make anywhere feel like home 🏡"
];
let lastReason = -1;

function shakeJar() {
  const jar = document.getElementById('jar');
  const msg = document.getElementById('jar-msg');

  jar.classList.remove('shake');
  void jar.offsetWidth; // reflow to restart animation
  jar.classList.add('shake');

  let idx;
  do { idx = Math.floor(Math.random() * reasons.length); } while (idx === lastReason);
  lastReason = idx;

  msg.style.opacity = '0';
  setTimeout(() => {
    msg.textContent = reasons[idx];
    msg.style.opacity = '1';
  }, 300);
}

/* ── 9. PLAYLIST ─────────────────────────────── */
let currentTrack = null;
function playTrack(el) {
  if (currentTrack && currentTrack !== el) {
    currentTrack.classList.remove('playing');
    currentTrack.querySelector('.track-icon').textContent = '▶';
  }
  if (el.classList.contains('playing')) {
    el.classList.remove('playing');
    el.querySelector('.track-icon').textContent = '▶';
    currentTrack = null;
  } else {
    el.classList.add('playing');
    el.querySelector('.track-icon').textContent = '♪';
    currentTrack = el;
  }
}

/* ── 10. MINI QUIZ ───────────────────────────── */
const quizData = [
  { correct: "Debug code", messages: { right: "You know me so well 😂", wrong: "Hah — it's always the code 😅" } },
  { correct: "It works! But why…", messages: { right: "That's exactly it 😭", wrong: "Every developer ever 😂" } },
  { correct: "Quality time", messages: { right: "You really know me ❤️", wrong: "Spending time together is everything 🥺" } }
];
let quizScore = 0;
let currentQ  = 0;
const totalQ  = quizData.length;

function answer(btn, isCorrect) {
  const card    = btn.closest('.quiz-card');
  const buttons = card.querySelectorAll('button');
  const result  = card.querySelector('.quiz-result');
  const qIndex  = parseInt(card.dataset.q);
  const data    = quizData[qIndex];

  // disable all buttons in this card
  buttons.forEach(b => b.disabled = true);

  if (isCorrect) {
    btn.classList.add('correct');
    result.textContent = data.messages.right;
    quizScore++;
  } else {
    btn.classList.add('wrong');
    result.textContent = data.messages.wrong;
    // highlight correct answer
    buttons.forEach(b => {
      if (b.textContent.trim() === data.correct) b.classList.add('correct');
    });
  }

  currentQ++;
  setTimeout(() => {
    card.classList.remove('active');
    if (currentQ < totalQ) {
      document.querySelector(`.quiz-card[data-q="${currentQ}"]`).classList.add('active');
    } else {
      showQuizScore();
    }
  }, 1400);
}

function showQuizScore() {
  const scoreEl = document.getElementById('quiz-score');
  const scoreText = document.getElementById('score-text');
  scoreEl.style.display = 'block';

  const messages = [
    "Hmm… we need more quality time together! 😄",
    "Getting there! You know some things about me 😊",
    "You know me pretty well! 💕",
    "You know me perfectly. I love you ❤️"
  ];
  scoreText.textContent = `${quizScore} / ${totalQ} — ${messages[quizScore]}`;
}

/* ── 11. SECRET BUTTON ───────────────────────── */
// tiny chime using Web Audio API
function playChime() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = 'sine';
      const t = ctx.currentTime + i * 0.15;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.18, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
      osc.start(t);
      osc.stop(t + 0.55);
    });
  } catch(e) { /* browser blocked audio — that's fine */ }
}

document.getElementById('secretBtn').addEventListener('click', function () {
  const msg = document.getElementById('secretMessage');
  const isHidden = msg.style.display === 'none' || msg.style.display === '';
  msg.style.display = isHidden ? 'block' : 'none';

  if (isHidden) {
    playChime();
    confetti({
      particleCount: 180,
      spread: 160,
      origin: { y: 0.7 },
      colors: ['#d4a840', '#c07030', '#f0e8c8', '#6b8f4e', '#a8c840']
    });
  }
});

/* ── CUSTOM AUDIO PLAYERS ────────────────────────── */
function initAudioPlayers() {
  document.querySelectorAll('.player-embed').forEach(embed => {
    const audio     = embed.querySelector('audio');
    const playBtn   = embed.querySelector('.ap-play-btn');
    const fill      = embed.querySelector('.ap-progress-fill');
    const progWrap  = embed.querySelector('.ap-progress-wrap');
    const current   = embed.querySelector('.ap-current');
    const duration  = embed.querySelector('.ap-duration');
    const volBtn    = embed.querySelector('.ap-volume');

    if (!audio) return;

    function fmt(s) {
      const m = Math.floor(s / 60);
      const sec = Math.floor(s % 60);
      return `${m}:${sec.toString().padStart(2,'0')}`;
    }

    audio.addEventListener('loadedmetadata', () => {
      duration.textContent = fmt(audio.duration);
    });

    audio.addEventListener('timeupdate', () => {
      const pct = (audio.currentTime / audio.duration) * 100 || 0;
      fill.style.width = pct + '%';
      current.textContent = fmt(audio.currentTime);
    });

    audio.addEventListener('ended', () => {
      playBtn.textContent = '▶';
      fill.style.width = '0%';
      current.textContent = '0:00';
    });

    playBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // don't trigger togglePlayer
      // pause all other audio players
      document.querySelectorAll('.player-embed audio').forEach(a => {
        if (a !== audio) {
          a.pause();
          const otherBtn = a.closest('.player-embed').querySelector('.ap-play-btn');
          if (otherBtn) otherBtn.textContent = '▶';
        }
      });

      if (audio.paused) {
        audio.play();
        playBtn.textContent = '⏸';
      } else {
        audio.pause();
        playBtn.textContent = '▶';
      }
    });

    // click on progress bar to seek
    progWrap.addEventListener('click', (e) => {
      const rect = progWrap.getBoundingClientRect();
      const pct  = (e.clientX - rect.left) / rect.width;
      audio.currentTime = pct * audio.duration;
    });

    // volume toggle mute
    let muted = false;
    volBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      muted = !muted;
      audio.muted = muted;
      volBtn.textContent = muted ? '🔇' : '🔊';
    });
  });
}

// run after DOM is ready
document.addEventListener('DOMContentLoaded', initAudioPlayers);

function togglePlayer(id, el) {
  const playerDiv = document.getElementById(id);
  playerDiv.classList.toggle('open');
}