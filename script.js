// Simple interactivity: language toggle, smooth scroll, intersection animations
(function(){
  const i18n = {
    ja: {
      'nav.about':'会社紹介', 'nav.why':'なぜTP', 'nav.cities':'拠点紹介', 'nav.jobs':'募集', 'nav.process':'応募の流れ', 'nav.faq':'FAQ', 'nav.contact':'お問い合わせ',
      'hero.title':'暮らすように、海外で働く。', 'hero.subtitle':'あなたの新しいキャリアの舞台に、マレーシア・タイという選択を。', 'hero.cta1':'求人を見る', 'hero.cta2':'移住サポートを見る',
      'about.title':'TP マレーシア・タイ求人情報サイトへようこそ', 'about.p':'TP（Teleperformance）は1978年フランス・パリで創業したグローバルBPO企業です。世界100カ国以上、50万人超の従業員と共に、日本語スピーカー向けの職種をマレーシアとタイで積極採用中です。', 'about.cta':'ご応募はこちら',
      'why.title':'Why join TP？ / なぜTPか',
      'cities.title':'マレーシア & タイの拠点 / Cities',
      'jobs.title':'現在の募集', 'jobs.lead':'Customer Service Representative - Japanese Speaking',
      'process.title':'Application Process / 応募から入社まで',
      'faq.title':'FAQ', 'team.title':'採用チーム / Meet the TA Team', 'contact.title':'Contact / お問い合わせ'
    },
    en: {
      'nav.about':'About', 'nav.why':'Why TP', 'nav.cities':'Cities', 'nav.jobs':'Jobs', 'nav.process':'Process', 'nav.faq':'FAQ', 'nav.contact':'Contact',
      'hero.title':'Live abroad like home.', 'hero.subtitle':'Choose Malaysia or Thailand as your next career stage.', 'hero.cta1':'View Jobs', 'hero.cta2':'Relocation Support',
      'about.title':'Welcome to TP Malaysia & Thailand Careers', 'about.p':'Teleperformance (TP) is a global BPO founded in Paris, 1978. We operate in 100+ countries and employ 500k+ staff. We are actively hiring Japanese speakers for Malaysia and Thailand.', 'about.cta':'Apply Now',
      'why.title':'Why join TP?', 'cities.title':'Malaysia & Thailand offices', 'jobs.title':'Current Openings', 'jobs.lead':'Customer Service Representative - Japanese Speaking',
      'process.title':'Application Process', 'faq.title':'FAQ', 'team.title':'TA Team', 'contact.title':'Contact'
    }
  };

  const defaultLang = 'ja';
  let lang = localStorage.getItem('tp_lang') || defaultLang;

  function applyLang(to){
    document.documentElement.lang = (to === 'ja') ? 'ja' : 'en';
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const key = el.getAttribute('data-i18n');
      if(i18n[to] && i18n[to][key]){
        el.innerHTML = i18n[to][key];
      }
    });
    document.getElementById('langToggle').textContent = (to==='ja') ? 'English' : '日本語';
    localStorage.setItem('tp_lang', to);
  }

  document.getElementById('langToggle').addEventListener('click', ()=>{
    lang = (lang === 'ja') ? 'en' : 'ja';
    applyLang(lang);
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', function(e){
      e.preventDefault();
      const id = this.getAttribute('href');
      if(id === '#') return;
      const el = document.querySelector(id);
      if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
    });
  });

  // Intersection Observer for fade-in
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ e.target.classList.add('in-view'); io.unobserve(e.target); }
    });
  }, {threshold:0.12});
  document.querySelectorAll('.section, .job, .city-card, .member').forEach(el=> io.observe(el));

  // Contact form demo
  document.getElementById('contactForm').addEventListener('submit', function(e){
    e.preventDefault();
    alert((lang==='ja')? 'お問い合わせありがとうございます。追ってご連絡します。 (デモ)' : 'Thanks for contacting us. We will get back to you. (Demo)');
    this.reset();
  });

  // Apply saved language on load
  applyLang(lang);
})();
