/* ════════════════════════════════════════════════════════════
   main.js — Our Mother at 70
   Init · Countdown · Custom Cursor · Scroll Progress
   Navbar · Quote Rotator · Mobile Menu · 70 Reasons Grid
   ════════════════════════════════════════════════════════════ */

'use strict';

/* ═══════════════════════════════════════════════════════════
   CONFIGURATION — Edit these values to customise the site
   ═══════════════════════════════════════════════════════════ */

/** Birthday / event date (YYYY-MM-DD) */
const BIRTHDAY_DATE = '2026-05-24';

/**
 * 70 Reasons We Love You
 * ─────────────────────
 * Replace each string with a real, personal reason.
 * Keep all 70 entries — the grid renders exactly this array.
 */
const REASONS = [
  /* 01 */ 'Because you woke before sunrise every single morning so your children could wake to warmth',
  /* 02 */ 'Because you quietly folded your own dreams away so ours could breathe and grow',
  /* 03 */ 'Because even when the cupboard was nearly empty, our table never once felt like poverty',
  /* 04 */ 'Because you prayed over each of us by name every morning before the world asked anything of you',
  /* 05 */ 'Because you never made any of us feel like a burden — not even in the hardest seasons',
  /* 06 */ 'Because your laughter, loud and unashamed and full, has been the soundtrack of our whole childhood',
  /* 07 */ 'Because you looked at ten completely different children and loved each one as if they were your only one',
  /* 08 */ 'Because your embrace has always been the safest place on earth',
  /* 09 */ 'Because you taught us to kneel before we walked — faith came before everything',
  /* 10 */ 'Because you stayed. Through every storm, every season, every difficulty. You always stayed.',
  /* 11 */ 'Because you understood our hearts better than we understood ourselves',
  /* 12 */ 'Because a gentle word of correction from you could accomplish what no one else\'s harshness could',
  /* 13 */ 'Because you sacrificed your comfort a thousand times without once asking for acknowledgement',
  /* 14 */ 'Because you never stopped believing in a child even when that child stopped believing in themselves',
  /* 15 */ 'Because your kitchen was never just about food — it was the place where this family always healed',
  /* 16 */ 'Because when we were sick, your hands on our foreheads were better than any medicine',
  /* 17 */ 'Because you raised sons who know how to be tender and daughters who know how to be strong',
  /* 18 */ 'Because you never competed with other mothers — you were simply, quietly, irreplaceable',
  /* 19 */ 'Because you taught us that dignity is not something you earn — it is something you carry',
  /* 20 */ 'Because your silence could correct without ever humiliating',
  /* 21 */ 'Because you celebrated every result, every promotion, every tiny victory as though it were the greatest news in all the world',
  /* 22 */ 'Because no matter how far any of us travelled, home always carried the scent of you',
  /* 23 */ 'Because you gave every grandchild the same eyes you gave us — full of unconditional delight',
  /* 24 */ 'Because you never let a child leave your home hungry, whether they were yours by blood or simply by love',
  /* 25 */ 'Because you built peace in a house full of ten personalities, ten opinions, and ten very different needs',
  /* 26 */ 'Because you chose love on the days it was inconvenient, on the days it cost you, on every difficult ordinary day',
  /* 27 */ 'Because your faith never wavered when ours did — you carried it quietly for the whole family',
  /* 28 */ 'Because when our father needed a partner, you were exactly that — steady, devoted, and completely true',
  /* 29 */ 'Because you taught us that tears are not weakness — they are proof that the heart is still working',
  /* 30 */ 'Because you made 1980 the beginning of something extraordinary simply by saying yes',
  /* 31 */ 'Because ten children, one home, one mother — and somehow you made all of us feel like enough',
  /* 32 */ 'Because you aged the way only truly joyful people do — with grace, never with grief',
  /* 33 */ 'Because your hands, worn and gentle, tell the story of a life given entirely to others',
  /* 34 */ 'Because you have never once been jealous of the futures you spent everything building for us',
  /* 35 */ 'Because you forgave us for things we never even thought to apologise for',
  /* 36 */ 'Because our earliest memory of safety has your face in it',
  /* 37 */ 'Because you turned ordinary Sundays into something sacred and worth remembering',
  /* 38 */ 'Because even now at seventy, your eyes still carry that same warmth they always have',
  /* 39 */ 'Because the grandchildren run to you exactly the way we did — that is not coincidence, that is character',
  /* 40 */ 'Because you showed us what it looks like to love someone through every version of themselves',
  /* 41 */ 'Because your prayers have arrived before us to every place we have ever gone',
  /* 42 */ 'Because you never compared us to each other — not once, not even quietly',
  /* 43 */ 'Because you are the reason this family has a language for love',
  /* 44 */ 'Because you gave Chibuzor a foundation, Ifeoma a voice, and Chukwuka courage they still carry',
  /* 45 */ 'Because you gave Ijeoma grace, Uchenna steadiness, and Nnamdi unbreakable strength',
  /* 46 */ 'Because you gave Chisom warmth, Nkechi brilliance, and Nnaemeka a wisdom beyond his years',
  /* 47 */ 'Because you gave Chisimdi — your last — the fullness of everything you had left to give',
  /* 48 */ 'Because Shiloh, Blossom, Awesome, Paradise, and Zoe already know your love is something rare',
  /* 49 */ 'Because Chukwuekeka, Princess, Chukwuzikora, Angel, and Oluchi are living proof your love only multiplies',
  /* 50 */ 'Because seventy years is not just a number — it is a testimony of endurance and grace',
  /* 51 */ 'Because you never let a birthday pass without making the person feel like the centre of the universe',
  /* 52 */ 'Because you prayed for our futures before we even knew who we wanted to become',
  /* 53 */ 'Because you are the kind of woman other women quietly look at and aspire to be',
  /* 54 */ 'Because your name — Victoria — was never just a name, it was a prophecy you lived out in full',
  /* 55 */ 'Because you chose kindness as a daily discipline, not just an occasional mood',
  /* 56 */ 'Because you are the reason we understand what home truly means',
  /* 57 */ 'Because when we did not know how to love each other, we watched how you loved us and learned',
  /* 58 */ 'Because you held this family together during the seasons that should have broken it',
  /* 59 */ 'Because your cooking is a love language that has no translation — it can only be tasted',
  /* 60 */ 'Because you never made your sacrifice a weapon — you gave freely and kept on giving',
  /* 61 */ 'Because your voice reading scripture in the early morning is one of the holiest sounds we have ever heard',
  /* 62 */ 'Because you told us the truth even when a comfortable lie would have been easier for both of us',
  /* 63 */ 'Because you modelled a marriage that made all of us believe in love as something real and lasting',
  /* 64 */ 'Because your patience outlasted every difficult season any of us ever brought to your door',
  /* 65 */ 'Because you always had a gift for the person in the room who felt invisible',
  /* 66 */ 'Because seventy years of your life have made this world measurably better — and that is rare',
  /* 67 */ 'Because you made motherhood look like the highest calling — not a sacrifice, but a privilege',
  /* 68 */ 'Because every one of your children carries a piece of your character — that is your true legacy',
  /* 69 */ 'Because the very best parts of all of us lead directly back to you',
  /* 70 */ 'Because you are Victoria Offodimma Chukwuemelie — and there will never, ever be another one like you',
];

