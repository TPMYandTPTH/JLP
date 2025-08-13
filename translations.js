/* ============================================================================
   TP Candidate Microsite — translations.js
   Provides:
   - window.I18N: bilingual UI strings (JP / EN)
   - window.CONTENT: data payloads (cards, lists, icons, etc.)
   Notes:
   - Keep company shortname "TP" everywhere (per requirement)
   - External links: iCIMS/LINE/eVISA already validated in index/app
   - Image paths assume /images/... with graceful fallback in app.js
   Updated: 2025-08-13
============================================================================ */

(function () {
  /* ---------------------------
     1) UI string dictionaries
  ----------------------------*/
  const I18N = {
    ja: {
      // Brand / Nav
      'brand.title': 'TP',
      'brand.sub': 'Malaysia · Thailand — 日本語採用',
      'nav.about': '会社紹介',
      'nav.why': 'なぜTP',
      'nav.cities': '拠点',
      'nav.benefits': '福利厚生',
      'nav.process': '応募の流れ',
      'nav.faq': 'FAQ',
      'nav.contact': 'お問い合わせ',
      // CTAs
      'cta.apply': 'ご応募はこちら',
      'cta.jobs': '求人を見る',
      'cta.support': '移住サポートを見る',
      // Hero
      'hero.eyebrow': '暮らすように、海外で働く。',
      'hero.leading': 'あなたの新しいキャリアの舞台に、',
      'hero.lead':
        '多国籍な環境と、日本語を活かせる仕事。コストを抑えた快適な暮らしと、就労ビザ／移住サポートで初めての海外就職も安心して始められます。',
      heroTexts: ['マレーシア・タイという選択。', 'グローバルなキャリア。', '安心の移住サポート。'],
      // Sections
      'about.title': 'TPについて',
      'about.subtitle': '1978年創業。世界規模で日本語キャリアを支援します。',
      'about.p1':
        'TP（テレパフォーマンス）は1978年にフランスで設立されたグローバルBPO企業です。世界100カ国以上、50万人超の仲間とともに、日本語を活かしたキャリアをマレーシア・タイで支援しています。Great Place to Work® 認定など、働きやすさに配慮した環境を提供しています。',
      'about.b1': '就労ビザ（Employment Pass）申請のフルサポート（会社負担）。',
      'about.b2': '渡航サポート：片道航空券・到着後宿泊（6泊7日）・空港送迎。',
      'about.b3': '入社前後の生活サポート（住居案内・現地オリエンテーション）。',
      'about.cta_note': 'まずはカジュアル面談で不安を解消しましょう（オンライン・日本語対応）。',
      // Stats
      'stat.countries': '100+',
      'stat.countries_sub': '拠点国',
      'stat.people': '500K+',
      'stat.people_sub': '従業員',
      'stat.jp_roles': '多数',
      'stat.jp_roles_sub': '日本語ポジション',
      // FAQ
      'faq.title': 'よくある質問',
      // Contact
      contactThanks: (name) => `ありがとうございました、${name}さん。お問い合わせを受け付けました（デモ）。`
    },

    en: {
      // Brand / Nav
      'brand.title': 'TP',
      'brand.sub': 'Malaysia · Thailand — JP recruitment',
      'nav.about': 'About',
      'nav.why': 'Why TP',
      'nav.cities': 'Cities',
      'nav.benefits': 'Benefits',
      'nav.process': 'Process',
      'nav.faq': 'FAQ',
      'nav.contact': 'Contact',
      // CTAs
      'cta.apply': 'Apply Now',
      'cta.jobs': 'View Jobs',
      'cta.support': 'Relocation Support',
      // Hero
      'hero.eyebrow': 'Work abroad like you live here.',
      'hero.leading': 'Your next career stage:',
      'hero.lead':
        'Multinational teams, Japanese-language roles, and comfortable living costs. With visa & relocation support, your first overseas job can start smoothly.',
      heroTexts: ['Malaysia & Thailand.', 'Global career opportunities.', 'Trusted relocation support.'],
      // Sections
      'about.title': 'About TP',
      'about.subtitle': 'Established 1978 — Global BPO leader',
      'about.p1':
        'TP (Teleperformance) is a global BPO established in 1978. Operating in 100+ countries with 500k+ employees, TP supports Japanese-speaking careers in Malaysia and Thailand, with strong focus on employee experience.',
      'about.b1': 'Full support for Employment Pass (work visa) application (company-sponsored).',
      'about.b2': 'Relocation support: one-way ticket, initial hotel (6 nights), and airport pickup.',
      'about.b3': 'Pre- and post-arrival support (housing guidance and local orientation).',
      'about.cta_note': 'Start with a casual chat — online and Japanese-language support available.',
      // Stats
      'stat.countries': '100+',
      'stat.countries_sub': 'countries',
      'stat.people': '500K+',
      'stat.people_sub': 'employees',
      'stat.jp_roles': 'Many',
      'stat.jp_roles_sub': 'JP roles',
      // FAQ
      'faq.title': 'FAQ',
      // Contact
      contactThanks: (name) => `Thanks, ${name}. Your message was received (demo).`
    }
  };

  /* ---------------------------
     2) Data payloads for sections
  ----------------------------*/
  const LINKS = {
    apply:
      'https://careerseng-TP.icims.com/jobs/49026/customer-service-representative---japanese-speaking-%28kl%29/job?mode=job&iis=LANDINGPAGE',
    casual: 'https://forms.office.com/e/2UvpbweQww',
    line: 'https://line.me/R/ti/p/@286nmdsd?from=page&searchId=286nmdsd',
    evisa: 'https://malaysiavisa.imi.gov.my'
  };

  // Priority icons (for your future multi-page approach)
  const PRIORITY_ICONS = [
    {
      id: 'about',
      icon: '🏢',
      jp: 'TP / 会社紹介',
      en: 'About TP',
      href: 'about.html'
    },
    {
      id: 'jobs',
      icon: '💼',
      jp: '求人を見る',
      en: 'Open Jobs',
      href: LINKS.apply
    },
    {
      id: 'benefits',
      icon: '🎯',
      jp: '給与・福利厚生',
      en: 'Salary & Benefits',
      href: 'benefits.html'
    },
    {
      id: 'relocation',
      icon: '✈️',
      jp: '移住・ビザサポート',
      en: 'Relocation & Visa',
      href: 'relocation.html'
    },
    {
      id: 'process',
      icon: '🧭',
      jp: '面接プロセス',
      en: 'Interview Process',
      href: 'process.html'
    },
    {
      id: 'why-my-th',
      icon: '🌏',
      jp: 'マレーシア・タイの魅力',
      en: 'Why Malaysia & Thailand',
      href: 'why-destinations.html'
    },
    {
      id: 'casual',
      icon: '💬',
      jp: 'カジュアル面談',
      en: 'Casual Interview',
      href: LINKS.casual
    },
    {
      id: 'testimonials',
      icon: '🗣️',
      jp: '社員の声',
      en: 'Testimonials',
      href: 'testimonials.html'
    },
    {
      id: 'environment',
      icon: '🏙️',
      jp: '働く環境（オフィス）',
      en: 'Office & Environment',
      href: 'office.html'
    },
    {
      id: 'virtual-tour',
      icon: '🎥',
      jp: 'オフィスツアー（バーチャル）',
      en: 'Virtual Office Tour',
      href: 'virtual-tour.html'
    },
    {
      id: 'career-growth',
      icon: '🚀',
      jp: 'キャリアパス・昇進制度',
      en: 'Career Growth',
      href: 'career.html'
    },
    {
      id: 'language-training',
      icon: '📝',
      jp: '言語・トレーニング',
      en: 'Language Bootcamp & GoFluent',
      href: 'language.html'
    }
  ];

  // Secondary icons
  const SECONDARY_ICONS = [
    {
      id: 'cost',
      icon: '💰',
      jp: '生活コスト',
      en: 'Cost of Living',
      href: 'cost.html'
    },
    {
      id: 'daily',
      icon: '🍽️',
      jp: '現地生活（食事・交通・住まい）',
      en: 'Daily Life',
      href: 'daily-life.html'
    },
    {
      id: 'team',
      icon: '🙋‍♀️',
      jp: '採用チーム紹介',
      en: 'Meet the TA Team',
      href: 'team.html'
    },
    {
      id: 'area',
      icon: '📍',
      jp: '周辺環境',
      en: 'Area Around the Office',
      href: 'area.html'
    },
    {
      id: 'blog',
      icon: '📰',
      jp: 'ブログ・コラム',
      en: 'Blog & Articles',
      href: 'blog.html'
    },
    {
      id: 'line',
      icon: '🟩',
      jp: 'LINE公式アカウント',
      en: 'LINE Updates',
      href: LINKS.line
    },
    {
      id: 'culture',
      icon: '🎎',
      jp: '社内カルチャー・イベント',
      en: 'Company Culture & Events',
      href: 'culture.html'
    },
    {
      id: 'faq',
      icon: '❓',
      jp: 'FAQ',
      en: 'FAQ',
      href: 'faq.html'
    }
  ];

  // Why lists (pulled from PPT phrasing; concise)
  const WHY_JA_1 = [
    {
      t: '🌍 グローバルな環境で、自分をレベルアップ！',
      d: '世界中の同僚と働ける環境。毎日がプチ留学のように、英語や異文化理解が自然と伸びます。'
    },
    {
      t: '🗣️ 日本語スピーカー向けポジションが豊富',
      d: '日本語中心の業務から安心スタート。英語は後からキャッチアップでもOK。'
    },
    {
      t: '👥 日本人サポートが充実',
      d: '生活・仕事の両面で日本語による伴走支援。初めての海外でも安心。'
    }
  ];
  const WHY_JA_2 = [
    {
      t: '💼 実力次第でキャリアアップ',
      d: 'トレーナー、QA、チームリーダー、マネージャーなど明確なステップ。'
    },
    {
      t: '✈️ 移住・ビザサポート',
      d: 'EP申請、空港送迎、初期ホテル手配までトータルサポート。'
    },
    {
      t: '🌈 多様性とフラットな社風',
      d: '「違い」を尊重する文化。自分らしく働ける心理的安全性。'
    }
  ];

  const WHY_EN_1 = [
    {
      t: '🌍 Grow in a global team',
      d: 'Daily cross-cultural collaboration grows language and intercultural skills.'
    },
    { t: '🗣️ Many JP-focused roles', d: 'Start safely with Japanese-language roles.' },
    { t: '👥 Strong JP support', d: 'Work & life guidance in Japanese available.' }
  ];
  const WHY_EN_2 = [
    { t: '💼 Merit-based growth', d: 'Trainer/QA/Lead/Manager tracks are open.' },
    { t: '✈️ Relocation + visa', d: 'End-to-end support including EP.' },
    { t: '🌈 Inclusive culture', d: 'Diverse, respectful, psychologically safe.' }
  ];

  // Cities
  const CITIES_JA = [
    {
      id: 'kl',
      title: 'クアラルンプール（KL）',
      img: 'images/kl.jpg',
      desc: '都市の利便性 × 多文化共存 × 日本語サポートが充実。交通の便も良く、生活立ち上げがスムーズ。'
    },
    {
      id: 'penang',
      title: 'ペナン（Penang）',
      img: 'images/penang.jpg',
      desc: '海・自然・歴史ある旧市街。落ち着いた生活コストでバランスの良い生活。'
    },
    {
      id: 'bkk',
      title: 'バンコク（Bangkok）',
      img: 'images/bangkok.jpg',
      desc: '日本人コミュニティ・日系施設が超充実。“東南アジアの東京”のような便利さ。'
    }
  ];
  const CITIES_EN = [
    {
      id: 'kl',
      title: 'Kuala Lumpur (KL)',
      img: 'images/kl.jpg',
      desc: 'Urban convenience, multicultural life, and strong JP services.'
    },
    { id: 'penang', title: 'Penang', img: 'images/penang.jpg', desc: 'Island vibe with calm lifestyle and lower costs.' },
    { id: 'bkk', title: 'Bangkok', img: 'images/bangkok.jpg', desc: 'JP community and infrastructure at scale.' }
  ];

  // Benefits
  const BENEFITS_JA = [
    { t: '就労ビザサポート', d: '会社がEP申請を代行（会社負担）。' },
    { t: '渡航・宿泊サポート', d: '片道航空券＋6泊7日の宿泊支援、空港送迎あり。' },
    { t: '給付・手当', d: '夜勤手当・住宅補助・時間外手当（プロジェクトにより異なる）。' },
    { t: '医療と保険', d: '医療・歯科・眼科補助、団体保険。' },
    { t: 'キャリア支援', d: 'JUMPプログラム／社内異動で幅広いキャリアへ。' },
    { t: '語学研修', d: 'GoFluentやLanguage Bootcamp等が利用可能。' }
  ];
  const BENEFITS_EN = [
    { t: 'Visa support', d: 'Company-sponsored Employment Pass application.' },
    { t: 'Relocation', d: 'One-way ticket, initial hotel, and airport pickup.' },
    { t: 'Allowances', d: 'Night/shift/housing allowances as applicable.' },
    { t: 'Health & insurance', d: 'Medical/dental/vision assistance, group insurance.' },
    { t: 'Career programs', d: 'Internal mobility and JUMP program.' },
    { t: 'Language training', d: 'GoFluent and Bootcamp access.' }
  ];

  // Process
  const PROCESS_JA = [
    { k: '① 書類選考', v: '履歴書・職務経歴書の提出（日本語/英語）' },
    { k: '② オンラインテスト', v: '日本語・英語のスクリーニング／業務適性テスト（必要に応じて）' },
    { k: '③ 一次面接', v: '採用チームによるオンライン面談（日本語対応）' },
    { k: '④ 二次面接', v: 'チームマネージャーとの面接（オンライン）' },
    { k: '⑤ オファー → ビザ申請', v: '条件確認→EP申請→渡航・初期宿泊→入社・研修開始' }
  ];
  const PROCESS_EN = [
    { k: 'Step 1: CV screening', v: 'Submit JP/EN resume.' },
    { k: 'Step 2: Online tests', v: 'Language/aptitude screening (as needed).' },
    { k: 'Step 3: 1st interview', v: 'Recruiter (online, JP available).' },
    { k: 'Step 4: 2nd interview', v: 'Hiring manager (online).' },
    { k: 'Step 5: Offer → Visa', v: 'EP application, relocation & onboarding.' }
  ];

  // Offices
  const OFFICES = [
    {
      title: 'G Tower（KL）',
      img: 'images/gtower.jpg',
      points: ['Ampang Park駅すぐ（MRT/LRT）', 'KLCC・Avenue K・Intermark Mall徒歩圏', 'Grade Aオフィスで設備充実']
    },
    {
      title: 'Penang - Livingston Tower',
      img: 'images/livingston.jpg',
      points: ['ジョージタウン近く', '周辺に飲食・銀行・薬局', '駐車場あり・通勤も◎']
    },
    {
      title: 'Penang - One Precinct',
      img: 'images/oneprecinct.jpg',
      points: ['Bayan Baruのモダンビル', '空港から約15分', 'Queensbay Mall至近']
    },
    { title: 'Penang - GBS@Mahsuri', img: 'images/gbs.jpg', points: ['GBSハブ中心地', 'IT/BPO企業が集積', '生活インフラ徒歩圏'] },
    { title: 'Bangkok - Singha Complex', img: 'images/singha.jpg', points: ['BTS/MRT好アクセス', '周辺に日系施設多数', '快適な通勤動線'] }
  ];

  // Gallery (Japanese-friendly visuals)
  const GALLERY = [
    'images/IMG_4192.jpeg',
    'images/IMG_4193.jpeg',
    'images/IMG_4271.jpeg',
    'images/IMG_4270.jpeg',
    // Culture-forward extras (can be swapped for your own):
    'images/culture_matsuri.jpg',
    'images/culture_sakura.jpg'
  ];

  // TA Team (use your own portraits filenames if needed)
  const TEAM = [
    { name: 'Maya', role: '採用マネージャー', img: 'images/maya.jpg', bio: 'APAC採用10年以上。候補者の成功を第一に。' },
    { name: 'Joseph', role: 'シニアマネージャー', img: 'images/joseph.jpg', bio: 'APAC14年。丁寧で候補者中心の採用運営。' },
    { name: 'Akito', role: '採用担当', img: 'images/akito.jpg', bio: 'ホスピタリティ出身。候補者支援が得意。' },
    { name: 'Maho', role: 'Talent Attraction', img: 'images/maho.jpg', bio: '海外就職の実体験を活かし幅広くサポート。' }
  ];
  const TEAM_EN = TEAM.map((t) => ({
    ...t,
    role:
      t.role === '採用マネージャー'
        ? 'Hiring Manager'
        : t.role === 'シニアマネージャー'
        ? 'Senior Manager'
        : t.role
  }));

  // Testimonials / Voices
  const VOICES_JA = [
    { quote: '“違っていい”という価値観が、心を自由にしてくれた。', who: 'Maho / TA' },
    { quote: '週末の近距離海外、人生が広がる。', who: 'JP CSR' },
    { quote: '英語に自信がなくても始められた。', who: '新卒入社' }
  ];
  const VOICES_EN = [
    { quote: '“Being different is okay — it freed my mind.”', who: 'Maho / TA' },
    { quote: 'Weekend short-hauls opened up my life.', who: 'JP CSR' },
    { quote: 'I could start even without English confidence.', who: 'New Grad' }
  ];

  // FAQ
  const FAQ_JA = [
    {
      q: '英語が苦手でも大丈夫ですか？',
      a: 'はい。日本語対応の採用・現地チームがサポートします。日本語中心のポジションも多数あります。'
    },
    {
      q: 'ビザは会社がサポートしますか？',
      a: 'はい。就労ビザ（EP）申請は会社がサポートします（本人費用は会社負担）。家族ビザは別途費用が発生する場合があります。'
    },
    { q: '未経験でも応募できますか？', a: '未経験・新卒歓迎のポジションがあります。研修とOJTでしっかり支援します。' },
    { q: '住居はどうなりますか？', a: '到着後1週間の宿泊施設を提供（条件あり）。その後は現地チームが物件探しを伴走します。' },
    {
      q: '給与や生活水準は？',
      a: '現地相場に基づく給与体系で、生活コストは日本より低い傾向があり、ゆとりある暮らしが可能です。'
    }
  ];
  const FAQ_EN = [
    {
      q: 'Is limited English okay?',
      a: 'Yes. Recruiting and local teams provide support in Japanese; many JP-centric roles are available.'
    },
    {
      q: 'Will TP support my visa?',
      a: 'Yes — the company manages Employment Pass submission (company-sponsored). Family visas may incur additional costs.'
    },
    { q: 'Can I apply without experience?', a: 'Yes — we welcome new graduates and first-time applicants with training/OJT.' },
    {
      q: 'How about housing?',
      a: 'We provide an initial hotel stay (conditions apply) and help you find housing afterward.'
    },
    {
      q: 'Salary & cost of living?',
      a: 'Competitive local packages; Malaysia & Thailand typically offer lower living costs than Japan.'
    }
  ];

  /* ---------------------------
     3) Compose CONTENT object
  ----------------------------*/
  const CONTENT = {
    // Link hub
    links: LINKS,

    // Home icons (for your future multi-page layout)
    priorityIcons: PRIORITY_ICONS,
    secondaryIcons: SECONDARY_ICONS,

    // Per-language payloads used by app.js renderers
    ja: {
      cities: CITIES_JA,
      benefits: BENEFITS_JA,
      why1: WHY_JA_1,
      why2: WHY_JA_2,
      processSteps: PROCESS_JA,
      offices: OFFICES,
      galleryImgs: GALLERY,
      team: TEAM,
      voices: VOICES_JA,
      faq: FAQ_JA
    },
    en: {
      cities: CITIES_EN,
      benefits: BENEFITS_EN,
      why1: WHY_EN_1,
      why2: WHY_EN_2,
      processSteps: PROCESS_EN,
      offices: OFFICES, // points are readable in EN already; you can localize later if needed
      galleryImgs: GALLERY,
      team: TEAM_EN,
      voices: VOICES_EN,
      faq: FAQ_EN
    }
  };

  // Expose to window
  window.I18N = I18N;
  window.CONTENT = CONTENT;
})();
