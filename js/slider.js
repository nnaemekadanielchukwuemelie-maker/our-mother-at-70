/* ════════════════════════════════════════════════════════════
   slider.js, Our Mother at 70
   Gallery Lightbox · Lazy Image Loading · Video Modal
   ════════════════════════════════════════════════════════════ */

'use strict';

/* ─── 1. LAZY IMAGE LOADER ───────────────────────────────── */
function initLazyImages() {
  const lazyImages = document.querySelectorAll('img.lazy[data-src]');
  if (!lazyImages.length) return;

  const lazyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.dataset.src;
          if (src) {
            img.src = src;
            img.removeAttribute('data-src');
            img.classList.remove('lazy');
          }
          lazyObserver.unobserve(img);
        }
      });
    },
    {
      rootMargin: '200px 0px',
      threshold: 0
    }
  );

  lazyImages.forEach(img => lazyObserver.observe(img));
}

/* ─── 2. GALLERY LIGHTBOX ────────────────────────────────── */
class Lightbox {
  constructor() {
    this.lightbox       = document.getElementById('lightbox');
    this.lightboxImg    = document.getElementById('lightboxImg');
    this.lightboxCaption = document.getElementById('lightboxCaption');
    this.lightboxCounter = document.getElementById('lightboxCounter');
    this.closeBtn       = document.getElementById('lightboxClose');
    this.prevBtn        = document.getElementById('lightboxPrev');
    this.nextBtn        = document.getElementById('lightboxNext');
    this.backdrop       = document.getElementById('lightboxBackdrop');

    this.currentIndex   = 0;
    this.images         = [];
    this.isOpen         = false;

    if (!this.lightbox) return;

    this.collectImages();
    this.bindEvents();
  }

  collectImages() {
    const figures = document.querySelectorAll('.gallery__item');
    this.images = Array.from(figures).map(fig => {
      const img     = fig.querySelector('.gallery__photo');
      const caption = fig.querySelector('.gallery__caption');
      return {
        src:     img ? (img.dataset.src || img.src) : '',
        alt:     img ? img.alt : '',
        caption: caption ? caption.textContent.trim() : ''
      };
    });
  }

  open(index) {
    if (!this.images.length) return;
    this.currentIndex = index;
    this.updateContent();
    this.lightbox.hidden = false;
    this.isOpen = true;
    document.body.style.overflow = 'hidden';
    this.lightbox.focus();
  }

  close() {
    this.lightbox.hidden = true;
    this.isOpen = false;
    document.body.style.overflow = '';
    // Return focus to the gallery item that was clicked
    const figures = document.querySelectorAll('.gallery__item');
    if (figures[this.currentIndex]) {
      figures[this.currentIndex].focus();
    }
  }

  goTo(index) {
    this.currentIndex = (index + this.images.length) % this.images.length;
    this.updateContent();
  }

  prev() { this.goTo(this.currentIndex - 1); }
  next() { this.goTo(this.currentIndex + 1); }

  updateContent() {
    const data = this.images[this.currentIndex];
    if (!data) return;

    this.lightboxImg.src = data.src;
    this.lightboxImg.alt = data.alt;
    this.lightboxCaption.textContent = data.caption;
    this.lightboxCounter.textContent =
      `${this.currentIndex + 1} / ${this.images.length}`;
  }

  bindEvents() {
    // Gallery item clicks
    document.querySelectorAll('.gallery__item').forEach((fig, idx) => {
      fig.addEventListener('click', () => this.open(idx));
      // Keyboard accessibility
      fig.setAttribute('tabindex', '0');
      fig.setAttribute('role', 'button');
      fig.setAttribute('aria-label', `View photo ${idx + 1}`);
      fig.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.open(idx);
        }
      });
    });

    // Close button
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }

    // Backdrop click
    if (this.backdrop) {
      this.backdrop.addEventListener('click', () => this.close());
    }

    // Navigation buttons
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.prev();
      });
    }
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.next();
      });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!this.isOpen) return;
      switch (e.key) {
        case 'Escape':   this.close(); break;
        case 'ArrowLeft':  this.prev();  break;
        case 'ArrowRight': this.next();  break;
      }
    });

    // Swipe support (touch)
    let touchStartX = 0;
    this.lightbox.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    this.lightbox.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(dx) > 50) {
        dx < 0 ? this.next() : this.prev();
      }
    }, { passive: true });
  }
}

/* ─── 3. TRIBUTE MUSIC, Local MP3 + YouTube backup + Web Audio piano ── */
/* Tier 1: local MP3 (Dolly Parton, "Eagle When She Flies", the actual song) */
/* Tier 2: YouTube IFrame embed of the same song (official VEVO), used if mp3 missing/blocked */
/* Tier 3: Web Audio synth "For You, Mummy" (C major, 66 BPM), final fallback */