/**
 * Quote rotator content — rotating emotional quotes shown between sections.
 * Customise with your own quotes or leave as is.
 */
const QUOTES = [
  {
    text: 'A mother is she who can take the place of all others but whose place no one else can take.',
    author: '— Cardinal Mermillod'
  },
  {
    text: 'The influence of a mother in the lives of her children is beyond calculation.',
    author: '— James E. Faust'
  },
  {
    text: 'She is clothed in strength and dignity, and she laughs without fear of the future.',
    author: '— Proverbs 31:25'
  },
  {
    text: 'A mother\'s love is more beautiful than any fresh flower.',
    author: '— Debasish Mridha'
  },
  {
    text: 'When everything else is uncertain, a mother\'s love remains the one constant.',
    author: ''
  },
  {
    text: 'Seventy years of grace, sacrifice, and love. That is not a life — that is a legacy.',
    author: ''
  },
];

/* ═══════════════════════════════════════════════════════════
   PHOTO COLLAGE IMAGES
   ═══════════════════════════════════════════════════════════ */

/**
 * 70 Years of Glory collage.
 * Add more image paths here to automatically expand the collage.
 */
const GLORY_IMAGES = [
  'assets/images/2.jpeg',
  'assets/images/3.jpeg',
  'assets/images/7.jpeg',
  'assets/images/9.jpeg',
  'assets/images/c.jpeg',
  'assets/images/g.jpeg',
];

