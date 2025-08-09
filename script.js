/*
  Script: creative interactions
  - imageLinks: paste your remote image URLs here (for hero/gallery/cities)
  - Uses TPLogo11.png from /images/
*/
(function(){
  // ====== Configuration ======
  const imageLinks = {
    hero: 'images/hero-collage.jpg',
    gallery: [ 'images/IMG_4192.jpeg', 'images/IMG_4193.jpeg', 'images/IMG_4271.jpeg' ],
    cities: [
      {title:'クアラルンプール (KL)', img:'images/kl.jpg'},
      {title:'ペナン (Penang)', img:'images/penang.jpg'},
      {title:'バンコク (Bangkok)', img:'images/bangkok.jpg'}
    ]
  };

  // You told me you added picture links — if you want remote links, replace the strings above with full URLs.

  // ====== Hero background image
  const heroImg = document.getElementById('heroImage');
  const heroBg = document.getElementById('heroBg');
  heroImg.src = imageLinks.hero;
  heroBg.style.backgroundImage = `url('${imageLinks.hero}')`;
  heroBg.style.backgroundSize = 'cover';
  heroBg.style.backgroundPosition = 'center';

  // ====== Gallery injection
  const gallery = document.getElementById('gallery');
  imageLinks.gallery.forEach(src =>{
    const el = document.createElement('img'); el.src = src; el.alt='office'; el.style.width='100%'; el.style.display='block'; el.style.marginBottom='10px'; el.loading='lazy';
    gallery.appendChild(el);
  });

  // ====== Cities injection
  const citiesGrid = document.getElementById('citiesGrid');
  imageLinks.cities.forEach(c=>{
    const card = document.createElement('div'); card.className='city';
    card.innerHTML = `<img src="${c.img}" alt="${c.title}"><div class='meta'><strong>${c.title}</strong></div>`;
    citiesGrid.appendChild(card);
  });

  // ====== Benefits carousel (from PPT content)
  const benefits = [
    {title:'就労ビザサポート', desc:'会社が就労ビザ申請を代行します。'},
    {title:'渡航サポート', desc:'片道航空券＋6泊7日ホテル支給（条件あり）。空港送迎あり。'},
    {title:'キャリア開発', desc:'トレーニングと内部昇進のチャンス。GoFluent等の学習ツールあり。'},
    {title:'福利厚生', desc:'医療保険・休暇制度・夜勤手当など。'}
  ];
  const slides = document.querySelector('.slides');
  benefits.forEach(b=>{
    const s = document.createElement('div'); s.className='slide'; s.innerHTML = `<h4>${b.title}</h4><p>${b.desc}</p>`; slides.appendChild(s);
  });
  let idx = 0;
  const slideWidth = 320; // approximate
  document.getElementById('prev').addEventListener('click', ()=>{ idx = Math.max(0, idx-1); slides.style.transform = `translateX(${-idx * (slideWidth + 12)}px)`});
  document.getElementById('next').addEventListener('click', ()=>{ idx = Math.min(benefits.length-1, idx+1); slides.style.transform = `translateX(${-idx * (slideWidth + 12)}px)`});

  // Auto-play carousel
  setInterval(()=>{ idx = (idx+1) % benefits.length; slides.style.transform = `translateX(${-idx * (slideWidth + 12)}px)` }, 5000);

  // ====== Typewriter for hero
  function typeWriter(node, text, speed=60, cb){
    node.textContent = '';
    let i=0; const t = setInterval(()=>{ node.textContent += text.charAt(i); i++; if(i>=text.length){ clearInterval(t); if(cb) cb(); } }, speed);
  }
  const tw = document.querySelector('.typewriter');
  // language detection
  const userLang = navigator.language || navigator.userLanguage;
  let lang = (userLang && userLang.startsWith('en')) ? 'en' : 'ja';
  const heroText = (lang==='ja') ? tw.dataset.txtJp : tw.dataset.txtEn;
  typeWriter(tw, heroText, 70);

  // ====== Language toggle
  const langBtn = document.getElementById('langBtn');
  langBtn.addEventListener('click', ()=>{
    lang = (lang==='ja') ? 'en' : 'ja';
    // switch small bits (for full i18n you'd expand this)
    document.documentElement.lang = (lang==='ja') ? 'ja' : 'en';
    document.querySelectorAll('.eyebrow').forEach(e=> e.textContent = (lang==='ja')? 'TP | Malaysia & Thailand' : 'TP | Malaysia & Thailand');
    const heroSub = document.querySelector('.hero-sub');
    heroSub.textContent = (lang==='ja') ? '多国籍な環境と、日本語を活かせる仕事。移住サポートと就労ビザ手続きで初めての海外就職を応援します。' : 'Global, Japanese-speaking roles with relocation & visa support.';
    // update typewriter
    const newHero = (lang==='ja') ? tw.dataset.txtJp : tw.dataset.txtEn;
    typeWriter(tw, newHero, 50);
    langBtn.textContent = (lang==='ja') ? 'EN' : '日本語';
  });

  // ====== Scroll reveal (Intersection Observer)
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in-view'); io.unobserve(e.target); } });
  },{threshold:0.12});
  document.querySelectorAll('.section, .why-card, .city, .slide, .timeline li').forEach(el=> io.observe(el));

  // ====== Accordion FAQ
  document.querySelectorAll('.accordion .q').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const a = btn.nextElementSibling; const open = a.style.display === 'block'; document.querySelectorAll('.accordion .a').forEach(x=> x.style.display='none');
      a.style.display = open? 'none' : 'block';
    });
  });

  // ====== Contact form demo
  document.getElementById('contactForm').addEventListener('submit', (e)=>{ e.preventDefault(); alert((lang==='ja')? 'お問い合わせを受け付けました（デモ）。追ってご連絡します。' : 'Message received (demo). We will contact you.'); e.target.reset(); });

  // ====== Smooth anchor scrolling for in-page nav
  document.querySelectorAll('a[href^="#"]').forEach(a=> a.addEventListener('click', (e)=>{ const href=a.getAttribute('href'); if(href.length>1){ e.preventDefault(); document.querySelector(href).scrollIntoView({behavior:'smooth', block:'start'}); } }));

})();