const TRIBUTE_MUSIC_FILE =
  'assets/music/Dolly_Parton_-_Eagle_When_She_Flies256k.mp3';
const TRIBUTE_YOUTUBE_ID = 'Mb1Rufxem_4'; // youtu.be/Mb1Rufxem_4, DollyPartonVEVO official

/* Lazy-loads the YouTube IFrame Player API exactly once. */
let _ytApiPromise = null;
function loadYouTubeIframeAPI() {
  if (_ytApiPromise) return _ytApiPromise;
  _ytApiPromise = new Promise((resolve, reject) => {
    if (window.YT && window.YT.Player) { resolve(window.YT); return; }
    const prevCb = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = function () {
      if (typeof prevCb === 'function') { try { prevCb(); } catch (e) {} }
      resolve(window.YT);
    };
    const s = document.createElement('script');
    s.src = 'https://www.youtube.com/iframe_api';
    s.async = true;
    s.onerror = () => reject(new Error('YouTube IFrame API failed to load'));
    document.head.appendChild(s);
    setTimeout(() => reject(new Error('YouTube IFrame API timeout')), 6000);
  });
  return _ytApiPromise;
}

class TributeMusic {
  constructor() {
    this._mode       = null;   // 'file' | 'youtube' | 'synth'
    this._audioEl    = null;   // HTMLAudioElement when mode=file
    this._fileCtx    = null;   // AudioContext routing <audio> on iOS/Android
    this._fileSrc    = null;   // MediaElementAudioSourceNode
    this._fileGain   = null;   // GainNode in front of destination
    this._unlockHandler = null;// one-shot pointer listener to resume on tap
    this._ytPlayer   = null;   // YT.Player instance when mode=youtube
    this._ytHost     = null;   // hidden <div> host element for the iframe
    this._ctx        = null;
    this._master     = null;
    this._reverb     = null;
    this._dry        = null;
    this._isPlaying  = false;
    this._isMuted    = false;
    this._loopTimer  = null;
    this._BEAT       = 60 / 66;
    this._LOOP_BEATS = 32;
    /* [beat, freq_Hz, dur_beats, velocity] */
    this._MELODY = [
      [0,    659.25, 1.5, 0.62], [1.5, 587.33, 0.5, 0.48],
      [2,    523.25, 1.5, 0.58], [3.5, 440.00, 0.5, 0.44],
      [4,    392.00, 0.5, 0.52], [4.5, 440.00, 0.5, 0.56],
      [5,    523.25, 1.0, 0.62], [6,   659.25, 2.0, 0.68],
      [8,    349.23, 0.5, 0.55], [8.5, 392.00, 0.5, 0.52],
      [9,    440.00, 0.5, 0.58], [9.5, 523.25, 1.0, 0.62],
      [10.5, 587.33, 0.5, 0.55], [11,  523.25, 1.0, 0.52],
      [12,   392.00, 0.5, 0.58], [12.5,440.00, 0.5, 0.58],
      [13,   493.88, 1.0, 0.62], [14,  587.33, 1.5, 0.65],
      [15.5, 493.88, 0.5, 0.52],
      [16,   523.25, 0.5, 0.68], [16.5,659.25, 0.5, 0.72],
      [17,   783.99, 1.5, 0.78], [18.5,659.25, 1.5, 0.70],
      [20,   523.25, 0.5, 0.62], [20.5,440.00, 0.5, 0.58],
      [21,   493.88, 0.5, 0.60], [21.5,523.25, 1.5, 0.62],
      [23,   440.00, 1.0, 0.52],
      [24,   349.23, 0.5, 0.55], [24.5,440.00, 0.5, 0.60],
      [25,   523.25, 2.0, 0.65], [27,  440.00, 1.0, 0.50],
      [28,   493.88, 0.5, 0.60], [28.5,392.00, 0.5, 0.56],
      [29,   440.00, 0.5, 0.58], [29.5,523.25, 1.0, 0.68],
      [30.5, 587.33, 0.5, 0.62], [31,  659.25, 1.0, 0.65],
    ];
    this._BASS = [
      [0,  130.81, 3.5, 0.36], [4,  110.00, 3.5, 0.33],
      [8,   87.31, 3.5, 0.30], [12,  98.00, 3.5, 0.33],
      [16, 130.81, 3.5, 0.36], [20, 110.00, 3.5, 0.33],
      [24,  87.31, 3.5, 0.30], [28,  98.00, 3.5, 0.33],
    ];
    this._PADS = [
      [0,  [130.81,164.81,196.00], 4.8, 0.11],
      [4,  [110.00,130.81,164.81], 4.8, 0.09],
      [8,  [ 87.31,110.00,130.81], 4.8, 0.08],
      [12, [ 98.00,123.47,146.83], 4.8, 0.09],
      [16, [130.81,164.81,196.00], 4.8, 0.11],
      [20, [110.00,130.81,164.81], 4.8, 0.09],
      [24, [ 87.31,110.00,130.81], 4.8, 0.08],
      [28, [ 98.00,123.47,146.83], 4.8, 0.09],
    ];
  }