/* ═══════════════════════════════════════════════════════════
   COUNTDOWN TIMER
   ═══════════════════════════════════════════════════════════ */
function initCountdown() {
  const target    = new Date(BIRTHDAY_DATE + 'T00:00:00');
  const timer     = document.getElementById('countdownTimer');
  const celebrate = document.getElementById('countdownCelebration');
  const headline  = document.getElementById('countdownHeader');

  if (!timer) return;

  const elDays    = document.getElementById('countDays');
  const elHours   = document.getElementById('countHours');
  const elMinutes = document.getElementById('countMinutes');
  const elSeconds = document.getElementById('countSeconds');

  function pad(n) { return String(n).padStart(2, '0'); }

  function animateDigit(el, newVal) {
    if (el.textContent === newVal) return;
    el.classList.remove('flip');
    void el.offsetWidth; // reflow to restart animation
    el.textContent = newVal;
    el.classList.add('flip');
    setTimeout(() => el.classList.remove('flip'), 300);
  }

  function tick() {
    const now  = new Date();
    const diff = target - now;

    if (diff <= 0) {
      // Birthday has arrived or passed
      timer.hidden     = true;
      celebrate.hidden = false;
      if (headline) {
        const h2 = headline.querySelector('.section-title');
        if (h2) {
          h2.innerHTML = 'Happy<br><em>70th Birthday!</em>';
        }
      }
      return; // stop ticking
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days    = Math.floor(totalSeconds / 86400);
    const hours   = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    animateDigit(elDays,    pad(days));
    animateDigit(elHours,   pad(hours));
    animateDigit(elMinutes, pad(minutes));
    animateDigit(elSeconds, pad(seconds));

    setTimeout(tick, 1000);
  }

  tick();
}

/* ═══════════════════════════════════════════════════════════
   SCROLL PROGRESS BAR
   ═══════════════════════════════════════════════════════════ */
function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;

  function update() {
    const scrollTop    = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight -
                         document.documentElement.clientHeight;
    const progress     = scrollHeight > 0
      ? (scrollTop / scrollHeight) * 100
      : 0;
    bar.style.width = `${progress}%`;
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ═══════════════════════════════════════════════════════════
   STICKY NAVBAR — .scrolled class on scroll
   ═══════════════════════════════════════════════════════════ */
function initNavbar() {
  const navbar    = document.getElementById('navbar');
  if (!navbar) return;

  let lastScroll  = 0;

  function update() {
    const scrollY = window.scrollY;

    if (scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScroll = scrollY;
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ═══════════════════════════════════════════════════════════
   MOBILE HAMBURGER MENU
   ═══════════════════════════════════════════════════════════ */
function initMobileMenu() {
  const toggle  = document.getElementById('navToggle');
  const menu    = document.getElementById('navMenu');
  if (!toggle || !menu) return;

  function open() {
    menu.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('nav-open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    isOpen ? close() : open();
  });

  // Close on nav link click
  menu.querySelectorAll('.navbar__link').forEach(link => {
    link.addEventListener('click', close);
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !toggle.contains(e.target)) {
      close();
    }
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
}

/* ═══════════════════════════════════════════════════════════
   CUSTOM CURSOR
   ═══════════════════════════════════════════════════════════ */
function initCustomCursor() {
  // Only on desktop with fine pointer
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const glow = document.getElementById('cursorGlow');
  const dot  = document.getElementById('cursorDot');
  if (!glow || !dot) return;

  let glowX = 0, glowY = 0;
  let dotX  = 0, dotY  = 0;
  let mouseX = 0, mouseY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = `${mouseX}px`;
    dot.style.top  = `${mouseY}px`;
  }, { passive: true });

  // Glow follows with smooth lag
  function animateGlow() {
    glowX += (mouseX - glowX) * 0.12;
    glowY += (mouseY - glowY) * 0.12;
    glow.style.left = `${glowX}px`;
    glow.style.top  = `${glowY}px`;
    requestAnimationFrame(animateGlow);
  }
  animateGlow();

  // Enlarge on interactive elements
  const interactives = 'a, button, .gallery__item, .tribute-card, .reason-card, .memory-card';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactives)) {
      glow.classList.add('cursor--hover');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactives)) {
      glow.classList.remove('cursor--hover');
    }
  });

  // Hide when leaving window
  document.addEventListener('mouseleave', () => {
    glow.style.opacity = '0';
    dot.style.opacity  = '0';
  });
  document.addEventListener('mouseenter', () => {
    glow.style.opacity = '1';
    dot.style.opacity  = '1';
  });
}

