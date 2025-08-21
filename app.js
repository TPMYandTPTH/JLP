/* ============================================================================
   TP Candidate Microsite — app.js
   Requires: translations.js (window.I18N, window.CONTENT, window.getChatGPTPrompt)
   Purpose : Bind UI, render dynamic content, and keep things snappy on mobile
   Updated : 2025-08-14
============================================================================ */

/* ----------------------------------------------------------
   0) Tiny utilities
-----------------------------------------------------------*/
const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
const on    = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);

function smoothScrollTo(target, offset = 0) {
  const el = typeof target === 'string' ? $(target) : target;
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top: y, behavior: 'smooth' });
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function imageFallback(img, fallbackAlt = 'image') {
  if (!img) return;
  img.addEventListener('error', () => {
    // Last-resort placeholder (keeps layout pleasant)
    img.src = 'TPLogo11.png';
    img.alt = fallbackAlt || img.alt || 'TP';
    img.style.objectFit = 'contain';
    img.style.background = '#f6f8fb';
  }, { once: true });
}

/* ----------------------------------------------------------
   1) Language & i18n plumbing
-----------------------------------------------------------*/
const I18N    = window.I18N    || { ja: {}, en: {} };
const CONTENT = window.CONTENT || { links:{}, ja:{}, en:{} };

const LANG_STORAGE_KEY = 'tp_lang';
function getInitialLang() {
  const saved = localStorage.getItem(LANG_STORAGE_KEY);
  if (saved === 'ja' || saved === 'en') return saved;
  // JP-first default; auto EN only if browser is clearly English
  if (navigator.language && navigator.language.toLowerCase().startsWith('en')) return 'en';
  return 'ja';
}
let currentLang = getInitialLang();

function applyLangToHtmlRoot() {
  document.documentElement.setAttribute('lang', currentLang === 'ja' ? 'ja' : 'en');
  document.documentElement.setAttribute('data-lang', currentLang);
}

function t(key) {
  const dict = I18N[currentLang] || {};
  const val = dict[key];
  if (typeof val === 'function') return val;
  return val ?? I18N.ja[key] ?? I18N.en[key] ?? '';
}

function applyI18nStaticText() {
  $$('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    const val = t(key);
    if (typeof val === 'string' || typeof val === 'number') el.innerHTML = val;
  });
  // Some elements may use data-i18n-static to keep text-only (no HTML)
  $$('[data-i18n-static]').forEach((el) => {
    const key = el.getAttribute('data-i18n-static');
    const val = t(key);
    if (typeof val === 'string' || typeof val === 'number') el.textContent = val;
  });
}

/* ----------------------------------------------------------
   2) Typewriter (hero)
-----------------------------------------------------------*/
function typewriter(node, texts, speed = 58, pause = 1200) {
  if (!node || !texts || !texts.length) return () => {};
  if (prefersReducedMotion()) {
    node.textContent = texts[0] || '';
    return () => {};
  }
  let idx = 0;
  let isDeleting = false;
  let char = 0;
  let timer;

  function tick() {
    const full = texts[idx] || '';
    if (!isDeleting) {
      char++;
      node.textContent = full.slice(0, char);
      if (char >= full.length) {
        isDeleting = true;
        timer = setTimeout(tick, pause);
        return;
      }
      timer = setTimeout(tick, speed);
    } else {
      char--;
      node.textContent = full.slice(0, char);
      if (char <= 0) {
        isDeleting = false;
        idx = (idx + 1) % texts.length;
        timer = setTimeout(tick, speed * 3);
        return;
      }
      timer = setTimeout(tick, Math.max(35, speed - 20));
    }
  }
  tick();
  return () => clearTimeout(timer);
}

/* ----------------------------------------------------------
   3) Reveal-on-scroll (IO)
-----------------------------------------------------------*/
const revealObserver = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        revealObserver.unobserve(e.target);
      }
    }
  },
  { threshold: 0.14 }
);
function observeReveal(node) {
  if (!node) return;
  node.classList.add('reveal');
  revealObserver.observe(node);
}