  async start() {
    if (this._isPlaying) return;

    /* ── Tier 1: local MP3 (the actual song) ──
       Mobile notes:
       • iPhone's side mute switch silences plain <audio> playback even at full
         volume, routing through an AudioContext bypasses that behaviour.
       • Android Chrome's autoplay heuristics are happier when playback starts
         synchronously inside the user-gesture stack, so we do NOT await ctx
         operations before el.play(). */
    try {
      const el  = new Audio();
      el.src         = TRIBUTE_MUSIC_FILE;
      el.loop        = true;
      el.preload     = 'auto';
      el.playsInline = true;
      el.setAttribute('playsinline', '');
      el.setAttribute('webkit-playsinline', '');
      el.volume      = this._isMuted ? 0 : 0.85;

      let ctx = null, srcNode = null, gainNode = null;
      try {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (AC) {
          ctx = new AC();
          srcNode  = ctx.createMediaElementSource(el);
          gainNode = ctx.createGain();
          gainNode.gain.value = this._isMuted ? 0 : 1.0;
          srcNode.connect(gainNode).connect(ctx.destination);
          if (ctx.state === 'suspended') {
            // fire-and-forget, awaiting would break the gesture chain on iOS
            ctx.resume().catch(() => {});
          }
        }
      } catch (e) { /* MediaElementSource unsupported, plain <audio> still works */ }

      await el.play();          // rejects if file missing or autoplay blocked
      this._audioEl    = el;
      this._fileCtx    = ctx;
      this._fileSrc    = srcNode;
      this._fileGain   = gainNode;
      this._mode       = 'file';
      this._isPlaying  = true;

      // Belt-and-braces: if the browser pauses us shortly after (some mobile
      // browsers do this when a modal animates in), retry on the next tap.
      const retry = () => {
        if (!this._audioEl) return;
        if (this._fileCtx && this._fileCtx.state === 'suspended') {
          this._fileCtx.resume().catch(() => {});
        }
        const p = this._audioEl.play();
        if (p && typeof p.catch === 'function') p.catch(() => {});
      };
      this._unlockHandler = retry;
      document.addEventListener('touchend', retry, { once: true, passive: true });
      document.addEventListener('click',    retry, { once: true });
      return;
    } catch (_) { /* fall through to YouTube */ }

    /* ── Tier 2: official YouTube embed of the same song ── */
    try {
      const YT = await loadYouTubeIframeAPI();
      const host = document.createElement('div');
      host.setAttribute('aria-hidden', 'true');
      host.style.cssText =
        'position:fixed;left:-9999px;top:-9999px;width:1px;height:1px;' +
        'opacity:0;pointer-events:none;overflow:hidden;';
      document.body.appendChild(host);
      const isMuted = this._isMuted;
      const player = await new Promise((resolve, reject) => {
        let settled = false;
        const p = new YT.Player(host, {
          width: '1', height: '1',
          videoId: TRIBUTE_YOUTUBE_ID,
          playerVars: {
            autoplay: 1, controls: 0, modestbranding: 1, rel: 0,
            playsinline: 1, fs: 0, disablekb: 1, iv_load_policy: 3,
            loop: 1, playlist: TRIBUTE_YOUTUBE_ID,
          },
          events: {
            onReady: () => { if (!settled) { settled = true; resolve(p); } },
            onError: (e) => { if (!settled) { settled = true; reject(new Error('YT error ' + (e && e.data))); } },
          },
        });
        setTimeout(() => { if (!settled) { settled = true; reject(new Error('YT ready timeout')); } }, 8000);
      });
      try { player.setVolume(isMuted ? 0 : 85); } catch (e) {}
      if (isMuted) { try { player.mute(); } catch (e) {} }
      try { player.playVideo(); } catch (e) {}
      this._ytPlayer  = player;
      this._ytHost    = host;
      this._mode      = 'youtube';
      this._isPlaying = true;
      return;
    } catch (_) {
      /* network blocked, ad-blocker stripped the iframe, etc., fall through */
      if (this._ytHost && this._ytHost.parentNode) {
        this._ytHost.parentNode.removeChild(this._ytHost);
      }
      this._ytPlayer = null;
      this._ytHost   = null;
    }

    /* ── Tier 3: Web Audio synth ── */
    this._mode = 'synth';
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    this._ctx    = new AC();
    this._master = this._ctx.createGain();
    this._master.gain.setValueAtTime(0, this._ctx.currentTime);
    this._master.connect(this._ctx.destination);
    const conv = this._ctx.createConvolver();
    conv.buffer  = this._makeIR(2.8, 2.4);
    const wg = this._ctx.createGain();
    wg.gain.value = 0.38;
    conv.connect(wg); wg.connect(this._master);
    this._reverb = conv;
    this._dry = this._ctx.createGain();
    this._dry.gain.value = 0.70;
    this._dry.connect(this._master);
    const play = () => this._beginPlayback();
    this._ctx.state === 'suspended'
      ? this._ctx.resume().then(play).catch(() => {})
      : play();
  }

