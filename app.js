/* ============================================================================
   TP Candidate Microsite — app.js
   Requires: translations.js to provide window.I18N and window.CONTENT
   Purpose : Bind UI, render dynamic content, and keep things snappy on mobile
   Updated : 2025-08-13
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

function imageFallback(img, fallbackSvgText = 'Image not found') {
  img.addEventListener('error', () => {
    img.src =
      `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800">
           <rect width="100%" height="100%" fill="#efefef"/>
           <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
                 fill="#888" font-family="Arial" font-size="20">${fallbackSvgText}</text>
         </svg>`
      )}`;
  }, { once: true });
}

/* ----------------------------------------------------------
   1) Language & i18n plumbing
-----------------------------------------------------------*/
const I18N = window.I18N || { ja: {}, en: {} };
const CONTENT = window.CONTENT || { links:{}, ja:{}, en:{} };

const LANG_STORAGE_KEY = 'tp_lang';
function getInitialLang() {
  const saved = localStorage.getItem(LANG_STORAGE_KEY);
  if (saved === 'ja' || saved === 'en') return saved;
  // Default JP; auto EN if browser language clearly English
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
}

/* ----------------------------------------------------------
   2) Typewriter (hero)
-----------------------------------------------------------*/
function typewriter(node, texts, speed = 58, pause = 1200) {
  if (!node || !texts || !texts.length) return;
  let idx = 0;
  let isDeleting = false;
  let char = 0;
  let raf;

  function tick() {
    const full = texts[idx];
    if (!isDeleting) {
      char++;
      node.textContent = full.slice(0, char);
      if (char >= full.length) {
        isDeleting = true;
        raf = setTimeout(tick, pause);
        return;
      }
      raf = setTimeout(tick, speed);
    } else {
      char--;
      node.textContent = full.slice(0, char);
      if (char <= 0) {
        isDeleting = false;
        idx = (idx + 1) % texts.length;
        raf = setTimeout(tick, speed * 3);
        return;
      }
      raf = setTimeout(tick, Math.max(35, speed - 20));
    }
  }

  if (prefersReducedMotion()) {
    node.textContent = texts[0];
    return () => {};
  }
  tick();
  return () => clearTimeout(raf);
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
    const slideW = first.getBoundingClientRect().width + 12; // gap
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
  }, 4800);
  on(track, 'mouseenter', () => clearInterval(timer));
  on(track, 'mouseleave', () => {
    timer = setInterval(() => {
      const count = track.children.length;
      index = (index + 1) % Math.max(1, count);
      update();
    }, 4800);
  });

  // initial
  requestAnimationFrame(update);
  return { destroy: () => { clearInterval(timer); } };
}

/* ----------------------------------------------------------
   5) Dynamic renders (from CONTENT)
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
    imageFallback(d.querySelector('img'));
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
    imageFallback(card.querySelector('img'));
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
    imageFallback(card.querySelector('img'));
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
  (CONTENT[currentLang].galleryImgs || []).forEach((src) => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = 'gallery';
    img.loading = 'lazy';
    img.style.borderRadius = '10px';
    img.style.border = '1px solid var(--line)';
    imageFallback(img);
    root.appendChild(img);
  });
}

/* ----------------------------------------------------------
   6) Language toggle + full refresh of dynamic sections
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
}

/* ----------------------------------------------------------
   7) Header actions: language + drawer + smooth anchors
-----------------------------------------------------------*/
function initHeader() {
  const langBtn = $('#langBtn');
  if (langBtn) {
    langBtn.textContent = currentLang === 'ja' ? 'EN' : '日本語';
    on(langBtn, 'click', () => {
      const next = currentLang === 'ja' ? 'en' : 'ja';
      setLang(next);
      langBtn.textContent = next === 'ja' ? 'EN' : '日本語';
    });
  }

  // Drawer (mobile)
  const menuBtn = $('#menuBtn');
  const drawer = $('#drawer');
  const scrim  = $('#scrim');
  const close  = $('#closeDrawer');

  function openDrawer() {
    drawer?.classList.add('open');
    scrim?.classList.add('show');
    drawer?.setAttribute('aria-hidden', 'false');
    scrim?.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    drawer?.classList.remove('open');
    scrim?.classList.remove('show');
    drawer?.setAttribute('aria-hidden', 'true');
    scrim?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  on(menuBtn, 'click', openDrawer);
  on(close, 'click', closeDrawer);
  on(scrim, 'click', closeDrawer);
  $$('#drawer .d-link').forEach((a) =>
    on(a, 'click', () => {
      closeDrawer();
      // smooth scroll with header offset
      const id = a.getAttribute('href');
      if (id && id.startsWith('#')) {
        setTimeout(() => smoothScrollTo(id, 76), 10);
      }
    })
  );

  // Smooth scroll for in-page anchors (desktop nav)
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
   8) Sticky mobile apply bar + back-to-top
-----------------------------------------------------------*/
function initStickyBars() {
  const applyBar = $('#applyBar');
  const toTop = $('#toTop');
  let lastScroll = 0;

  function onScroll() {
    const y = window.scrollY;
    // show apply bar on small screens after hero
    if (applyBar) {
      if (y > 360) {
        applyBar.style.transform = 'translateY(0)';
      } else {
        applyBar.style.transform = 'translateY(100%)';
      }
    }
    if (toTop) {
      if (y > 560) toTop.classList.add('show');
      else toTop.classList.remove('show');
    }
    lastScroll = y;
  }

  on(window, 'scroll', onScroll, { passive: true });
  onScroll();

  // back to top
  if (toTop) {
    on(toTop, 'click', (e) => {
      e.preventDefault();
      smoothScrollTo('#home', 0);
    });
  }
}

/* ----------------------------------------------------------
   9) Contact form (demo)
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
   10) Boot sequence
-----------------------------------------------------------*/
document.addEventListener('DOMContentLoaded', () => {
  // 1) Apply language + static strings
  applyLangToHtmlRoot();
  applyI18nStaticText();

  // 2) Render dynamic blocks
  renderAllDynamic();

  // 3) Hero typewriter
  const heroNode = $('#heroType');
  const heroTexts = I18N[currentLang].heroTexts || [];
  typewriter(heroNode, heroTexts);

  // 4) Carousels
  makeCarousel('#benefitSlides', '#bPrev', '#bNext');

  // 5) Observe all revealables that exist initially
  $$('.reveal').forEach(observeReveal);

  // 6) Header, sticky, contact
  initHeader();
  initStickyBars();
  initContactForm();

  // 7) Images fallback
  imageFallback($('#heroCover'), 'Hero');
  imageFallback($('#logoImg'), 'TP');

  // 8) Minimal “cultural” microinteractions:
  //    subtle hover wobble for city cards on pointer devices
  $$('#citiesCards .city').forEach((c) => {
    on(c, 'pointerenter', () => (c.style.transform = 'translateY(-2px)'));
    on(c, 'pointerleave', () => (c.style.transform = 'translateY(0)'));
  });
});