/* ═══════════════════════════════════════════════════════════
   QUOTE ROTATOR
   ═══════════════════════════════════════════════════════════ */
function initQuoteRotator() {
  const track = document.getElementById('quoteTrack');
  const dots  = document.getElementById('quoteDots');
  if (!track || !QUOTES.length) return;

  let current   = 0;
  let autoTimer = null;

  // Build quote elements
  QUOTES.forEach((q, i) => {
    const item = document.createElement('div');
    item.className   = 'quote-item' + (i === 0 ? ' active' : '');
    item.setAttribute('role', 'tab');
    item.setAttribute('aria-selected', i === 0 ? 'true' : 'false');

    const text   = document.createElement('p');
    text.className = 'quote-item__text';
    text.textContent = q.text;

    item.appendChild(text);

    if (q.author) {
      const author = document.createElement('p');
      author.className = 'quote-item__author';
      author.textContent = q.author;
      item.appendChild(author);
    }

    track.appendChild(item);

    // Dot
    const dot = document.createElement('button');
    dot.className = 'quote-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Show quote ${i + 1}`);
    dot.setAttribute('role', 'tab');
    dot.addEventListener('click', () => showQuote(i, true));
    dots.appendChild(dot);
  });

  const quoteItems = track.querySelectorAll('.quote-item');
  const dotItems   = dots.querySelectorAll('.quote-dot');

  function showQuote(index, resetTimer = false) {
    quoteItems[current].classList.remove('active');
    dotItems[current].classList.remove('active');

    current = (index + QUOTES.length) % QUOTES.length;

    quoteItems[current].classList.add('active');
    dotItems[current].classList.add('active');
    dotItems[current].setAttribute('aria-selected', 'true');

    if (resetTimer) {
      clearInterval(autoTimer);
      startAuto();
    }
  }

  function startAuto() {
    autoTimer = setInterval(() => {
      showQuote(current + 1);
    }, 4500);
  }

  startAuto();

  // Pause on hover
  const section = document.getElementById('quotes');
  if (section) {
    section.addEventListener('mouseenter', () => clearInterval(autoTimer));
    section.addEventListener('mouseleave', startAuto);
  }
}

/* ═══════════════════════════════════════════════════════════
   SMOOTH SCROLL for nav links (enhances default HTML behaviour)
   ═══════════════════════════════════════════════════════════ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();

      const navbarH = document.getElementById('navbar')?.offsetHeight ?? 80;
      const top     = target.getBoundingClientRect().top +
                      window.scrollY - navbarH - 16;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ═══════════════════════════════════════════════════════════
   70 REASONS GRID — renders flip cards from the REASONS array
   ═══════════════════════════════════════════════════════════ */