  stop() {
    this._isPlaying = false;
    clearInterval(this._loopTimer);
    if (this._unlockHandler) {
      document.removeEventListener('touchend', this._unlockHandler);
      document.removeEventListener('click',    this._unlockHandler);
      this._unlockHandler = null;
    }
    if (this._audioEl) {
      this._audioEl.pause();
      this._audioEl.currentTime = 0;
      this._audioEl = null;
    }
    if (this._fileCtx) {
      const fctx = this._fileCtx;
      try { fctx.close(); } catch (e) {}
      this._fileCtx = this._fileSrc = this._fileGain = null;
    }
    if (this._ytPlayer) {
      try { this._ytPlayer.stopVideo(); } catch (e) {}
      try { this._ytPlayer.destroy(); } catch (e) {}
      this._ytPlayer = null;
    }
    if (this._ytHost && this._ytHost.parentNode) {
      this._ytHost.parentNode.removeChild(this._ytHost);
    }
    this._ytHost = null;
    if (this._master && this._ctx) {
      const now = this._ctx.currentTime;
      this._master.gain.cancelScheduledValues(now);
      this._master.gain.setValueAtTime(this._master.gain.value, now);
      this._master.gain.linearRampToValueAtTime(0, now + 1.2);
      const ctx = this._ctx;
      setTimeout(() => { try { ctx.close(); } catch(e) {} }, 1350);
    }
    this._ctx = this._master = this._reverb = this._dry = null;
    this._mode = null;
  }

  setMuted(muted) {
    this._isMuted = muted;
    if (this._audioEl) {
      this._audioEl.volume = muted ? 0 : 0.85;
    }
    if (this._ytPlayer) {
      try { muted ? this._ytPlayer.mute() : this._ytPlayer.unMute(); } catch (e) {}
      try { this._ytPlayer.setVolume(muted ? 0 : 85); } catch (e) {}
    }
    if (this._master && this._ctx) {
      const now = this._ctx.currentTime;
      this._master.gain.cancelScheduledValues(now);
      this._master.gain.setValueAtTime(this._master.gain.value, now);
      this._master.gain.linearRampToValueAtTime(muted ? 0 : 0.88, now + 0.4);
    }
  }

  _beginPlayback() {
    if (!this._ctx || !this._master) return;
    this._isPlaying = true;
    const now = this._ctx.currentTime;
    this._master.gain.cancelScheduledValues(now);
    this._master.gain.setValueAtTime(0, now);
    this._master.gain.linearRampToValueAtTime(this._isMuted ? 0 : 0.88, now + 2.0);
    const startAt = now + 0.05;
    const loopDur = this._scheduleLoop(startAt);
    let nextAt    = startAt + loopDur;
    this._loopTimer = setInterval(() => {
      if (!this._isPlaying) return;
      this._scheduleLoop(nextAt);
      nextAt += loopDur;
    }, (loopDur - 2.0) * 1000);
  }

  _makeIR(dur, dec) {
    const sr  = this._ctx.sampleRate;
    const len = Math.ceil(sr * dur);
    const buf = this._ctx.createBuffer(2, len, sr);
    for (let c = 0; c < 2; c++) {
      const ch = buf.getChannelData(c);
      for (let i = 0; i < len; i++)
        ch[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, dec);
    }
    return buf;
  }