/* ----------------------------------------------------------
   4) Simple horizontal carousel
-----------------------------------------------------------*/
function makeCarousel(containerSel, prevBtnSel, nextBtnSel) {
  const track = $(containerSel);
  if (!track) return { destroy: () => {} };
  const prev = $(prevBtnSel);
  const next = $(nextBtnSel);
  let index = 0;

  function update() {
    const first = track.children[0];
    if (!first) return;
    const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || 12);
    const slideW = first.getBoundingClientRect().width + (Number.isFinite(gap) ? gap : 12);
    track.style.transform = `translateX(${-index * slideW}px)`;
  }

  function go(dir) {
    const count = track.children.length;
    index = clamp(index + dir, 0, Math.max(0, count - 1));
    update();
  }

  on(window, 'resize', update);
  on(prev, 'click', () => go(-1));
  on(next, 'click', () => go(1));

  // gentle autoplay
  let timer = setInterval(() => {
    const count = track.children.length;
    index = (index + 1) % Math.max(1, count);
    update();
  }, 5200);
  on(track, 'mouseenter', () => clearInterval(timer));
  on(track, 'mouseleave', () => {
    timer = setInterval(() => {
      const count = track.children.length;
      index = (index + 1) % Math.max(1, count);
      update();
    }, 5200);
  });

  // initial
  requestAnimationFrame(update);
  return { destroy: () => { clearInterval(timer); } };
}

/* ----------------------------------------------------------
   5) Dynamic renders (Why / Cities / Benefits / Process / Offices / Team / Voices / FAQ / Gallery)
-----------------------------------------------------------*/
function renderWhyLists() {
  const lists = [
    { id: '#whyList1', data: CONTENT[currentLang].why1 || [] },
    { id: '#whyList2', data: CONTENT[currentLang].why2 || [] }
  ];
  lists.forEach(({ id, data }) => {
    const root = $(id);
    if (!root) return;
    root.innerHTML = '';
    data.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'item card';
      card.innerHTML = `<h4 style="margin:0 0 6px">${item.t}</h4><p class="subtle" style="margin:0">${item.d}</p>`;
      root.appendChild(card);
      observeReveal(card);
    });
  });
}

function renderCities() {
  const root = $('#citiesCards');
  if (!root) return;
  root.innerHTML = '';
  (CONTENT[currentLang].cities || []).forEach((c) => {
    const d = document.createElement('div');
    d.className = 'city';
    d.innerHTML = `
      <img src="${c.img}" alt="${c.title}">
      <div class="overlay"><strong>${c.title}</strong><div style="font-size:13px;margin-top:6px">${c.desc}</div></div>`;
    imageFallback(d.querySelector('img'), c.title);
    root.appendChild(d);
    observeReveal(d);
  });
}

function renderBenefits() {
  const track = $('#benefitSlides');
  if (!track) return;
  track.innerHTML = '';
  (CONTENT[currentLang].benefits || []).forEach((b) => {
    const el = document.createElement('div');
    el.className = 'slide';
    el.innerHTML = `<h4 style="margin:0 0 6px">${b.t}</h4><p class="subtle" style="margin:0">${b.d}</p>`;
    track.appendChild(el);
    observeReveal(el);
  });
}

function renderProcess() {
  const root = $('#processList');
  if (!root) return;
  root.innerHTML = '';
  (CONTENT[currentLang].processSteps || []).forEach((s) => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${s.k}</strong><div class="subtle" style="margin-top:6px">${s.v}</div>`;
    root.appendChild(li);
    observeReveal(li);
  });
}

function renderOffices() {
  const root = $('#officeCards');
  if (!root) return;
  root.innerHTML = '';
  (CONTENT[currentLang].offices || CONTENT.ja.offices || []).forEach((o) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${o.img}" alt="${o.title}" style="height:160px;width:100%;object-fit:cover;border-radius:10px;border:1px solid var(--line);margin-bottom:10px">
      <h4 style="margin:6px 0">${o.title}</h4>
      <ul class="subtle" style="padding-left:18px;margin:8px 0 0">${(o.points||[])
        .map((p) => `<li>${p}</li>`)
        .join('')}</ul>`;
    imageFallback(card.querySelector('img'), o.title);
    root.appendChild(card);
    observeReveal(card);
  });
}

function renderTeam() {
  const root = $('#teamGrid');
  if (!root) return;
  root.innerHTML = '';
  (CONTENT[currentLang].team || []).forEach((m) => {
    const card = document.createElement('div');
    card.className = 'member';
    card.innerHTML = `
      <img src="${m.img}" alt="${m.name}">
      <h4 style="margin:6px 0 2px">${m.name}</h4>
      <div class="subtle" style="font-size:13px">${m.role || ''}</div>
      <p class="subtle" style="font-size:13px;margin-top:8px">${m.bio || ''}</p>`;
    imageFallback(card.querySelector('img'), m.name);
    root.appendChild(card);
    observeReveal(card);
  });
}