function initReasonsGrid() {
  const grid = document.getElementById('reasonsGrid');
  if (!grid) return;

  // Detect touch so we can label cards 'Tap' instead of 'Hover'
  const isTouchDevice = window.matchMedia('(hover: none)').matches;

  const fragment = document.createDocumentFragment();

  REASONS.forEach((reason, i) => {
    const num = i + 1;

    // Card wrapper
    const card = document.createElement('div');
    card.className = 'reason-card reveal-stagger';
    card.style.setProperty('--delay', `${Math.min(i * 0.025, 1.5)}s`);
    card.setAttribute('role', 'listitem');
    card.setAttribute('aria-label', `Reason ${num}: ${reason}`);
    card.setAttribute('tabindex', '0');

    // Inner (flip container)
    const inner = document.createElement('div');
    inner.className = 'reason-card__inner';
    inner.setAttribute('aria-hidden', 'true');

    // Front
    const front = document.createElement('div');
    front.className = 'reason-card__face reason-card__front';
    const hintLabel = isTouchDevice ? 'Tap' : 'Hover';
    front.innerHTML = `
      <span class="reason-card__num">${num}</span>
      <span class="reason-card__hint">${hintLabel}</span>
    `;

    // Back
    const back = document.createElement('div');
    back.className = 'reason-card__face reason-card__back';
    const backText = document.createElement('p');
    backText.className = 'reason-card__text';
    backText.textContent = reason;
    back.appendChild(backText);

    inner.appendChild(front);
    inner.appendChild(back);
    card.appendChild(inner);

    // Click / tap toggles flip (essential for touch devices — CSS :hover doesn't fire)
    card.addEventListener('click', () => card.classList.toggle('flipped'));

    // Keyboard: Space/Enter toggles flip
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.classList.toggle('flipped');
      }
    });

    fragment.appendChild(card);
  });

  grid.appendChild(fragment);

  // animations.js ran its IntersectionObserver BEFORE these cards existed,
  // so we create a local observer here to make them visible on scroll-in.
  const revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -20px 0px' }
  );
  grid.querySelectorAll('.reason-card').forEach(card => revealObserver.observe(card));
}

/* ═══════════════════════════════════════════════════════════
   PHOTO COLLAGE BUILDER
   ═══════════════════════════════════════════════════════════ */
function initPhotoCollages() {
  // ── Grandchildren collage ──────────────────────────────────────
  // Reads avatar images from every grandchild tribute card.
  // Add a new grandchild tribute card — the photo auto-appears here.
  const gcWrap = document.querySelector('[data-collage="grandchildren"]');
  if (gcWrap) {
    const avatars = document.querySelectorAll('#grandchildrenGrid .tribute-card__avatar');
    avatars.forEach(source => {
      const img = document.createElement('img');
      img.src       = source.src;
      img.alt       = source.alt;
      img.className = 'photo-collage__img';
      img.loading   = 'lazy';
      img.onerror   = () => img.remove(); // silently hide missing placeholder images
      gcWrap.appendChild(img);
    });
    gcWrap.classList.add('photo-collage--multi');
  }

  // ── 70 Years of Glory collage ───────────────────────────────
  // Add more paths to the GLORY_IMAGES array above to expand this.
  const gloryWrap = document.querySelector('[data-collage="glory"]');
  if (gloryWrap) {
    GLORY_IMAGES.forEach((src, i) => {
      const img = document.createElement('img');
      img.src       = src;
      img.alt       = `Celebration memory ${i + 1}`;
      img.className = 'photo-collage__img';
      img.loading   = 'lazy';
      img.onerror   = () => img.remove();
      gloryWrap.appendChild(img);
    });
    gloryWrap.classList.add('photo-collage--multi');
  }
}
/* ═══════════════════════════════════════════════════════════
   SMART FACE CROP
   Uses the Shape Detection API (FaceDetector) to auto-position
   every portrait so faces + chest are always centred in the frame.
   Runs on already-loaded images immediately, and defers to the
   native lazy-load ‘load’ event for below-fold images.
   Falls back silently to the CSS `object-position: top` default
   when the API is unavailable (Firefox, Safari, etc.).
   ═══════════════════════════════════════════════════════════ */
