/* ════════════════════════════════════════════════════════════
   animations.js — Our Mother at 70
   IntersectionObserver scroll reveals · Parallax · Canvas particles
   3D card tilt · Timeline activation · Image error handlers
   ════════════════════════════════════════════════════════════ */

'use strict';

/* ─── Reduced motion preference ─────────────────────────── */
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

/* ─── 1. IMAGE ERROR HANDLERS ────────────────────────────── */
/**
 * When a placeholder image 404s the img element gets .img-broken
 * so the parent's gradient background shows through cleanly.
 */
function initImageErrorHandlers() {
  document.querySelectorAll('.img-placeholder').forEach(img => {
    if (img.complete && img.naturalWidth === 0) {
      img.classList.add('img-broken');
    }
    img.addEventListener('error', () => {
      img.classList.add('img-broken');
    });
  });
}

/* ─── 2. SCROLL REVEAL (IntersectionObserver) ────────────── */
function initScrollReveal() {
  if (prefersReducedMotion) return;

  const revealTargets = document.querySelectorAll(
    '.reveal-fade-up, .reveal-fade-left, .reveal-fade-right, .reveal-stagger'
  );

  if (!revealTargets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  revealTargets.forEach(el => observer.observe(el));
}

/* ─── 3. PARALLAX (requestAnimationFrame) ────────────────── */
function initParallax() {
  if (prefersReducedMotion) return;

  const heroBg = document.querySelector('.hero__bg-photo');
  const heroOrbs = document.querySelectorAll('.hero__bg-orb');

  if (!heroBg) return;

  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const windowH = window.innerHeight;

        if (scrollY < windowH * 1.5) {
          const ratio = scrollY / windowH;

          // Background photo slow scroll
          heroBg.style.transform = `scale(1.05) translateY(${scrollY * 0.3}px)`;

          // Orbs move in different directions
          heroOrbs.forEach((orb, i) => {
            const dir = i % 2 === 0 ? 1 : -1;
            orb.style.transform = `translateY(${scrollY * 0.12 * dir}px)`;
          });
        }

        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ─── 4. HERO PARTICLE CANVAS ────────────────────────────── */
function initHeroParticles() {
  const canvas = document.getElementById('heroParticles');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animFrameId;

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x    = Math.random() * canvas.width;
      this.y    = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4 - 0.2;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.opacitySpeed = (Math.random() * 0.004 + 0.001) *
                          (Math.random() < 0.5 ? 1 : -1);
      // Alternate between gold, rose-gold, champagne tones
      const colors = [
        '201, 168, 76',   // gold
        '196, 154, 108',  // rose-gold
        '232, 213, 163',  // gold-light
        '240, 230, 211',  // champagne
      ];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.opacity += this.opacitySpeed;

      if (this.opacity > 0.65) this.opacitySpeed *= -1;
      if (this.opacity < 0.05) this.opacitySpeed *= -1;

      // Wrap edges
      if (this.x < -10)               this.x = canvas.width + 10;
      if (this.x > canvas.width + 10) this.x = -10;
      if (this.y < -10)               this.reset();
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    const count = prefersReducedMotion ? 0 : Math.floor(canvas.width / 12);
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    animFrameId = requestAnimationFrame(animate);
  }

  function init() {
    resize();
    initParticles();
    if (!prefersReducedMotion) animate();
  }

  init();

  const resizeObserver = new ResizeObserver(() => {
    cancelAnimationFrame(animFrameId);
    resize();
    initParticles();
    if (!prefersReducedMotion) animate();
  });
  resizeObserver.observe(canvas);
}

/* ─── 5. FOOTER PARTICLE CANVAS ─────────────────────────── */
function initFooterParticles() {
  const canvas = document.getElementById('footerParticles');
  if (!canvas || prefersReducedMotion) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animFrameId;

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function init() {
    resize();
    particles = [];
    const count = Math.floor(canvas.width / 20);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.3,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: -Math.random() * 0.5 - 0.1,
        opacity: Math.random() * 0.4 + 0.05,
      });
    }
    animate();
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201, 168, 76, ${p.opacity})`;
      ctx.fill();
    });
    animFrameId = requestAnimationFrame(animate);
  }

  init();
  window.addEventListener('resize', () => {
    cancelAnimationFrame(animFrameId);
    init();
  }, { passive: true });
}

/* ─── 6. TIMELINE SCROLL ACTIVATION ─────────────────────── */
function initTimelineActivation() {
  const items = document.querySelectorAll('.timeline__item');
  const line  = document.querySelector('.timeline__line-progress');

  if (!items.length || !line) return;

  const nodeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        const node = entry.target.querySelector('.timeline__node');
        if (entry.isIntersecting && node) {
          node.classList.add('active');
        }
      });
    },
    { threshold: 0.5 }
  );

  items.forEach(item => nodeObserver.observe(item));

  // Timeline progress line
  function updateTimelineLine() {
    const track = document.querySelector('.timeline__track');
    if (!track) return;

    const trackRect  = track.getBoundingClientRect();
    const windowH    = window.innerHeight;
    const trackTop   = trackRect.top;
    const trackH     = trackRect.height;

    const scrolled   = Math.max(0, windowH * 0.5 - trackTop);
    const progress   = Math.min(1, scrolled / trackH);

    line.style.height = `${progress * 100}%`;
  }

  window.addEventListener('scroll', updateTimelineLine, { passive: true });
  updateTimelineLine();
}

/* ─── 7. TRIBUTE CARD 3D TILT ────────────────────────────── */
function initCardTilt() {
  if (prefersReducedMotion) return;

  // Only on non-touch devices
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const cards = document.querySelectorAll('.tribute-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);

      card.style.transform = `
        perspective(600px)
        rotateY(${dx * 6}deg)
        rotateX(${-dy * 6}deg)
        translateY(-4px)
      `;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ─── 8. REASON CARD TAP/TOUCH FLIP ──────────────────────── */
function initReasonCardTouchFlip() {
  // On touch devices, clicking flips the card
  // (hover doesn't work on touch)
  if (!window.matchMedia('(pointer: coarse)').matches) return;

  document.addEventListener('click', (e) => {
    const card = e.target.closest('.reason-card');
    if (!card) return;
    card.classList.toggle('flipped');
  });
}

/* ─── 9. SECTION ENTRANCE AMBIENT GLOW ─────────────────────*/
function initSectionGlow() {
  if (prefersReducedMotion) return;

  const ambients = document.querySelectorAll(
    '.story__texture, .tributes__bg, .timeline__bg, ' +
    '.reasons__ambient, .video-section__ambient, ' +
    '.memory-wall__texture, .countdown__ambient'
  );

  const glowObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
        } else {
          entry.target.style.opacity = '0.4';
        }
      });
    },
    { threshold: 0.1 }
  );

  ambients.forEach(el => {
    el.style.transition = 'opacity 1.2s ease';
    el.style.opacity = '0.4';
    glowObserver.observe(el);
  });
}

/* ─── INIT ALL ───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initImageErrorHandlers();
  initScrollReveal();
  initParallax();
  initHeroParticles();
  initFooterParticles();
  initTimelineActivation();
  initCardTilt();
  initReasonCardTouchFlip();
  initSectionGlow();
});
