/* ============================================================================
   TP Candidate Microsite — app.js (Updated)
   Requires: translations.js (window.I18N, window.CONTENT, window.getChatGPTPrompt)
   Purpose : Bind UI, render dynamic content, URL-based language switching
   Updated : 2025-08-18 - Added Korean support and URL-based language switching
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
    img.src = 'TPLogo11.png';
    img.alt = fallbackAlt || img.alt || 'TP';
    img.style.objectFit = 'contain';
    img.style.background = '#f6f8fb';
  }, { once: true });
}

/* ----------------------------------------------------------
   1) Language & i18n plumbing (URL-based)
-----------------------------------------------------------*/
const I18N    = window.I18N    || { ja: {}, en: {}, ko: {} };
const CONTENT = window.CONTENT || { links:{}, ja:{}, en:{}, ko:{} };

// Get language from URL path
function getLangFromURL() {
  const path = window.location.pathname;
  if (path.includes('/en')) return 'en';
  if (path.includes('/ko')) return 'ko';
  return 'ja'; // default
}

// Set language and update URL
function setLangURL(lang) {
  const currentPath = window.location.pathname;
  const search = window.location.search;
  
  // Remove existing language prefixes
  let cleanPath = currentPath.replace(/\/(en|ja|ko)/, '');
  if (cleanPath === '') cleanPath = '/';
  
  // Add new language prefix (except for Japanese which is default)
  let newPath = cleanPath;
  if (lang === 'en') newPath = '/en' + cleanPath;
  if (lang === 'ko') newPath = '/ko' + cleanPath;
  
  // Update URL without page reload
  window.history.pushState({ lang }, '', newPath + search);
}

let currentLang = getLangFromURL();

function applyLangToHtmlRoot() {
  document.documentElement.setAttribute('lang', currentLang);
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
   6) Priority / Secondary galleries 
-----------------------------------------------------------*/
const PHOTO_SOURCES = {
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
  a.classList.add('is-photo-card');
}

function renderPriorityGallery() {
  const root = $('section.icon-grid.priority');
  if (!root) return;
  const items = $$('.icon-card', root);
  injectConnectorBackground(root);
  const keyMap = [
    'about','jobs','relocation','process','why','casual','testimonials','office','career'
  ];
  items.forEach((a, i) => decorateIconCard(a, keyMap[i] || 'about'));
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
   7) Background connector SVG