function renderVoices() {
  const root = $('#voiceGrid');
  if (!root) return;
  root.innerHTML = '';
  (CONTENT[currentLang].voices || []).forEach((v) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `<p class="quote" style="margin-top:0">${v.quote}</p><div class="subtle" style="margin-top:8px">${v.who}</div>`;
    root.appendChild(card);
    observeReveal(card);
  });
}

function renderFaq() {
  const root = $('#faqList');
  if (!root) return;
  root.innerHTML = '';
  (CONTENT[currentLang].faq || []).forEach((q) => {
    const wrap = document.createElement('div');
    wrap.innerHTML = `
      <button class="q">${q.q}</button>
      <div class="a">${q.a}</div>`;
    root.appendChild(wrap);
  });
  // Wiring accordion behavior
  $$('#faqList .q').forEach((btn) => {
    on(btn, 'click', () => {
      const a = btn.nextElementSibling;
      const open = a.style.display === 'block';
      $$('#faqList .a').forEach((x) => (x.style.display = 'none'));
      a.style.display = open ? 'none' : 'block';
    });
  });
}

function renderGallery() {
  const root = $('#gallery');
  if (!root) return;
  root.innerHTML = '';
  (CONTENT[currentLang].galleryImgs || []).forEach((src, i) => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = `gallery-${i+1}`;
    img.loading = 'lazy';
    img.style.borderRadius = '10px';
    img.style.border = '1px solid var(--line)';
    imageFallback(img, 'gallery');
    root.appendChild(img);
  });
}

/* ----------------------------------------------------------
   6) Priority / Secondary galleries (3×3 tiles with background connector)
   - Uses your existing <a class="icon-card">…</a> in HTML and
     upgrades each card into a photo tile with caption-under-image.
-----------------------------------------------------------*/
const PHOTO_SOURCES = {
  // culturally-friendly placeholder photos (Unsplash, no external JS needed)
  about: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?q=80&w=1200&auto=format&fit=crop',
  jobs: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1200&auto=format&fit=crop',
  relocation: 'https://images.unsplash.com/photo-1502920917128-1aa500764ce7?q=80&w=1200&auto=format&fit=crop',
  process: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=1200&auto=format&fit=crop',
  why: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=1200&auto=format&fit=crop',
  casual: 'https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa?q=80&w=1200&auto=format&fit=crop',
  testimonials: 'https://images.unsplash.com/photo-1551836022-4c4c79ecde51?q=80&w=1200&auto=format&fit=crop',
  office: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1200&auto=format&fit=crop',
  career: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop',
  cost: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=1200&auto=format&fit=crop',
  team: 'https://images.unsplash.com/photo-1551836022-4c4c79ecde51?q=80&w=1200&auto=format&fit=crop',
  area: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=1200&auto=format&fit=crop',
  blog: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1200&auto=format&fit=crop',
  line: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1200&auto=format&fit=crop',
  culture: 'https://images.unsplash.com/photo-1561484930-998b6a7b22a8?q=80&w=1200&auto=format&fit=crop',
  faq: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=1200&auto=format&fit=crop'
};

function decorateIconCard(a, key) {
  // Expect structure: <a.icon-card><span.icon>…</span><span.meta><span.title>…</span><span.desc>…</span></span></a>
  // We’ll inject a <div class="photo"> before meta, and keep SVG for accessibility.
  const title = $('.title', a)?.textContent?.trim() || a.getAttribute('aria-label') || '';
  const photoURL = PHOTO_SOURCES[key] || PHOTO_SOURCES.about;
  let photo = $('.photo', a);
  if (!photo) {
    photo = document.createElement('div');
    photo.className = 'photo';
    photo.innerHTML = `<img class="photo-img" alt="">`;
    a.insertBefore(photo, $('.meta', a));
  }
  const img = $('.photo-img', a);
  if (img) {
    img.src = photoURL;
    img.alt = title || key;
    imageFallback(img, title || key);
  }
  // Normalize icon size (SVG stays small and centered above photo on hover)
  a.classList.add('is-photo-card');
}