  _note(freq, t, durB, vel, bass) {
    if (!this._ctx) return;
    const dur  = durB * this._BEAT;
    const peak = vel * (bass ? 0.44 : 0.60);
    const rel  = Math.min(dur * 0.55, bass ? 1.1 : 0.85);
    const o1   = this._ctx.createOscillator();
    o1.type            = bass ? 'sine' : 'triangle';
    o1.frequency.value = freq;
    const o2   = this._ctx.createOscillator();
    o2.type            = 'sine';
    o2.frequency.value = freq * (bass ? 1.5 : 2);
    const g2   = this._ctx.createGain();
    g2.gain.value      = bass ? 0.10 : 0.16;
    const flt  = this._ctx.createBiquadFilter();
    flt.type           = 'lowpass';
    flt.frequency.value= bass ? 480 : 2400;
    const env  = this._ctx.createGain();
    const atk  = bass ? 0.07 : 0.010;
    const dec2 = bass ? 0.45 : 0.28;
    const sus  = bass ? 0.30 : 0.45;
    env.gain.setValueAtTime(0, t);
    env.gain.linearRampToValueAtTime(peak,       t + atk);
    env.gain.linearRampToValueAtTime(peak * sus, t + atk + dec2);
    env.gain.setValueAtTime(peak * sus,          t + dur - rel);
    env.gain.linearRampToValueAtTime(0,          t + dur);
    o2.connect(g2); g2.connect(flt); o1.connect(flt);
    flt.connect(env); env.connect(this._dry); env.connect(this._reverb);
    o1.start(t); o2.start(t);
    o1.stop(t + dur + 0.12); o2.stop(t + dur + 0.12);
  }

  _pad(freqs, t, durB, vel) {
    if (!this._ctx) return;
    const dur  = durB * this._BEAT;
    const peak = vel * 0.55;
    const rel  = Math.min(dur * 0.45, 2.0);
    freqs.forEach(freq => {
      const o = this._ctx.createOscillator();
      o.type = 'sine'; o.frequency.value = freq;
      const e = this._ctx.createGain();
      e.gain.setValueAtTime(0, t);
      e.gain.linearRampToValueAtTime(peak, t + 0.90);
      e.gain.setValueAtTime(peak, t + dur - rel);
      e.gain.linearRampToValueAtTime(0,    t + dur);
      o.connect(e); e.connect(this._reverb);
      o.start(t); o.stop(t + dur + 0.1);
    });
  }

  _scheduleLoop(startAt) {
    const B   = this._BEAT;
    const dur = this._LOOP_BEATS * B;
    this._MELODY.forEach(([b,f,d,v]) => this._note(f, startAt + b*B, d, v, false));
    this._BASS.forEach(  ([b,f,d,v]) => this._note(f, startAt + b*B, d, v, true));
    this._PADS.forEach(  ([b,f,d,v]) => this._pad( f, startAt + b*B, d, v));
    return dur;
  }
}

/* ─── 4. TRIBUTE FILM, Cinematic Photo Slideshow ───────── */
/* Keyboard: ← → for prev/next · Space to play/pause · M to mute · Esc to close */

