/* ============================================================================
   TP Candidate Microsite — app.js
   Author: you
   Updated: 2025-08-13
   Purpose:
   - Language toggle (JP/EN) with full dynamic re-render
   - Typewriter hero headline
   - Drawer menu (mobile)
   - Reveal-on-scroll
   - Benefits carousel (auto + manual)
   - Section renderers (Why, Cities, Benefits, Offices, Process, Team, Voices, FAQ)
   - Smooth anchors, sticky apply bar, back-to-top, logo/hero fallbacks
   Notes:
   - Uses global I18N and CONTENT from translations.js if present
   - Falls back to inline arrays in HTML if I18N/CONTENT are absent
============================================================================ */

/* ------------------------------
   0) Tiny utilities
---------------------------------*/
const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);

const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ------------------------------
   1) Global state
---------------------------------*/
const State = {
  lang: (document.documentElement.getAttribute('data-lang') || 'ja'),
  carouselIdx: 0,
  carouselTimer: null
};

/* ------------------------------
   2) Data sources (translations.js or inline fallbacks)
---------------------------------*/
const I18N = window.I18N || {
  ja: {
    'brand.title':'TP','brand.sub':'Malaysia · Thailand — 日本語採用',
    'nav.about':'会社紹介','nav.why':'なぜTP','nav.cities':'拠点','nav.benefits':'福利厚生','nav.process':'応募の流れ','nav.faq':'FAQ','nav.contact':'お問い合わせ',
    'cta.apply':'ご応募はこちら','cta.jobs':'求人を見る','cta.support':'移住サポートを見る',
    'hero.eyebrow':'暮らすように、海外で働く。','hero.leading':'あなたの新しいキャリアの舞台に、','hero.lead':'多国籍な環境と、日本語を活かせる仕事。コストを抑えた快適な暮らしと、就労ビザ／移住サポートで初めての海外就職も安心して始められます。',
    heroTexts:['マレーシア・タイという選択。','グローバルなキャリア。','安心の移住サポート。'],
    'faq.title':'よくある質問',
    contactThanks: name => `ありがとうございました、${name}さん。お問い合わせを受け付けました（デモ）。`
  },
  en: {
    'brand.title':'TP','brand.sub':'Malaysia · Thailand — JP recruitment',
    'nav.about':'About','nav.why':'Why TP','nav.cities':'Cities','nav.benefits':'Benefits','nav.process':'Process','nav.faq':'FAQ','nav.contact':'Contact',
    'cta.apply':'Apply Now','cta.jobs':'View Jobs','cta.support':'Relocation Support',
    'hero.eyebrow':'Work abroad like you live here.','hero.leading':'Your next career stage:','hero.lead':'Multinational teams, Japanese-language roles, and comfortable living costs. With visa & relocation support, your first overseas job can start smoothly.',
    heroTexts:['Malaysia & Thailand.','Global career opportunities.','Trusted relocation support.'],
    'faq.title':'FAQ',
    contactThanks: name => `Thanks, ${name}. Your message was received (demo).`
  }
};