-----------------------------------------------------------*/
function injectConnectorBackground(sectionEl, opts = {}) {
  if (!sectionEl) return;
  const { density = 12, variant = 'grid' } = opts;
  if ($('.bg-connectors', sectionEl)) return;

  const svg = document.createElement('div');
  svg.className = 'bg-connectors';
  svg.setAttribute('aria-hidden', 'true');

  const w = sectionEl.clientWidth || 1200;
  const h = 320;
  const stroke = 'rgba(2, 32, 71, 0.12)'; // Made more visible
  let svgInner = '';

  if (variant === 'dots') {
    const rows = 4, cols = density;
    const cellW = w / cols;
    const cellH = h / rows;
    svgInner += `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none" xmlns="http://www.w3.org/2000/svg">`;
    for (let r=0;r<rows;r++){
      for (let c=0;c<cols;c++){
        const x = c*cellW + cellW/2;
        const y = r*cellH + cellH/2;
        svgInner += `<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="2.2" fill="${stroke}"/>`;
      }
    }
    svgInner += `</svg>`;
  } else {
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
  renderWhyLists();
  renderCities();
  renderBenefits();
  renderProcess();
  renderOffices();
  renderTeam();
  renderVoices();
  renderFaq();
  renderGallery();
  renderPriorityGallery();
  renderSecondaryGallery();

  const y = String(new Date().getFullYear());
  const yNode = document.getElementById('year');
  if (yNode) yNode.textContent = y;
  const yNode2 = document.getElementById('year2');
  if (yNode2) yNode2.textContent = y;
}

function setLang(lang) {
  const validLangs = ['ja', 'en', 'ko'];
  if (!validLangs.includes(lang)) lang = 'ja';
  
  currentLang = lang;
  setLangURL(lang);
  applyLangToHtmlRoot();
  applyI18nStaticText();
  renderAllDynamic();

  const heroNode = $('#heroType');
  const heroTexts = I18N[currentLang].heroTexts || [];
  typewriter(heroNode, heroTexts);

  const ta = $('#chatgptPrompt');
  if (ta && typeof window.getChatGPTPrompt === 'function') {
    ta.value = window.getChatGPTPrompt(currentLang);
  }

  // Update language button text
  const langBtn = $('#langBtn');
  if (langBtn) {
    if (currentLang === 'ja') langBtn.textContent = 'EN';
    else if (currentLang === 'en') langBtn.textContent = '한국어';
    else if (currentLang === 'ko') langBtn.textContent = '日本語';
  }
}

/* ----------------------------------------------------------
   9) Header actions: language + drawer + smooth anchors
-----------------------------------------------------------*/
function initHeader() {
  // Language cycling: ja -> en -> ko -> ja
  const langBtn = $('#langBtn');
  if (langBtn) {
    if (currentLang === 'ja') langBtn.textContent = 'EN';
    else if (currentLang === 'en') langBtn.textContent = '한국어';
    else if (currentLang === 'ko') langBtn.textContent = '日本語';
    
    on(langBtn, 'click', () => {
      let nextLang;
      if (currentLang === 'ja') nextLang = 'en';
      else if (currentLang === 'en') nextLang = 'ko';
      else nextLang = 'ja';
      setLang(nextLang);
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
      const href = a.getAttribute('href') || '';
      if (href.startsWith('#')) {
        setTimeout(() => smoothScrollTo(href, 76), 10);
      }
    })
  );

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
   10) Sticky mobile apply bar + back-to-top + Apply Now button
-----------------------------------------------------------*/
function initStickyBars() {
  const applyBar = $('.apply-bar');
  const toTop = $('#toTop');
  const applyNow = $('#applyNow'); // New Apply Now button

  function onScroll() {
    const y = window.scrollY;
    if (applyBar) {
      applyBar.style.transform = y > 360 ? 'translateY(0)' : 'translateY(100%)';
    }
    if (toTop) {
      if (y > 560) toTop.classList.add('show');
      else toTop.classList.remove('show');
    }
    if (applyNow) {
      if (y > 560) applyNow.classList.add('show');
      else applyNow.classList.remove('show');
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
    const msg = typeof fn === 'function' ? fn(name || (currentLang === 'ja' ? '応募者' : currentLang === 'ko' ? '지원자' : 'Candidate')) : fn;
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
        btnCopy.textContent = currentLang === 'ja' ? 'コピーしました！' : 
                              currentLang === 'ko' ? '복사했습니다!' : 'Copied!';
        setTimeout(() => (btnCopy.textContent = original), 1400);
      } catch (e) {
        ta.select();
        document.execCommand('copy');
      }
    });
  }
  if (btnOpen) {
    on(btnOpen, 'click', () => {
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
  const strip = $('.culture-strip');
  if (!strip || prefersReducedMotion()) return;

  const motifs = $$('.culture-strip .motif', strip);
  function onScroll() {
    const rect = strip.getBoundingClientRect();
    if (rect.top > window.innerHeight || rect.bottom < 0) return;
    const progress = 1 - Math.abs(rect.top) / (window.innerHeight + rect.height);
    motifs.forEach((m, i) => {
      const factor = (i + 1) * 4;
      m.style.transform = `translateY(${(1 - progress) * factor}px)`;
    });
  }
  on(window, 'scroll', onScroll, { passive: true });
  onScroll();
}

function normalizeIconSizes() {
  $$('.icon-card .icon svg, .icon-card .icon img').forEach((node) => {
    node.setAttribute('width', '48');
    node.setAttribute('height', '48');
    node.style.width = '';
    node.style.height = '';
  });
}

/* ----------------------------------------------------------
   14) Handle browser navigation
-----------------------------------------------------------*/
function initBrowserNavigation() {
  window.addEventListener('popstate', (e) => {
    const newLang = getLangFromURL();
    if (newLang !== currentLang) {
      currentLang = newLang;
      applyLangToHtmlRoot();
      applyI18nStaticText();
      renderAllDynamic();
      
      // Update language button
      const langBtn = $('#langBtn');
      if (langBtn) {
        if (currentLang === 'ja') langBtn.textContent = 'EN';
        else if (currentLang === 'en') langBtn.textContent = '한국어';
        else if (currentLang === 'ko') langBtn.textContent = '日本語';
      }
    }
  });
}

/* ----------------------------------------------------------
   15) Boot sequence
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
  
  // 8) Browser navigation
  initBrowserNavigation();
});