function renderPriorityGallery() {
  const root = $('section.icon-grid.priority');
  if (!root) return;
  const items = $$('.icon-card', root);
  // Add subtle connector background
  injectConnectorBackground(root);
  // Map each card to a key to pick a photo
  const keyMap = [
    'about','jobs','relocation','process','why','casual','testimonials','office','career'
  ];
  items.forEach((a, i) => decorateIconCard(a, keyMap[i] || 'about'));
  // enforce 3×3 layout via CSS utility classes (kept semantic)
  root.classList.add('priority-3x3');
  items.forEach((el) => observeReveal(el));
}

function renderSecondaryGallery() {
  const root = $('section.icon-grid.secondary');
  if (!root) return;
  const items = $$('.icon-card', root);
  injectConnectorBackground(root, { density: 10, variant: 'dots' });
  const keyMap = ['cost','team','area','blog','line','culture','faq'];
  items.forEach((a, i) => decorateIconCard(a, keyMap[i] || 'blog'));
  root.classList.add('secondary-grid');
  items.forEach((el) => observeReveal(el));
}

/* ----------------------------------------------------------
   7) Background connector SVG (subtle, modern)
-----------------------------------------------------------*/
function injectConnectorBackground(sectionEl, opts = {}) {
  if (!sectionEl) return;
  const { density = 12, variant = 'grid' } = opts;
  // If already present, skip
  if ($('.bg-connectors', sectionEl)) return;

  const svg = document.createElement('div');
  svg.className = 'bg-connectors';
  svg.setAttribute('aria-hidden', 'true');

  // Create lightweight SVG pattern
  const w = sectionEl.clientWidth || 1200;
  const h = 320;
  const stroke = 'rgba(2, 32, 71, 0.06)';
  let svgInner = '';

  if (variant === 'dots') {
    // Dotted connector
    const rows = 4, cols = density;
    const cellW = w / cols;
    const cellH = h / rows;
    svgInner += `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none" xmlns="http://www.w3.org/2000/svg">`;
    for (let r=0;r<rows;r++){
      for (let c=0;c<cols;c++){
        const x = c*cellW + cellW/2;
        const y = r*cellH + cellH/2;
        svgInner += `<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="1.8" fill="${stroke}"/>`;
      }
    }
    svgInner += `</svg>`;
  } else {
    // Thin grid/lines
    const cols = density;
    const cellW = w / cols;
    svgInner += `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">`;
    for (let i=0;i<=cols;i++){
      const x = (i*cellW).toFixed(2);
      svgInner += `<line x1="${x}" y1="0" x2="${x}" y2="${h}" stroke="${stroke}" stroke-width="1"/>`;
    }
    svgInner += `<line x1="0" y1="${h/2}" x2="${w}" y2="${h/2}" stroke="${stroke}" stroke-width="1"/>`;
    svgInner += `</svg>`;
  }

  svg.innerHTML = svgInner;
  sectionEl.prepend(svg);

  // Update on resize
  let raf;
  on(window, 'resize', () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const old = $('.bg-connectors', sectionEl);
      if (old) old.remove();
      injectConnectorBackground(sectionEl, opts);
    });
  });
}

/* ----------------------------------------------------------
   8) Language toggle + full refresh of dynamic sections
-----------------------------------------------------------*/
function renderAllDynamic() {
  // These only exist on the long single-page template.
  renderWhyLists();
  renderCities();
  renderBenefits();
  renderProcess();
  renderOffices();
  renderTeam();
  renderVoices();
  renderFaq();
  renderGallery();

  // Icon galleries (3×3 + secondary)
  renderPriorityGallery();
  renderSecondaryGallery();

  // Year in footer
const y = String(new Date().getFullYear());
const yNode = document.getElementById('year');
if (yNode) yNode.textContent = y;

const yNode2 = document.getElementById('year2');
if (yNode2) yNode2.textContent = y;

}

function setLang(lang) {
  currentLang = lang === 'en' ? 'en' : 'ja';
  localStorage.setItem(LANG_STORAGE_KEY, currentLang);
  applyLangToHtmlRoot();
  applyI18nStaticText();
  renderAllDynamic();

  // Update hero typewriter text
  const heroNode = $('#heroType');
  const heroTexts = I18N[currentLang].heroTexts || [];
  typewriter(heroNode, heroTexts);

  // Update Ask ChatGPT prompt
  const ta = $('#chatgptPrompt');
  if (ta && typeof window.getChatGPTPrompt === 'function') {
    ta.value = window.getChatGPTPrompt(currentLang);
  }

  // Update lang toggle button label
  const langBtn = $('#langBtn');
  if (langBtn) langBtn.textContent = currentLang === 'ja' ? 'EN' : '日本語';
}