const TRIBUTE_SLIDES = [
  { src: 'assets/images/1.jpeg',   cap: 'Victoria Offodimma Chukwuemelie', sub: 'Our Heart. Our Home.' },
  { src: 'assets/images/a.jpeg',   cap: '1956, Born in Gabon',            sub: 'With a pen in her hand' },
  { src: 'assets/images/30.png',   cap: 'A Daughter Like Papa',            sub: '' },
  { src: 'assets/images/31.jpg',   cap: 'Growing Up with Grace',           sub: '' },
  { src: 'assets/images/10.jpeg',  cap: '1980, The Covenant of Love',     sub: 'The day everything began' },
  { src: 'assets/images/15.jpg',   cap: 'A Woman of Extraordinary Love',   sub: '' },
  { src: 'assets/images/e.jpeg',   cap: 'Ten Gifts from Heaven',           sub: '' },
  { src: 'assets/images/8.jpeg',   cap: 'Her Beloved Family',              sub: '' },
  { src: 'assets/images/12.jpeg',  cap: 'With Her Children',               sub: '' },
  { src: 'assets/images/f.jpg',    cap: 'A Life in Education',             sub: '' },
  { src: 'assets/images/4.jpeg',   cap: 'Dedicated and Devoted',           sub: '' },
  { src: 'assets/images/11.jpeg',  cap: 'A Legacy of Learning',            sub: '' },
  { src: 'assets/images/9.jpeg',   cap: 'Service and Sacrifice',           sub: '' },
  { src: 'assets/images/2.jpeg',   cap: 'Seventy Years of Glory',          sub: '' },
  { src: 'assets/images/3.jpeg',   cap: 'Victoria',                        sub: '' },
  { src: 'assets/images/5.jpeg',   cap: 'A Life Well Lived',               sub: '' },
  { src: 'assets/images/6.jpeg',   cap: 'Our Heart, Our Home',             sub: '' },
  { src: 'assets/images/7.jpeg',   cap: '',                                sub: '' },
  { src: 'assets/images/b.jpeg',   cap: 'Timeless Grace',                  sub: '' },
  { src: 'assets/images/c.jpeg',   cap: '',                                sub: '' },
  { src: 'assets/images/g.jpeg',   cap: '',                                sub: '' },
  { src: 'assets/images/20.jpeg',  cap: 'Nkechi',                          sub: 'Eighth Born' },
  { src: 'assets/images/21.jpeg',  cap: 'Ijeoma',                          sub: 'Fourth Born' },
  { src: 'assets/images/24.jpeg',  cap: 'Chisimdi',                        sub: 'Last Born' },
  { src: 'assets/images/25.jpeg',  cap: 'Nnaemeka',                        sub: 'Ninth Born' },
  { src: 'assets/images/50.jpeg',  cap: 'Job Otutubuike',                  sub: 'Her Beloved Brother' },
  { src: 'assets/images/PHOTO-2026-05-12-14-38-06.jpg',   cap: 'Family Portrait',          sub: '' },
  { src: 'assets/images/PHOTO-2026-05-12-14-38-06_1.jpg', cap: 'Surrounded by Love',       sub: '' },
  { src: 'assets/images/PHOTO-2026-05-12-14-38-07_1.jpg', cap: 'Captured with Love',       sub: '' },
  { src: 'assets/images/PHOTO-2026-05-12-14-38-07_2.jpg', cap: 'Seventy Years of Glory',   sub: '' },
  { src: 'assets/images/WhatsApp%20Image%202026-05-12%20at%2013.20.32.jpeg',     cap: 'A Family Memory',          sub: '' },
  { src: 'assets/images/WhatsApp%20Image%202026-05-12%20at%2013.20.33.jpeg',     cap: 'The Heart of Our Home',    sub: '' },
  { src: 'assets/images/WhatsApp%20Image%202026-05-12%20at%2013.20.34.jpeg',     cap: 'Memories That Last Forever', sub: '' },
  { src: 'assets/images/WhatsApp%20Image%202026-05-12%20at%2013.20.35%20%281%29.jpeg', cap: 'Victoria, Our Lighthouse', sub: '' },
  { src: 'assets/images/WhatsApp%20Image%202026-05-12%20at%2013.20.35.jpeg',     cap: 'Love Multiplied',          sub: '' },
  { src: 'assets/images/22.jpeg',  cap: 'Chukwuekeka',                     sub: 'Grandchild' },
  { src: 'assets/images/23.jpeg',  cap: 'Oluchi',                          sub: 'Grandchild' },
];

class TributeFilm {
  constructor() {
    this.modal        = document.getElementById('tributeFilmModal');
    this.layerA       = document.getElementById('tributeLayerA');
    this.layerB       = document.getElementById('tributeLayerB');
    this.imgA         = document.getElementById('tributeImgA');
    this.imgB         = document.getElementById('tributeImgB');
    this.blurA        = document.getElementById('tributeBlurA');
    this.blurB        = document.getElementById('tributeBlurB');
    this.progressFill = document.getElementById('tributeProgressFill');
    this.captionMain  = document.getElementById('tributeCaptionMain');
    this.captionSub   = document.getElementById('tributeCaptionSub');
    this.counterCur   = document.getElementById('tributeCounterCur');
    this.counterTotal = document.getElementById('tributeCounterTotal');
    this.playPauseBtn = document.getElementById('tributePlayPauseBtn');
    this.muteBtn      = document.getElementById('tributeMuteBtn');
    this._music       = null;   // TributeMusic instance, created on open()

    if (!this.modal) return;

    this.slides      = TRIBUTE_SLIDES;
    this.current     = 0;
    this.isPlaying   = false;
    this.isMuted     = false;
    this.activeLayer = 'A';   // which layer is currently on top
    this.timer       = null;
    this.capTimer    = null;

    this.SLIDE_DUR   = 6000;  // ms per slide
    this.FADE_DUR    = 1500;  // ms for crossfade
    this.KB_CLASSES  = ['kb-1', 'kb-2', 'kb-3', 'kb-4', 'kb-5', 'kb-6'];

    if (this.counterTotal) {
      this.counterTotal.textContent = this.slides.length;
    }

    this._bindEvents();
  }

  /* ── Public: open the film ─────────────────────────────── */
  open() {
    this.modal.hidden = false;
    document.body.style.overflow = 'hidden';
    this.modal.focus();

    /* Create music engine, guarded so a failure never stops the slideshow */
    try {
      this._music = new TributeMusic();
    } catch (e) {
      this._music = null;
    }

    this.current = 0;
    this._loadSlide(0, true);
    this._play();           // sets isPlaying=true, syncs music mute state

    try { this._music?.start(); } catch (e) {}
  }