function initSmartFaceCrop() {
  if (typeof FaceDetector === 'undefined') return; // API unavailable — CSS handles it

  let detector;
  try {
    detector = new FaceDetector({ fastMode: true });
  } catch {
    return; // browser supports the class name but blocks instantiation
  }

  /**
   * Detects the largest face in `img` and sets object-position so the
   * crop shows from just above the forehead down to the chest.
   */
  async function cropToFace(img) {
    try {
      if (!img.naturalWidth) return; // broken / not loaded

      const faces = await detector.detect(img);
      if (!faces.length) return; // no face detected — keep CSS default

      // Pick the largest (most prominent) face in the frame
      const { boundingBox: box } = faces.reduce((best, candidate) =>
        candidate.boundingBox.width * candidate.boundingBox.height >
        best.boundingBox.width * best.boundingBox.height ? candidate : best
      );

      const nw = img.naturalWidth;
      const nh = img.naturalHeight;

      // Horizontal: centre on the face
      const x = ((box.left + box.width * 0.5) / nw * 100).toFixed(1);

      // Vertical: anchor ~10 % above the face top so the forehead has
      // breathing room; this naturally keeps chest in frame too.
      const y = Math.max(0, Math.min(90, ((box.top / nh) - 0.10) * 100)).toFixed(1);

      img.style.objectPosition = `${x}% ${y}%`;
    } catch (_) {
      // FaceDetector.detect() rejected (CORS, security, etc.) — CSS default applies
    }
  }

  const portraits = [
    ...document.querySelectorAll('.photo-collage__img'),
    ...document.querySelectorAll('.tribute-card__avatar'),
    ...document.querySelectorAll('.timeline__card-image'),
  ];

  portraits.forEach(img => {
    if (img.complete && img.naturalWidth) {
      cropToFace(img);                                    // already loaded
    } else {
      img.addEventListener('load', () => cropToFace(img), { once: true }); // lazy / pending
    }
  });
}
/* ═══════════════════════════════════════════════════════════
   TRIBUTE MARQUEE
   Clones each tribute card once so the strip is 2× wide, then
   drives a soft auto-scroll via requestAnimationFrame. Hover
   pauses it; click-and-drag, wheel, or touch lets the visitor
   scrub manually to a card they missed. When the visitor stops
   interacting, the gentle drift resumes from wherever they
   left off (no jump back to the start).
   ═══════════════════════════════════════════════════════════ */