/* ----------------------------------------------------------
   9) Header actions: language + drawer + smooth anchors
-----------------------------------------------------------*/
function initHeader() {
  // Language
  const langBtn = $('#langBtn');
  if (langBtn) {
    langBtn.textContent = currentLang === 'ja' ? 'EN' : '日本語';
    on(langBtn, 'click', () => {
      const next = currentLang === 'ja' ? 'en' : 'ja';
      setLang(next);
    });
  }

  // Drawer (mobile)
  const menuOpen  = $('#menuBtn');
  const menuClose = $('#closeDrawer');
  const drawer    = $('#drawer');
  const scrim     = $('#scrim');

  function openDrawer() {
    drawer?.classList.add('open');
    drawer?.setAttribute('aria-hidden', 'false');
    if (scrim) { scrim.hidden = false; scrim.classList.add('show'); }
    document.body.style.overflow = 'hidden';
    menuOpen?.setAttribute('aria-expanded', 'true');
  }
  function closeDrawer() {
    drawer?.classList.remove('open');
    drawer?.setAttribute('aria-hidden', 'true');
    if (scrim) { scrim.classList.remove('show'); setTimeout(() => scrim.hidden = true, 250); }
    document.body.style.overflow = '';
    menuOpen?.setAttribute('aria-expanded', 'false');
  }

  on(menuOpen, 'click', openDrawer);
  on(menuClose, 'click', closeDrawer);
  on(scrim, 'click', closeDrawer);

  $$('.drawer .d-link').forEach((a) =>
    on(a, 'click', () => {
      closeDrawer();
      // If anchor (in-page) existed, smooth-scroll; but you use separate pages, so default nav is fine.
      const href = a.getAttribute('href') || '';
      if (href.startsWith('#')) {
        setTimeout(() => smoothScrollTo(href, 76), 10);
      }
    })
  );

  // Smooth scroll for any in-page anchors in header/footer
  $$('a[href^="#"]').forEach((a) => {
    on(a, 'click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const el = $(id);
      if (!el) return;
      e.preventDefault();
      smoothScrollTo(el, 76);
    });
  });
}

/* ----------------------------------------------------------
   10) Sticky mobile apply bar + back-to-top
-----------------------------------------------------------*/
function initStickyBars() {
  const applyBar = $('.apply-bar');
  const toTop = $('#toTop');

  function onScroll() {
    const y = window.scrollY;
    if (applyBar) {
      // show after hero area
      applyBar.style.transform = y > 360 ? 'translateY(0)' : 'translateY(100%)';
    }
    if (toTop) {
      if (y > 560) toTop.classList.add('show');
      else toTop.classList.remove('show');
    }
  }

  on(window, 'scroll', onScroll, { passive: true });
  onScroll();

  if (toTop) {
    on(toTop, 'click', (e) => {
      e.preventDefault();
      smoothScrollTo('body', 0);
    });
  }
}

/* ----------------------------------------------------------
   11) Contact form (demo-safe)
-----------------------------------------------------------*/
function initContactForm() {
  const form = $('#contactForm');
  if (!form) return;
  on(form, 'submit', (e) => {
    e.preventDefault();
    const name = $('#name')?.value?.trim() || '';
    const fn = I18N[currentLang].contactThanks || I18N.ja.contactThanks || (() => 'ありがとうございました。');
    const msg = typeof fn === 'function' ? fn(name || (currentLang === 'ja' ? '応募者' : 'Candidate')) : fn;
    alert(msg);
    form.reset();
  });
}

/* ----------------------------------------------------------
   12) Ask ChatGPT section: copy & open actions
-----------------------------------------------------------*/
function initChatGPTSection() {
  const ta = $('#chatgptPrompt');
  const btnCopy = $('#copyPromptBtn');
  const btnOpen = $('#openChatGPTBtn');
  if (ta && typeof window.getChatGPTPrompt === 'function') {
    ta.value = window.getChatGPTPrompt(currentLang);
  }
  if (btnCopy && ta) {
    on(btnCopy, 'click', async () => {
      try {
        await navigator.clipboard.writeText(ta.value);
        const original = btnCopy.textContent;
        btnCopy.textContent = currentLang === 'ja' ? 'コピーしました！' : 'Copied!';
        setTimeout(() => (btnCopy.textContent = original), 1400);
      } catch (e) {
        ta.select();
        document.execCommand('copy');
      }
    });
  }
  if (btnOpen) {
    on(btnOpen, 'click', () => {
      // Don’t rely on URL strings in HTML; centralize here
      window.open('https://chat.openai.com/', '_blank', 'noopener,noreferrer');
    });
  }
}