  /* ── Public: close the film ────────────────────────────── */
  close() {
    clearTimeout(this.timer);
    clearTimeout(this.capTimer);
    this.isPlaying = false;
    this.modal.hidden = true;
    document.body.style.overflow = '';
    this._music?.stop();
    this._music = null;
    document.getElementById('tributeFilmPlayBtn')?.focus();
  }

  /* ── Private: load a slide into the inactive layer ─────── */
  _loadSlide(index, immediate) {
    const slide   = this.slides[index];
    if (!slide) return;

    const kbClass        = this.KB_CLASSES[index % this.KB_CLASSES.length];
    const incomingLayer  = this.activeLayer === 'A' ? this.layerB : this.layerA;
    const incomingImg    = this.activeLayer === 'A' ? this.imgB   : this.imgA;
    const outgoingLayer  = this.activeLayer === 'A' ? this.layerA : this.layerB;

    /* Prepare incoming image with new Ken Burns class */
    this._applyKB(incomingImg, slide.src, kbClass);

    if (immediate) {
      /* First load, no crossfade, just snap */
      incomingLayer.style.transition = 'none';
      incomingLayer.style.opacity    = '1';
      incomingLayer.style.zIndex     = '2';
      outgoingLayer.style.transition = 'none';
      outgoingLayer.style.opacity    = '0';
      outgoingLayer.style.zIndex     = '1';
    } else {
      /* Crossfade: fade incoming in over outgoing */
      incomingLayer.style.zIndex     = '2';
      incomingLayer.style.transition = 'none';
      incomingLayer.style.opacity    = '0';
      /* Force reflow so transition fires */
      void incomingLayer.offsetWidth;
      incomingLayer.style.transition = `opacity ${this.FADE_DUR}ms cubic-bezier(0.4,0,0.2,1)`;
      incomingLayer.style.opacity    = '1';

      /* Fade out the outgoing layer slightly after */
      setTimeout(() => {
        outgoingLayer.style.transition = `opacity ${this.FADE_DUR}ms cubic-bezier(0.4,0,0.2,1)`;
        outgoingLayer.style.opacity    = '0';
        outgoingLayer.style.zIndex     = '1';
      }, 80);
    }

    /* Swap active tracker */
    this.activeLayer = this.activeLayer === 'A' ? 'B' : 'A';

    /* Update UI */
    this._updateCaption(slide);
    this._updateProgress(index);
    if (this.counterCur) this.counterCur.textContent = index + 1;
  }

  /* ── Private: apply ken-burns class and restart animation ─ */
  _applyKB(imgEl, src, kbClass) {
    /* Update the blurred cinematic backdrop for this layer */
    const blurEl = imgEl.id === 'tributeImgA' ? this.blurA : this.blurB;
    if (blurEl) {
      blurEl.style.backgroundImage = `url("${src}")`;
      /* Restart Ken Burns animation on the backdrop */
      this.KB_CLASSES.forEach(c => blurEl.classList.remove(c));
      blurEl.style.animation = 'none';
      void blurEl.offsetWidth;   // reflow to reset animation
      blurEl.style.animation = '';
      blurEl.classList.add(kbClass);
    }
    /* Foreground photo, swap src, stays fully visible (object-fit: contain) */
    imgEl.src = src;
  }

  /* ── Private: caption fade update ─────────────────────── */
  _updateCaption(slide) {
    if (!this.captionMain) return;
    clearTimeout(this.capTimer);
    this.captionMain.classList.remove('caption-visible');
    this.capTimer = setTimeout(() => {
      this.captionMain.textContent = slide.cap || '';
      if (this.captionSub) this.captionSub.textContent = slide.sub || '';
      if (slide.cap) this.captionMain.classList.add('caption-visible');
    }, 500);
  }

  /* ── Private: progress bar ─────────────────────────────── */
  _updateProgress(index) {
    if (!this.progressFill) return;
    const pct = ((index + 1) / this.slides.length) * 100;
    this.progressFill.style.transition = 'none';
    void this.progressFill.offsetWidth;
    this.progressFill.style.transition = `width ${this.SLIDE_DUR}ms linear`;
    this.progressFill.style.width      = `${pct}%`;
  }

  /* ── Private: play ─────────────────────────────────────── */
  _play() {
    this.isPlaying = true;
    if (this.playPauseBtn) {
      this.playPauseBtn.setAttribute('aria-pressed', 'true');
      this.playPauseBtn.setAttribute('aria-label', 'Pause slideshow');
    }
    this._syncMusicVolume();
    this._scheduleNext();
  }