const CONTENT = window.CONTENT || (() => {
  // Pull from inline arrays if they exist in the page, else provide minimal defaults
  const cities = window.cities || [
    {id:'kl', title:'Kuala Lumpur (KL)', img:'images/kl.jpg', desc:'A modern city with multicultural life and strong JP support.'},
    {id:'penang', title:'Penang', img:'images/penang.jpg', desc:'Historic island with relaxed lifestyle and lower costs.'},
    {id:'bkk', title:'Bangkok', img:'images/bangkok.jpg', desc:'Lively Asian hub with large JP community and great transit.'}
  ];
  const benefits = window.benefits || [
    {t:'Visa Support', d:'Company-sponsored Employment Pass application.'},
    {t:'Relocation', d:'One-way ticket + initial hotel, airport pickup.'},
    {t:'Allowances', d:'Shift/night/housing allowances as applicable.'}
  ];
  const why1 = window.why1 || [
    {t:'Global environment', d:'Improve language & intercultural skills daily.'},
    {t:'Many JP roles', d:'Plenty of JP-focused roles to start safely.'}
  ];
  const why2 = window.why2 || [
    {t:'Career growth', d:'Trainer/QA/Lead/Manager tracks open.'},
    {t:'Supportive culture', d:'Diverse & respectful workplace.'}
  ];
  const processSteps = window.processSteps || [
    {k:'Step 1', v:'CV screening (JP/EN).'},
    {k:'Step 2', v:'Online tests (as needed).'},
    {k:'Step 3', v:'1st interview (online).'},
    {k:'Step 4', v:'2nd interview.'},
    {k:'Step 5', v:'Offer → Visa → Relocation.'}
  ];
  const offices = window.offices || [
    {title:'G Tower (KL)', img:'images/gtower.jpg', points:['Near Ampang Park','Walk to KLCC/Avenue K','Grade A office']}
  ];
  const galleryImgs = window.galleryImgs || [
    'images/IMG_4192.jpeg','images/IMG_4193.jpeg','images/IMG_4271.jpeg','images/IMG_4270.jpeg'
  ];
  const team = window.team || [
    {name:'Maya', role:'Hiring Manager', img:'images/maya.jpg', bio:'APAC hiring, bilingual JP/KR.'},
    {name:'Joseph', role:'Senior Manager', img:'images/joseph.jpg', bio:'Candidate-centric hiring, 14y APAC.'},
    {name:'Akito', role:'Recruiter', img:'images/akito.jpg', bio:'Hospitality background.'},
    {name:'Maho', role:'Talent Attraction', img:'images/maho.jpg', bio:'Supports fresh grads.'}
  ];
  const voices = window.voices || [
    {quote:'違っていい、が心を自由にしてくれた。', who:'Maho / TA'},
    {quote:'週末の近距離海外、人生が広がる。', who:'JP CSR'},
    {quote:'英語に自信がなくても始められた。', who:'New Grad'}
  ];
  const faq = window.faq || [
    {q:'英語が苦手でも大丈夫ですか？', a:'はい。日本語サポートがあり、JP中心の職種もあります。'},
    {q:'ビザは会社がサポートしますか？', a:'はい。EP申請は会社がサポート（本人費用は会社負担）。'},
    {q:'未経験でも応募できますか？', a:'未経験・新卒歓迎のポジションもあります。'}
  ];

  return {
    ja: { cities, benefits, why1, why2, processSteps, offices, galleryImgs, team, voices, faq },
    en: {
      cities: cities.map(c => ({
        ...c,
        title: c.id==='kl' ? 'Kuala Lumpur (KL)' : c.id==='penang' ? 'Penang' : 'Bangkok',
        desc: c.id==='kl'
          ? 'Urban convenience with multicultural life and strong Japanese-language services.'
          : c.id==='penang'
          ? 'Historic island vibe with calm lifestyle and affordable living.'
          : 'Vibrant international hub with extensive JP community and transit.'
      })),
      benefits: [
        {t:'Visa support',d:'Company assists with Employment Pass application.'},
        {t:'Relocation support',d:'One-way ticket + initial hotel, airport pickup.'},
        {t:'Compensation & allowances',d:'Night/shift/housing allowances (project-dependent).'},
        {t:'Health & insurance',d:'Medical, dental, vision assistance, group insurance.'},
        {t:'Career programs',d:'Internal mobility/JUMP for growth.'},
        {t:'Language training',d:'GoFluent & Bootcamps.'}
      ],
      why1: [
        {t:'Grow in a global team',d:'Develop language and intercultural skills daily.'},
        {t:'Plenty of JP roles',d:'Start safely with JP-focused positions.'},
        {t:'Strong JP support',d:'Japanese staff & guidance for life and work.'}
      ],
      why2: [
        {t:'Merit-based growth',d:'Move into trainer, QA, TL, manager tracks.'},
        {t:'Relocation + visa',d:'End-to-end support for your move.'},
        {t:'Inclusive culture',d:'Diverse, respectful and collaborative.'}
      ],
      processSteps: [
        {k:'Step 1: CV screening', v:'Submit JP or EN resume.'},
        {k:'Step 2: Online tests', v:'Language/aptitude as required.'},
        {k:'Step 3: 1st interview', v:'Recruiter (online, JP available).'},
        {k:'Step 4: 2nd interview', v:'Hiring manager (online).'},
        {k:'Step 5: Offer → Visa', v:'EP application, relocation, onboarding.'}
      ],
      offices,
      galleryImgs,
      team: team.map(m => ({
        ...m,
        role: m.role === '採用マネージャー' ? 'Hiring Manager' :
              m.role === 'シニアマネージャー' ? 'Senior Manager' : m.role
      })),
      voices: [
        {quote:'“Being different is okay — I feel freer here.”', who:'Maho / TA'},
        {quote:'“Weekend short-hauls opened up my life.”', who:'JP CSR'},
        {quote:'“I could start even without English confidence.”', who:'New Grad'}
      ],
      faq: [
        {q:'Is limited English okay?', a:'Yes. We offer JP support and many JP-centric roles.'},
        {q:'Will TP support my visa?', a:'Yes — company-sponsored EP application.'},
        {q:'Can I apply without experience?', a:'Yes — new grads/first-time applicants welcome.'}
      ]
    }
  };
})();