/* ----------------------------------------------------------
   13) Misc boot helpers
-----------------------------------------------------------*/
function initHeroMediaFallbacks() {
  imageFallback($('#heroCover'), 'Hero');
  imageFallback($('#logoImg'), 'TP');
  $$('.photo-img').forEach((img) => imageFallback(img, 'tile'));
}

function initCultureStripAnimations() {
  // lightweight parallax on large screens (no library)
  const strip = $('.culture-strip');
  if (!strip || prefersReducedMotion()) return;

  const motifs = $$('.culture-strip .motif', strip);
  function onScroll() {
    const rect = strip.getBoundingClientRect();
    if (rect.top > window.innerHeight || rect.bottom < 0) return;
    const progress = 1 - Math.abs(rect.top) / (window.innerHeight + rect.height);
    motifs.forEach((m, i) => {
      const factor = (i + 1) * 4; // increasing subtle offset
      m.style.transform = `translateY(${(1 - progress) * factor}px)`;
    });
  }
  on(window, 'scroll', onScroll, { passive: true });
  onScroll();
}

function normalizeIconSizes() {
  // Make sure icons (SVGs) above photos are tidy
  $$('.icon-card .icon svg, .icon-card .icon img').forEach((node) => {
    node.setAttribute('width', '48');
    node.setAttribute('height', '48');
    node.style.width = '';
    node.style.height = '';
  });
}

/* ----------------------------------------------------------
   14) Boot sequence
-----------------------------------------------------------*/
document.addEventListener('DOMContentLoaded', () => {
  // 1) Apply language + static strings
  applyLangToHtmlRoot();
  applyI18nStaticText();

  // 2) Render dynamic blocks
  renderAllDynamic();

  // 3) Hero typewriter
  const heroNode  = $('#heroType');
  const heroTexts = I18N[currentLang].heroTexts || [];
  typewriter(heroNode, heroTexts);

  // 4) Carousels
  makeCarousel('#benefitSlides', '#bPrev', '#bNext');

  // 5) Observe all revealables that exist initially
  $$('.reveal').forEach(observeReveal);

  // 6) Header, sticky, contact, chatgpt
  initHeader();
  initStickyBars();
  initContactForm();
  initChatGPTSection();

  // 7) Fallbacks & visuals
  initHeroMediaFallbacks();
  initCultureStripAnimations();
  normalizeIconSizes();
});