  /* ── Private: pause ────────────────────────────────────── */
  _pause() {
    this.isPlaying = false;
    clearTimeout(this.timer);
    if (this.playPauseBtn) {
      this.playPauseBtn.setAttribute('aria-pressed', 'false');
      this.playPauseBtn.setAttribute('aria-label', 'Play slideshow');
    }
    this._syncMusicVolume();
    /* Freeze progress bar at current computed width */
    if (this.progressFill) {
      const w = getComputedStyle(this.progressFill).width;
      this.progressFill.style.transition = 'none';
      this.progressFill.style.width      = w;
    }
  }

  _syncMusicVolume() {
    this._music?.setMuted(!this.isPlaying || this.isMuted);
  }

  /* ── Private: schedule auto-advance ───────────────────── */
  _scheduleNext() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this._advance();
    }, this.SLIDE_DUR);
  }

  /* ── Private: advance to next slide ───────────────────── */
  _advance() {
    this.current = (this.current + 1) % this.slides.length;
    this._loadSlide(this.current, false);
    if (this.isPlaying) this._scheduleNext();
  }

  /* ── Public: go to prev ────────────────────────────────── */
  prev() {
    clearTimeout(this.timer);
    this.current = (this.current - 1 + this.slides.length) % this.slides.length;
    this._loadSlide(this.current, false);
    if (this.isPlaying) this._scheduleNext();
  }

  /* ── Public: go to next ────────────────────────────────── */
  next() {
    clearTimeout(this.timer);
    this._advance();
  }

  /* ── Public: toggle mute ───────────────────────────────── */
  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.muteBtn) {
      this.muteBtn.setAttribute('aria-pressed', String(this.isMuted));
      this.muteBtn.setAttribute('aria-label', this.isMuted ? 'Unmute music' : 'Mute music');
    }
    this._syncMusicVolume();
  }

  /* ── Private: bind all events ──────────────────────────── */
  _bindEvents() {
    /* Open button on preview stage */
    document.getElementById('tributeFilmPlayBtn')
      ?.addEventListener('click', () => this.open());

    /* Close */
    document.getElementById('tributeCloseBtn')
      ?.addEventListener('click', () => this.close());

    /* Play / Pause toggle */
    this.playPauseBtn?.addEventListener('click', () => {
      this.isPlaying ? this._pause() : this._play();
    });

    /* Prev / Next */
    document.getElementById('tributePrevBtn')
      ?.addEventListener('click', () => this.prev());
    document.getElementById('tributeNextBtn')
      ?.addEventListener('click', () => this.next());

    /* Mute */
    this.muteBtn?.addEventListener('click', () => this.toggleMute());

    /* Keyboard: only active when modal is open */
    document.addEventListener('keydown', (e) => {
      if (!this.modal || this.modal.hidden) return;
      switch (e.key) {
        case 'Escape':
          this.close();
          break;
        case 'ArrowRight':
          e.preventDefault();
          this.next();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          this.prev();
          break;
        case ' ':
          e.preventDefault();
          this.isPlaying ? this._pause() : this._play();
          break;
        case 'm':
        case 'M':
          this.toggleMute();
          break;
      }
    });

    /* Touch swipe */
    let touchStartX = 0;
    this.modal?.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    this.modal?.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(dx) > 50) {
        dx < 0 ? this.next() : this.prev();
      }
    }, { passive: true });
  }
}

function initTributeFilm() {
  new TributeFilm();
}

/* ─── 4. MEMORY WALL CAROUSEL (optional auto-scroll on mobile) */
function initMemoryCarousel() {
  // Only activate on mobile viewports
  if (window.innerWidth > 600) return;

  const grid = document.getElementById('memoryWallGrid');
  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll('.memory-card'));
  if (cards.length < 2) return;

  let current = 0;
  let paused  = false;

  cards.forEach((card, i) => {
    card.addEventListener('mouseenter', () => { paused = true; });
    card.addEventListener('mouseleave', () => { paused = false; });
    card.addEventListener('touchstart',  () => { paused = true; }, { passive: true });
  });

  // Auto-scroll the grid container horizontally on mobile
  // (CSS makes it scroll naturally; we just nudge it every few seconds)
  const INTERVAL_MS = 3000;

  function scroll() {
    if (paused || !document.hasFocus()) return;
    current = (current + 1) % cards.length;
    cards[current].scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  const interval = setInterval(scroll, INTERVAL_MS);

  // Pause when page is hidden
  document.addEventListener('visibilitychange', () => {
    paused = document.hidden;
  });
}

/* ─── INIT ───────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initLazyImages();
  new Lightbox();
  initTributeFilm();
  initMemoryCarousel();
});