/* ------------------------------
   3) Apply translations for [data-i18n]
---------------------------------*/
function applyStaticI18n(lang) {
  document.documentElement.setAttribute('data-lang', lang);
  $$('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const dict = I18N[lang];
    if (!dict || !dict[key]) return;
    el.innerHTML = dict[key];
  });
  // Update language button label
  const langBtn = $('#langBtn');
  if (langBtn) langBtn.textContent = lang === 'ja' ? 'EN' : '日本語';
}

/* ------------------------------
   4) Renderers for dynamic blocks
---------------------------------*/
function renderHeroTypewriter(lang) {
  const node = $('#heroType');
  if (!node) return;
  const texts = (I18N[lang] && I18N[lang].heroTexts) || ['Malaysia & Thailand.'];
  let idx = 0, char = 0, deleting = false;

  const tick = () => {
    const t = texts[idx];
    if (!deleting) {
      node.textContent = t.slice(0, char + 1);
      char++;
      if (char === t.length) {
        deleting = true;
        setTimeout(tick, prefersReduced ? 600 : 1400);
        return;
      }
    } else {
      node.textContent = t.slice(0, char - 1);
      char--;
      if (char === 0) {
        deleting = false;
        idx = (idx + 1) % texts.length;
      }
    }
    setTimeout(tick, prefersReduced ? 0 : (deleting ? 40 : 70));
  };

  node.textContent = '';
  setTimeout(tick, prefersReduced ? 0 : 300);
}

function renderGallery(lang) {
  const wrap = $('#gallery');
  if (!wrap) return;
  wrap.innerHTML = '';
  const list = (CONTENT[lang] && CONTENT[lang].galleryImgs) || [];
  list.forEach(src => {
    const img = new Image();
    img.src = src;
    img.alt = 'gallery';
    img.loading = 'lazy';
    img.style.borderRadius = '10px';
    img.style.objectFit = 'cover';
    wrap.appendChild(img);
  });
}

function renderWhyLists(lang) {
  const list1 = $('#whyList1');
  const list2 = $('#whyList2');
  if (list1) {
    list1.innerHTML = '';
    (CONTENT[lang].why1 || []).forEach(item => {
      const div = document.createElement('div');
      div.className = 'item';
      div.innerHTML = `<h4 style="margin:0 0 6px">${item.t}</h4><p style="color:#4B5563;margin:0">${item.d}</p>`;
      list1.appendChild(div);
      observeReveal(div);
    });
  }
  if (list2) {
    list2.innerHTML = '';
    (CONTENT[lang].why2 || []).forEach(item => {
      const div = document.createElement('div');
      div.className = 'item';
      div.innerHTML = `<h4 style="margin:0 0 6px">${item.t}</h4><p style="color:#4B5563;margin:0">${item.d}</p>`;
      list2.appendChild(div);
      observeReveal(div);
    });
  }
}

function renderCities(lang) {
  const box = $('#citiesCards');
  if (!box) return;
  box.innerHTML = '';
  (CONTENT[lang].cities || []).forEach(c => {
    const card = document.createElement('div');
    card.className = 'city';
    card.innerHTML = `
      <img src="${c.img}" alt="${c.title}" onerror="this.style.display='none'">
      <div class="overlay">
        <strong>${c.title}</strong>
        <div style="font-size:13px;margin-top:4px">${c.desc}</div>
      </div>`;
    box.appendChild(card);
    observeReveal(card);
  });
}

function renderBenefits(lang) {
  const slides = $('#benefitSlides');
  if (!slides) return;
  slides.innerHTML = '';
  (CONTENT[lang].benefits || []).forEach(b => {
    const s = document.createElement('div');
    s.className = 'slide';
    s.innerHTML = `<h4 style="margin:0 0 6px">${b.t}</h4><p style="color:#4B5563;margin:0">${b.d}</p>`;
    slides.appendChild(s);
    observeReveal(s);
  });
  initCarousel(); // reset carousel after re-render
}