/* ========================================================================
   TP_EXT: Non-destructive augmentation for URL language + KO + accents +
           secondary-grid full-bleed hint + float Apply next to ToTop
   Paste-in block (appended; does not remove original logic)
   Updated: 2025-08-21
======================================================================== */
(function () {
  // ====== Config from your request ======
  const APPLY_URL = 'https://careerseng-teleperformance.icims.com/jobs/49026/customer-service-representative---japanese-speaking-%28kl%29/job?mode=job&iis=LANDINGPAGE';
  const TP_PINK   = '#ff0082';
  const TP_PURPLE = '#780096';

  // URL language maps
  const SUPPORTED = ['ja','en','ko'];
  const URL2INTL  = { en:'en', jp:'ja', ko:'ko' };
  const INTL2URL  = { en:'en', ja:'jp', ko:'ko' };

  // Ensure accent color (you can switch to purple by toggling the commented line)
  function forceAccent() {
    try {
      const r = document.documentElement;
      const cur = getComputedStyle(r).getPropertyValue('--accent').trim();
      if (!cur || cur === '#0057B8') r.style.setProperty('--accent', TP_PINK);
      // r.style.setProperty('--accent', TP_PURPLE); // fallback option if pink is hard to read
      // Improve contrast on surfaces a bit
      if (!getComputedStyle(r).getPropertyValue('--surface').trim()) {
        r.style.setProperty('--surface', '#fbf7fc');
      }
      // Prefer Noto Sans JP then Calibri Light as asked
      document.body && (document.body.style.fontFamily = `"Noto Sans JP","Calibri Light","Inter",system-ui,sans-serif`);
    } catch {}
  }

  // Parse /en or /jp or /ko from URL; fallback to ?lang=; else keep current
  function parseLangFromUrl() {
    try {
      const m = location.pathname.match(/^\/(en|jp|ko)(?:\/|$)/i);
      if (m) return URL2INTL[m[1].toLowerCase()] || 'ja';
      const q = new URLSearchParams(location.search).get('lang');
      if (q && URL2INTL[q]) return URL2INTL[q];
    } catch {}
    const root = document.documentElement;
    const attr = (root.getAttribute('data-lang') || root.getAttribute('lang') || 'ja').toLowerCase();
    return SUPPORTED.includes(attr) ? attr : (typeof currentLang === 'string' ? currentLang : 'ja');
  }

  function pushLangToUrl(lang) {
    const seg = INTL2URL[lang] || 'jp';
    const path = location.pathname;
    let newPath;
    if (/^\/(en|jp|ko)(?:\/|$)/i.test(path)) {
      newPath = path.replace(/^\/(en|jp|ko)(?=\/|$)/i, `/${seg}`);
    } else {
      newPath = `/${seg}${path.startsWith('/') ? '' : '/'}${path}`;
    }
    try {
      history.replaceState({}, '', newPath + location.search + location.hash);
    } catch {
      const u = new URL(location.href);
      u.searchParams.set('lang', seg);
      history.replaceState({}, '', u.toString());
    }
  }

  // Keep internal links prefixed with the active lang segment
  function rewriteInternalLinks(lang) {
    const seg = INTL2URL[lang] || 'jp';
    $$('a[href]').forEach((a) => {
      const href = a.getAttribute('href') || '';
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || /^https?:\/\//i.test(href)) return;

      if (href.startsWith('/')) {
        if (!/^\/(en|jp|ko)(?:\/|$)/i.test(href)) {
          a.setAttribute('href', `/${seg}${href}`);
        }
      } else {
        // convert relative to lang-prefixed root-relative, preserving folder
        const basePath = location.pathname.replace(/^\/(en|jp|ko)(?=\/|$)/i, '');
        const dir = basePath.substring(0, basePath.lastIndexOf('/') + 1);
        a.setAttribute('href', `/${seg}${dir}${href}`);
      }
    });
  }

  // Gentle i18n (only touches elements that asked for it)
  function renderI18NAlias(lang) {
    if (!window.I18N) return;
    const dict = window.I18N[lang] || window.I18N.ja || {};
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (!key) return;
      const v = dict[key];
      if (v == null) return;
      el.textContent = (typeof v === 'function') ? v('') : v;
    });
  }

  // Rebind language button to cycle JA → EN → KO → JA and keep URL in sync
  function rebindLangButton() {
    const btn = document.getElementById('langBtn');
    if (!btn) return;
    // wipe previous listeners by cloning
    const clone = btn.cloneNode(true);
    btn.parentNode.replaceChild(clone, btn);

    // set label to the "next" language
    const cur = parseLangFromUrl();
    clone.textContent = cur === 'ja' ? 'EN' : cur === 'en' ? '한국어' : '日本語';

    clone.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      const curLang = parseLangFromUrl();
      const next = curLang === 'ja' ? 'en' : curLang === 'en' ? 'ko' : 'ja';
      setLanguageExt(next, { updateUrl: true });
    });
  }

  function updateChatGPTPrompt(lang) {
    const ta = document.getElementById('chatgptPrompt');
    if (ta && window.getChatGPTPrompt) ta.value = window.getChatGPTPrompt(lang);
  }

  function initTypewriterSafe(lang) {
    const node = document.getElementById('heroType');
    if (!node) return;
    let texts = (window.I18N && window.I18N[lang] && window.I18N[lang].heroTexts) || [];
    if (!texts || !texts.length) {
      const alt = node.getAttribute(`data-${lang}`) || '';
      if (alt) texts = [alt];
    }
    if (texts && texts.length) typewriter(node, texts);
  }

  function ensureYear() {
    const y = String(new Date().getFullYear());
    const yNode = document.getElementById('year');
    const yNode2= document.getElementById('year2');
    if (yNode)  yNode.textContent  = y;
    if (yNode2) yNode2.textContent = y;
  }

  // Create Apply Now next to #toTop (non-destructive)
  function ensureApplyNextToTop(lang) {
    const toTop = document.getElementById('toTop');
    const label = lang === 'ja' ? 'ご応募はこちら' : lang === 'ko' ? '지원하기' : 'Apply Now';
    let apply = document.getElementById('applyFloatBtn');

    if (!apply) {
      apply = document.createElement('a');
      apply.id = 'applyFloatBtn';
      apply.className = 'btn primary';
      apply.href = APPLY_URL;
      apply.target = '_blank';
      apply.rel = 'noopener';
      apply.style.position = 'fixed';
      apply.style.right = '64px';
      apply.style.bottom = '24px';
      apply.style.zIndex = '999';
      apply.style.transition = 'opacity .2s ease, transform .2s ease';
      apply.style.opacity = '0';
      apply.style.transform = 'translateY(8px)';
      document.body.appendChild(apply);
    }
    apply.textContent = label;

    function toggle(show) {
      apply.style.opacity = show ? '1' : '0';
      apply.style.transform = show ? 'translateY(0)' : 'translateY(8px)';
      apply.tabIndex = show ? 0 : -1;
    }

    function onScroll() {
      const y = window.scrollY || document.documentElement.scrollTop;
      // match the threshold used by initStickyBars (560)
      toggle(y > 560);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();

    // If #toTop exists and is fixed at bottom-right, keep apply horizontally adjacent
    if (toTop) {
      // no DOM reparenting to avoid breaking your styles
      // we just ensure spacing via apply.style.right above (64px)
    }
  }

  // Add helper classes to secondary grid for your CSS to make it full-bleed & 4-up/3-up
  function tuneSecondaryGrid() {
    const sec = document.querySelector('section.icon-grid.secondary');
    if (!sec) return;
    sec.classList.add('fullbleed', 'secondary-full', 'bg-strong'); // CSS will make it full width & more visible
    // you can also mark desired columns; your styles.css step will define these:
    sec.classList.add('cols-4-desktop', 'cols-3-phone');
  }

  // Reveal alias (.in-view) so either CSS naming works
  function aliasReveal() {
    try {
      const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('in-view');
            obs.unobserve(e.target);
          }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll('.reveal').forEach(el => io.observe(el));
    } catch {}
  }

  // Master language setter that cooperates with original setLang for JA/EN and adds KO path
  function setLanguageExt(lang, opts = {}) {
    const { updateUrl = true } = opts;
    const safe = SUPPORTED.includes(lang) ? lang : 'ja';
    if (updateUrl) pushLangToUrl(safe);

    // Keep root attributes accurate for all three languages
    document.documentElement.setAttribute('lang', safe);
    document.documentElement.setAttribute('data-lang', safe);

    // Rewrite internal links to keep the segment consistent
    rewriteInternalLinks(safe);

    if (safe === 'ja' || safe === 'en') {
      // Use your original pipeline
      setLang(safe);
    } else {
      // === KO path: mirror what setLang() does, but with currentLang='ko' ===
      try {
        currentLang = 'ko';
        localStorage.setItem(LANG_STORAGE_KEY, currentLang);
      } catch {}
      // Re-render
      applyI18nStaticText();
      renderAllDynamic();
      initTypewriterSafe('ko');
      updateChatGPTPrompt('ko');
      // Update lang button (shows next language)
      const langBtn = document.getElementById('langBtn');
      if (langBtn) langBtn.textContent = '日本語';
    }

    // Footer year (idempotent)
    ensureYear();

    // Float apply label refresh
    const apply = document.getElementById('applyFloatBtn');
    if (apply) apply.textContent = safe === 'ja' ? 'ご応募はこちら' : safe === 'ko' ? '지원하기' : 'Apply Now';
  }

  function initExt() {
    forceAccent();

    // Make secondary icons section ready for your CSS tweaks
    tuneSecondaryGrid();

    // Reveal alias
    aliasReveal();

    // Sync language from URL on first load, override the local default if needed
    const langFromUrl = parseLangFromUrl();
    setLanguageExt(langFromUrl, { updateUrl: true });

    // Replace the old two-state toggle with a 3-state cycle
    rebindLangButton();

    // Ensure Apply button next to ToTop
    ensureApplyNextToTop(langFromUrl);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initExt, { once: true });
  } else {
    // Run after original DOMContentLoaded fires its handlers
    setTimeout(initExt, 0);
  }

  // Keep language consistent when user uses browser back/forward
  window.addEventListener('popstate', () => {
    const lang = parseLangFromUrl();
    setLanguageExt(lang, { updateUrl: false });
  });

  // Expose small API for manual switches if needed elsewhere
  window.TP_EXT = { setLanguage: setLanguageExt };
})();