function initTributeMarquee() {
  const strips = document.querySelectorAll('.tributes__grid--marquee');
  if (strips.length === 0) return;

  const reduceMotion =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  strips.forEach(strip => {
    // 1) Snapshot originals BEFORE cloning, otherwise we'd duplicate clones too.
    const originals = Array.from(strip.children);
    if (originals.length === 0) return;

    // Make originals visible immediately (they live inside an overflow:hidden
    // viewport, so a scroll-reveal observer may never see them intersect).
    originals.forEach(card => {
      card.classList.add('is-revealed');
      card.style.opacity = '1';
      card.style.transform = 'none';
    });

    // If the strip has too few cards to fill the viewport, cloning would just
    // show the same card twice side-by-side (e.g. siblings has 1 card). In that
    // case, skip cloning + auto-scroll and centre the cards statically.
    if (originals.length < 3) {
      strip.classList.add('tributes__grid--marquee-static');
      return;
    }

    originals.forEach(card => {
      const clone = card.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      clone.setAttribute('data-marquee-clone', '');
      clone.classList.remove(
        'reveal-stagger', 'reveal-fade-up',
        'reveal-fade-left', 'reveal-fade-right'
      );
      clone.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
      strip.appendChild(clone);
    });

    if (reduceMotion) return;

    const viewport = strip.parentElement;       // .tributes__marquee
    if (!viewport) return;
    const reverse = viewport.classList.contains('tributes__marquee--reverse');
    const isSm    = strip.classList.contains('tributes__grid--sm');
    const speed   = isSm ? 38 : 32;             // pixels per second
    const direction = reverse ? -1 : 1;

    let halfWidth = 0;
    let hoverPaused = false;
    let dragging = false;
    let userPauseUntil = 0;
    let lastTime = performance.now();

    const recomputeHalf = () => {
      // strip is exactly 2× the original content width (we cloned every child)
      halfWidth = strip.scrollWidth / 2;
      if (reverse && viewport.scrollLeft < 1) {
        // start a reverse marquee at the right end so it has room to drift left
        viewport.scrollLeft = halfWidth;
      }
    };
    // Wait for layout (images may still be sizing).
    requestAnimationFrame(() => requestAnimationFrame(recomputeHalf));
    window.addEventListener('resize', recomputeHalf);
    // If a portrait finishes loading later, our half-width may shift slightly.
    strip.querySelectorAll('img').forEach(img => {
      if (!img.complete) img.addEventListener('load', recomputeHalf, { once: true });
    });

    // ── Hover / focus pause ────────────────────────────────
    viewport.addEventListener('mouseenter', () => { hoverPaused = true; });
    viewport.addEventListener('mouseleave', () => { hoverPaused = false; });
    viewport.addEventListener('focusin',    () => { hoverPaused = true; });
    viewport.addEventListener('focusout',   () => { hoverPaused = false; });

    // ── Drag / swipe to scrub (pointer = mouse + pen + touch) ──
    let startX = 0;
    let startScroll = 0;
    let pointerId = null;
    let dragMoved = false;

    viewport.addEventListener('pointerdown', e => {
      if (e.button !== undefined && e.button !== 0) return; // left-click / touch only
      dragging = true;
      dragMoved = false;
      startX = e.clientX;
      startScroll = viewport.scrollLeft;
      pointerId = e.pointerId;
      viewport.classList.add('is-grabbing');
      try { viewport.setPointerCapture(e.pointerId); } catch (_) {}
    });

    viewport.addEventListener('pointermove', e => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 3) dragMoved = true;
      viewport.scrollLeft = startScroll - dx;
    });

    const endDrag = e => {
      if (!dragging) return;
      dragging = false;
      viewport.classList.remove('is-grabbing');
      if (pointerId !== null) {
        try { viewport.releasePointerCapture(pointerId); } catch (_) {}
        pointerId = null;
      }
      // After releasing, give the visitor ~1.8s of stillness before drift resumes.
      userPauseUntil = performance.now() + 1800;
    };
    viewport.addEventListener('pointerup',     endDrag);
    viewport.addEventListener('pointercancel', endDrag);

    // Prevent a drag-release from firing a card-internal click by accident
    viewport.addEventListener('click', e => {
      if (dragMoved) {
        e.preventDefault();
        e.stopPropagation();
        dragMoved = false;
      }
    }, true);

    // ── Mouse-wheel: vertical wheel scrubs horizontally ────
    viewport.addEventListener('wheel', e => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        viewport.scrollLeft += e.deltaY;
        userPauseUntil = performance.now() + 1800;
        e.preventDefault();
      }
    }, { passive: false });

    // ── Touch & keyboard scroll also pause briefly ─────────
    viewport.addEventListener('scroll', () => {
      // If the visitor scrolled by means other than our rAF (touch flick, etc.)
      // we still want to back off auto-scroll briefly. Cheap heuristic: any time
      // the visitor's pointer is over the strip and they're not in drag, treat
      // a scroll event as user-initiated.
    }, { passive: true });

    // ── Auto-scroll loop ───────────────────────────────────
    function tick(now) {
      const dt = Math.min(48, now - lastTime);
      lastTime = now;

      const canDrift =
        !hoverPaused && !dragging && now > userPauseUntil && halfWidth > 0;

      if (canDrift) {
        viewport.scrollLeft += (speed * direction * dt) / 1000;
      }

      // Seamless wrap — we have two identical halves, so jumping by half is invisible
      if (halfWidth > 0) {
        if (viewport.scrollLeft >= halfWidth) {
          viewport.scrollLeft -= halfWidth;
        } else if (viewport.scrollLeft < 0) {
          viewport.scrollLeft += halfWidth;
        }
      }

      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}

/* ═══════════════════════════════════════════════════════════
   INIT — runs after DOM is ready
   ═══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initReasonsGrid();     // build 70 reasons cards first (needed by scroll-reveal)
  initPhotoCollages();   // build timeline photo collages
  initTributeMarquee();  // clone tribute cards for seamless marquee loop
  initSmartFaceCrop();   // auto-position all portraits to show face + chest
  initCountdown();
  initScrollProgress();
  initNavbar();
  initMobileMenu();
  initQuoteRotator();
  initSmoothScroll();
});