function renderProcess(lang) {
  const list = $('#processList');
  if (!list) return;
  list.innerHTML = '';
  (CONTENT[lang].processSteps || []).forEach(st => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${st.k}</strong><div style="color:#4B5563;margin-top:4px">${st.v}</div>`;
    list.appendChild(li);
    observeReveal(li);
  });
}

function renderOffices(lang) {
  const wrap = $('#officeCards');
  if (!wrap) return;
  wrap.innerHTML = '';
  (CONTENT[lang].offices || []).forEach(o => {
    const card = document.createElement('div');
    card.className = 'card';
    const pts = (o.points || []).map(p => `<li>${p}</li>`).join('');
    card.innerHTML = `
      <img src="${o.img}" alt="${o.title}" style="height:160px;object-fit:cover;border-radius:10px;border:1px solid #EEF1F4;margin-bottom:8px" onerror="this.style.display='none'">
      <h4 style="margin:6px 0">${o.title}</h4>
      <ul style="color:#4B5563;padding-left:18px;margin:0">${pts}</ul>`;
    wrap.appendChild(card);
    observeReveal(card);
  });
}

function renderTeam(lang) {
  const grid = $('#teamGrid');
  if (!grid) return;
  grid.innerHTML = '';
  (CONTENT[lang].team || []).forEach(m => {
    const div = document.createElement('div');
    div.className = 'member';
    div.innerHTML = `
      <img src="${m.img}" alt="${m.name}" onerror="this.style.display='none'">
      <h4 style="margin:6px 0 2px">${m.name}</h4>
      <div style="color:#6b7280;font-size:13px">${m.role || ''}</div>
      <p style="font-size:13px;color:#4B5563;margin-top:8px">${m.bio || ''}</p>`;
    grid.appendChild(div);
    observeReveal(div);
  });
}

function renderVoices(lang) {
  const grid = $('#voiceGrid');
  if (!grid) return;
  grid.innerHTML = '';
  (CONTENT[lang].voices || []).forEach(v => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `<p class="quote" style="margin:0 0 8px">“${v.quote}”</p><div style="color:#6b7280;font-size:13px">${v.who || ''}</div>`;
    grid.appendChild(card);
    observeReveal(card);
  });
}

function renderFAQ(lang) {
  const wrap = $('#faqList');
  if (!wrap) return;
  wrap.innerHTML = '';
  (CONTENT[lang].faq || []).forEach(item => {
    const q = document.createElement('button');
    q.className = 'q';
    q.textContent = item.q;
    const a = document.createElement('div');
    a.className = 'a';
    a.textContent = item.a;
    wrap.appendChild(q);
    wrap.appendChild(a);
  });
  // interactions
  $$('#faqList .q').forEach(btn => {
    on(btn, 'click', () => {
      const ans = btn.nextElementSibling;
      const isOpen = ans.style.display === 'block';
      $$('#faqList .a').forEach(x => x.style.display = 'none');
      ans.style.display = isOpen ? 'none' : 'block';
    });
  });
}

/* ------------------------------
   5) Carousel
---------------------------------*/
function initCarousel() {
  const slides = $('#benefitSlides');
  const prev = $('#bPrev');
  const next = $('#bNext');
  if (!slides) return;
  State.carouselIdx = 0;

  function update() {
    const child = slides.children[0];
    const step = child ? (child.offsetWidth + 12) : 320;
    slides.style.transform = `translateX(${-State.carouselIdx * step}px)`;
  }
  on(prev, 'click', () => {
    State.carouselIdx = Math.max(0, State.carouselIdx - 1);
    update();
  });
  on(next, 'click', () => {
    const max = Math.max(0, slides.children.length - 1);
    State.carouselIdx = Math.min(max, State.carouselIdx + 1);
    update();
  });

  clearInterval(State.carouselTimer);
  if (!prefersReduced) {
    State.carouselTimer = setInterval(() => {
      const max = Math.max(0, slides.children.length - 1);
      State.carouselIdx = (State.carouselIdx + 1) % (max + 1);
      update();
    }, 4200);
  }
  window.addEventListener('resize', update, { passive: true });
  requestAnimationFrame(update);
}

/* ------------------------------
   6) Reveal on scroll
---------------------------------*/
const IO = ('IntersectionObserver' in window) ? new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      IO.unobserve(e.target);
    }
  });
}, { threshold: 0.12 }) : null;

function observeReveal(el) {
  if (!el) return;
  el.classList.add('reveal');
  if (IO) IO.observe(el); else el.classList.add('in');
}

/* ------------------------------
   7) Drawer menu (mobile)
---------------------------------*/
function initDrawer() {
  const menuBtn = $('#menuBtn');
  const drawer = $('#drawer');
  const scrim  = $('#scrim');
  const close  = $('#closeDrawer');

  const open = () => {
    drawer.classList.add('open');
    scrim.classList.add('show');
    drawer.setAttribute('aria-hidden','false');
    scrim.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  };
  const shut = () => {
    drawer.classList.remove('open');
    scrim.classList.remove('show');
    drawer.setAttribute('aria-hidden','true');
    scrim.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  };

  on(menuBtn,'click', open);
  on(close,'click', shut);
  on(scrim,'click', shut);
  $$('#drawer a').forEach(a => on(a,'click', shut));
}

/* ------------------------------
   8) Smooth internal anchors
---------------------------------*/
function initAnchors() {
  $$('a[href^="#"]').forEach(a => {
    on(a, 'click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
      }
    });
  });
}

/* ------------------------------
   9) Back-to-top & sticky apply bar
---------------------------------*/
function initScrollUX() {
  const toTop = $('#toTop');
  const applyBar = $('#applyBar');
  let lastY = window.scrollY;

  const onScroll = () => {
    const y = window.scrollY;
    if (toTop) {
      if (y > 480) toTop.classList.add('show'); else toTop.classList.remove('show');
    }
    if (applyBar) {
      // Show on small screens; CSS already hides on larger
      if (y > 220) applyBar.style.transform = 'translateY(0)';
      // subtle reveal/hide based on scroll direction
      if (y > lastY + 12) {
        applyBar.style.opacity = '0.96';
      } else if (y < lastY - 12) {
        applyBar.style.opacity = '1';
      }
    }
    lastY = y;
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ------------------------------
   10) Language toggle
---------------------------------*/
function setLanguage(lang) {
  State.lang = lang;
  applyStaticI18n(lang);
  renderHeroTypewriter(lang);
  renderGallery(lang);
  renderWhyLists(lang);
  renderCities(lang);
  renderBenefits(lang);
  renderProcess(lang);
  renderOffices(lang);
  renderTeam(lang);
  renderVoices(lang);
  renderFAQ(lang);
}

function initLanguage() {
  const btn = $('#langBtn');
  const defaultLang = (navigator.language || '').startsWith('en') ? 'en' : State.lang;
  setLanguage(defaultLang);
  if (btn) {
    on(btn, 'click', () => {
      const next = (State.lang === 'ja') ? 'en' : 'ja';
      setLanguage(next);
      // tiny ripple-like feedback (minimalist)
      btn.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.06)' }, { transform: 'scale(1)' }], { duration: 180 });
    });
  }
}

/* ------------------------------
   11) Contact form (demo)
---------------------------------*/
function initContactForm() {
  const form = $('#contactForm');
  if (!form) return;
  on(form, 'submit', (e) => {
    e.preventDefault();
    const name = $('#name')?.value?.trim() || '';
    const msg = (I18N[State.lang] && I18N[State.lang].contactThanks) ? I18N[State.lang].contactThanks(name || 'Guest') : `Thanks ${name || 'Guest'}!`;
    alert(msg);
    form.reset();
  });
}

/* ------------------------------
   12) Assets fallback
---------------------------------*/
function initAssetFallbacks() {
  const logo = $('#logoImg');
  if (logo) {
    on(logo, 'error', () => {
      logo.style.display = 'none';
      const brand = document.createElement('div');
      brand.innerHTML = `<div style="font-weight:900;font-size:18px">TP</div><div style="font-size:12px;color:#6b7280">Malaysia · Thailand</div>`;
      $('.brand').appendChild(brand);
    });
  }
  const hero = $('#heroCover');
  if (hero) {
    on(hero, 'error', () => {
      hero.src = 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1400&q=80';
    });
  }
}

/* ------------------------------
   13) Initialize everything
---------------------------------*/
function initRevealOnLoad() {
  $$('.reveal').forEach(el => observeReveal(el));
}

function initGalleryDefault() {
  // If #gallery is empty and no CONTENT images, add a soft placeholder
  const g = $('#gallery');
  if (!g) return;
  if (!g.children.length && !(CONTENT[State.lang]?.galleryImgs?.length)) {
    const ph = document.createElement('div');
    ph.style.height = '180px';
    ph.style.border = '1px dashed #EEF1F4';
    ph.style.borderRadius = '10px';
    ph.style.display = 'grid';
    ph.style.placeItems = 'center';
    ph.style.color = '#6b7280';
    ph.textContent = 'ギャラリー画像を追加してください';
    g.appendChild(ph);
  }
}

function init() {
  initDrawer();
  initAnchors();
  initLanguage();       // calls renderers
  initContactForm();
  initScrollUX();
  initAssetFallbacks();
  initRevealOnLoad();
  initGalleryDefault();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// End of app.js

