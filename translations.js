/* ============================================================================
   TP Candidate Microsite — translations.js
   Provides:
     - window.I18N   (static UI strings & language-aware helpers)
     - window.CONTENT (page data rendered by app.js)
     - window.getChatGPTPrompt(lang) (Ask ChatGPT prompt per language)
   Also: on DOMContentLoaded, injects the ChatGPT prompt into #chatgptPrompt
   Updated: 2025-08-14
============================================================================ */

/* ----------------------------------------------------------
   0) I18N DICTIONARIES (JP primary, EN optional toggle)
-----------------------------------------------------------*/
(function () {
  const I18N = {
    ja: {
      // Brand & Nav
      'brand.title': 'TP',
      'brand.sub': 'Malaysia · Thailand — 日本語採用',
      'nav.about': '会社紹介',
      'nav.jobs': '求人・福利厚生',
      'nav.relocation': '移住・ビザ',
      'nav.why': 'マレーシア・タイの魅力',
      'nav.faq': 'FAQ',
      'cta.apply': 'ご応募はこちら',
      'cta.viewJobs': '求人を見る',
      'cta.relocation': '移住サポート',

      // Drawer
      'drawer.about': '会社紹介',
      'drawer.jobs': '求人・給与/福利厚生',
      'drawer.relocation': '移住・ビザ',
      'drawer.process': '面接プロセス',
      'drawer.why': 'マレーシア・タイの魅力',
      'drawer.casual': 'カジュアル面談',
      'drawer.testimonials': '社員の声',
      'drawer.office': '働く環境',
      'drawer.career': 'キャリア・語学',
      'drawer.faq': 'FAQ',

      // Hero
      'hero.eyebrow': '暮らすように、海外で働く。',
      'hero.leading': 'あなたの新しいキャリアの舞台に、',
      'hero.lead':
        '多国籍な環境と、日本語を活かせる仕事。就労ビザ／移住サポートで海外就職も安心。',
      heroTexts: [
        'マレーシア・タイという選択。',
        'グローバルなキャリア。',
        '安心の移住サポート。'
      ],

      // Stats
      'stat.countries': '拠点国',
      'stat.people': '従業員',
      'stat.jp_roles': '日本語ポジション',
      'stat.jp_roles_n': '多数',

      // Priority (legacy section labels kept for consistency)
      'priority.title': '優先メニュー',
      'priority.sub': 'よく見る項目をすぐに開けます',
      // New 3×3 gallery headings
      'priority.gallery.title': '優先メニュー（見やすいギャラリー）',
      'priority.gallery.sub': '9つの主要トピックをタイルで表示',

      // Priority icon captions
      'prio.about.t': 'About TP',
      'prio.about.d': 'テレパフォーマンスとは',
      'prio.jobs.t': '求人を見る',
      'prio.jobs.d': '給与・福利厚生',
      'prio.relo.t': '移住・ビザサポート',
      'prio.relo.d': 'EP申請・渡航・初期宿泊',
      'prio.process.t': '面接プロセス',
      'prio.process.d': 'オンラインで完結',
      'prio.why.t': 'マレーシア・タイの魅力',
      'prio.why.d': '暮らし・文化・旅のハブ',
      'prio.casual.t': 'カジュアル面談',
      'prio.casual.d': 'まずは気軽に相談',
      'prio.testimonials.t': '社員の声',
      'prio.testimonials.d': '体験談・インタビュー',
      'prio.office.t': '働く環境',
      'prio.office.d': 'オフィス&バーチャルツアー',
      'prio.career.t': 'キャリアパス・昇進',
      'prio.career.d': '語学/研修（GoFluent等）',

      // Secondary
      'secondary.title': 'サブメニュー',
      'secondary.sub': '生活情報・カルチャー・サポート',
      'sec.cost.t': '生活コスト',
      'sec.cost.d': '食事・交通・住まい',
      'sec.team.t': '採用チーム紹介',
      'sec.team.d': 'Meet the TA Team',
      'sec.area.t': '周辺環境',
      'sec.area.d': 'オフィス周りの便利情報',
      'sec.blog.t': 'ブログ・コラム',
      'sec.blog.d': '役立つ読み物',
      'sec.line.t': 'LINE公式アカウント',
      'sec.line.d': '最新情報を受け取る',
      'sec.culture.t': 'イベント・カルチャー',
      'sec.culture.d': '社内コミュニティ',
      'sec.faq.t': 'FAQ・よくある質問',
      'sec.faq.d': '応募・生活・ビザ',

      // Culture strip (decor only; no strings)

      // Ask ChatGPT
      'chatgpt.title': 'Ask ChatGPT（TPについて質問）',
      'chatgpt.sub': '下のプロンプトをコピーして、ChatGPTに貼り付けてください。',
      'chatgpt.copy': 'プロンプトをコピー',
      'chatgpt.open': 'ChatGPT を開く',
      'chatgpt.note':
        '※ WebView が使えない場合の代替。言語を切り替えるとプロンプトも切り替わります。',

      // Footer
      'footer.about': '会社紹介',
      'footer.privacy': 'プライバシー',
      'footer.contact': 'お問い合わせ',
      'bar.faq': 'FAQ',

      // Misc / Contact
      contactThanks: (name) => `${name} さん、ありがとうございます！メッセージを受け取りました。`
    },

    en: {
      // Brand & Nav
      'brand.title': 'TP',
      'brand.sub': 'Malaysia · Thailand — JP recruitment',
      'nav.about': 'About',
      'nav.jobs': 'Jobs & Benefits',
      'nav.relocation': 'Relocation & Visa',
      'nav.why': 'Why MY & TH',
      'nav.faq': 'FAQ',
      'cta.apply': 'Apply Now',
      'cta.viewJobs': 'View Jobs',
      'cta.relocation': 'Relocation Support',

      // Drawer
      'drawer.about': 'About',
      'drawer.jobs': 'Jobs & Benefits',
      'drawer.relocation': 'Relocation & Visa',
      'drawer.process': 'Interview Process',
      'drawer.why': 'Why Malaysia & Thailand',
      'drawer.casual': 'Casual Interview',
      'drawer.testimonials': 'Testimonials',
      'drawer.office': 'Office & Workplace',
      'drawer.career': 'Career & Language',
      'drawer.faq': 'FAQ',

      // Hero
      'hero.eyebrow': 'Work abroad like you live here.',
      'hero.leading': 'Your next career stage:',
      'hero.lead':
        'Multinational teams and Japanese-language roles. With visa & relocation support, getting started overseas is smooth.',
      heroTexts: [
        'Malaysia & Thailand.',
        'Global career opportunities.',
        'Trusted relocation support.'
      ],

      // Stats
      'stat.countries': 'Countries',
      'stat.people': 'Employees',
      'stat.jp_roles': 'JP-speaking roles',
      'stat.jp_roles_n': 'Many',

      // Priority headings
      'priority.title': 'Priority',
      'priority.sub': 'Jump into the most-used sections',
      'priority.gallery.title': 'Priority (Visual Gallery)',
      'priority.gallery.sub': 'Nine key topics as photo tiles',

      // Priority icon captions
      'prio.about.t': 'About TP',
      'prio.about.d': 'Who we are',
      'prio.jobs.t': 'Open Jobs',
      'prio.jobs.d': 'Salary & Benefits',
      'prio.relo.t': 'Relocation & Visa',
      'prio.relo.d': 'EP, flights, and landing',
      'prio.process.t': 'Interview Process',
      'prio.process.d': 'Online & simple',
      'prio.why.t': 'Why Malaysia & Thailand',
      'prio.why.d': 'Lifestyle, culture, travel hub',
      'prio.casual.t': 'Casual Interview',
      'prio.casual.d': 'Talk with us first',
      'prio.testimonials.t': 'Testimonials',
      'prio.testimonials.d': 'Stories & interviews',
      'prio.office.t': 'Work Environment',
      'prio.office.d': 'Office & Virtual Tour',
      'prio.career.t': 'Career Growth',
      'prio.career.d': 'Language training (GoFluent)',

      // Secondary
      'secondary.title': 'Explore more',
      'secondary.sub': 'Living info, culture, and updates',
      'sec.cost.t': 'Cost of Living',
      'sec.cost.d': 'Food, transport, housing',
      'sec.team.t': 'Meet the TA Team',
      'sec.team.d': 'Recruiting team',
      'sec.area.t': 'Area Around Office',
      'sec.area.d': 'Conveniences & tips',
      'sec.blog.t': 'Blog & Articles',
      'sec.blog.d': 'Helpful reads',
      'sec.line.t': 'LINE Updates',
      'sec.line.d': 'Get the latest',
      'sec.culture.t': 'Culture & Events',
      'sec.culture.d': 'Communities at TP',
      'sec.faq.t': 'FAQ',
      'sec.faq.d': 'Application, living, visas',

      // Ask ChatGPT
      'chatgpt.title': 'Ask ChatGPT (About TP)',
      'chatgpt.sub': 'Copy the prompt below and paste it into ChatGPT.',
      'chatgpt.copy': 'Copy Prompt',
      'chatgpt.open': 'Open ChatGPT',
      'chatgpt.note':
        'If WebView is unavailable, use this. Switching languages updates the prompt.',

      // Footer
      'footer.about': 'About',
      'footer.privacy': 'Privacy',
      'footer.contact': 'Contact',
      'bar.faq': 'FAQ',

      // Misc / Contact
      contactThanks: (name) => `Thanks, ${name}! We received your message.`
    }
  };

  /* ----------------------------------------------------------
     1) CONTENT DATA (rendered by app.js)
  -----------------------------------------------------------*/
  const CONTENT = {
    links: {
      apply:
        'https://careerseng-TP.icims.com/jobs/49026/customer-service-representative---japanese-speaking-%28kl%29/job?mode=job&iis=LANDINGPAGE',
      casual: 'https://forms.office.com/e/2UvpbweQww'
    },

    // Japanese content
    ja: {
      // WHY TP (PPT-derived bullets)
      why1: [
        { t: '🌍 グローバルな環境でレベルアップ', d: '英語・異文化理解が日常で鍛えられる国際チーム。' },
        { t: '🗣️ 日本語ポジションが豊富', d: '英語に不安があっても日本語中心で安心スタート。' },
        { t: '👥 日本人サポートの安心感', d: '生活も仕事も日本語で相談できる体制。' }
      ],
      why2: [
        { t: '💼 実力次第で早期昇進も', d: 'トレーナー/QA/リーダー/マネージャーへ多彩なキャリア。' },
        { t: '✈️ ビザ・渡航・宿泊サポート', d: 'EP申請代行、片道航空券、初期ホテル、空港送迎。' },
        { t: '🌈 多様性がベースのカルチャー', d: '国籍・性別・年齢を超えてフラットに働ける。' }
      ],

      // Cities
      cities: [
        {
          id: 'kl',
          title: 'クアラルンプール（KL）',
          img:
            'https://images.unsplash.com/photo-1507908708918-778587c9e563?q=80&w=1200&auto=format&fit=crop',
          desc:
            '都市の利便性 × 多文化の共存。日本食・病院・学校・交通網も充実で安心。'
        },
        {
          id: 'penang',
          title: 'ペナン（Penang）',
          img:
            'https://images.unsplash.com/photo-1597200381847-3d1e2415dfcf?q=80&w=1200&auto=format&fit=crop',
          desc:
            '自然と歴史が息づく島ライフ。海の見える高層コンド、落ち着いた治安。'
        },
        {
          id: 'bkk',
          title: 'バンコク（Bangkok）',
          img:
            'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=1200&auto=format&fit=crop',
          desc:
            '“東南アジアの東京”。日系施設が超充実、BTS/MRTで移動快適。'
        }
      ],

      // Benefits (carousel)
      benefits: [
        { t: '就労ビザサポート', d: 'EP申請を会社が代行（会社負担）。' },
        { t: '渡航・宿泊サポート', d: '片道航空券、6泊7日ホテル、空港送迎。' },
        { t: '給与・手当', d: '夜勤/住宅/時間外手当（プロジェクトによる）。' },
        { t: '医療と保険', d: '医療・歯科・眼科補助、団体保険。' },
        { t: 'キャリア支援', d: '社内異動／JUMPプログラム。' },
        { t: '語学', d: 'GoFluentやLanguage Bootcamp。' }
      ],

      // Process (timeline)
      processSteps: [
        { k: '① 書類選考', v: '履歴書・職歴（日本語/英語）' },
        { k: '② オンラインテスト', v: '語学・業務適性（必要に応じて）' },
        { k: '③ 一次面接', v: '採用チームとオンライン' },
        { k: '④ 二次面接', v: '配属チームの面接' },
        { k: '⑤ オファー → ビザ', v: '条件確認、EP申請、渡航・初期宿泊' }
      ],

      // Offices
      offices: [
        {
          title: 'G Tower（KL）',
          img:
            'https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?q=80&w=1200&auto=format&fit=crop',
          points: ['Ampang Park駅直結（MRT/LRT）', 'KLCC/Intermarkが徒歩圏', 'Grade Aオフィス']
        },
        {
          title: 'Penang — Livingston',
          img:
            'https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1200&auto=format&fit=crop',
          points: ['静かな環境', '周辺に飲食店・薬局', '通勤アクセス良好']
        },
        {
          title: 'Penang — One Precinct',
          img:
            'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1200&auto=format&fit=crop',
          points: ['Bayan Baruのモダンビル', '空港から約15分', 'Queensbay Mall近く']
        },
        {
          title: 'Penang — GBS@Mahsuri',
          img:
            'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=1200&auto=format&fit=crop',
          points: ['州のGBSハブ中心', 'IT/BPO企業が集積', '生活インフラが徒歩圏']
        }
      ],

      // Team (sample placeholders)
      team: [
        {
          name: 'Maho',
          role: 'TA | Japan Market',
          img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop',
          bio: '初めての海外就職も、日本語で伴走します。'
        },
        {
          name: 'Kenta',
          role: 'Recruiter',
          img: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=800&auto=format&fit=crop',
          bio: 'キャリア相談、お気軽にどうぞ。'
        },
        {
          name: 'Aya',
          role: 'Coordinator',
          img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop',
          bio: '渡航手続きや現地生活もフォローします。'
        },
        {
          name: 'Leo',
          role: 'Sourcer',
          img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop',
          bio: 'ご希望のプロジェクトを一緒に探します。'
        }
      ],

      // Voices / Testimonials
      voices: [
        { quote: '「違っていい」という価値観が、心を自由にしてくれました。', who: '採用チーム Maho' },
        { quote: '週末に海外旅行が現実的。ハブ空港の強みを感じます。', who: '社員 Aさん（KL）' },
        { quote: '英語は自然と伸びます。毎日がプチ留学みたい。', who: '社員 Bさん（Penang）' }
      ],

      // FAQ
      faq: [
        {
          q: '英語に自信がなくても応募できますか？',
          a: 'はい、日本語中心のポジションが多数あります。入社後に英語力を伸ばす支援もあります。'
        },
        {
          q: '就労ビザの手続きは難しいですか？',
          a: '会社が申請を代行します。必要書類も日本語でご案内します。'
        },
        {
          q: '住居はどうやって探せば良いですか？',
          a: '現地エージェントの紹介、オリエンテーションでのアドバイスなどを提供します。'
        }
      ],

      // About gallery (placeholder list)
      galleryImgs: [
        'https://images.unsplash.com/photo-1563298723-dcfebaa392e3?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1517816743773-6e0fd518b4a6?q=80&w=800&auto=format&fit=crop'
      ]
    },

    // English content (brief mirrors for key sections)
    en: {
      why1: [
        { t: '🌍 Level up in a global team', d: 'Daily practice in English & cross-culture collaboration.' },
        { t: '🗣️ Many JP-speaking roles', d: 'Start safely even if your English is still growing.' },
        { t: '👥 JP support available', d: 'Ask in Japanese about work & living.' }
      ],
      why2: [
        { t: '💼 Fast-track growth', d: 'Trainer/QA/Lead/Manager paths across projects.' },
        { t: '✈️ Visa/relocation support', d: 'EP, flights, landing hotel, airport pickup.' },
        { t: '🌈 Inclusive culture', d: 'Flat, diverse, collaborative.' }
      ],
      cities: [
        {
          id: 'kl',
          title: 'Kuala Lumpur (KL)',
          img:
            'https://images.unsplash.com/photo-1507908708918-778587c9e563?q=80&w=1200&auto=format&fit=crop',
          desc:
            'Big-city convenience & multicultural life. JP food, hospitals, schools, and transit.'
        },
        {
          id: 'penang',
          title: 'Penang',
          img:
            'https://images.unsplash.com/photo-1597200381847-3d1e2415dfcf?q=80&w=1200&auto=format&fit=crop',
          desc: 'Island lifestyle with history, sea views, and calmer pace.'
        },
        {
          id: 'bkk',
          title: 'Bangkok',
          img:
            'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=1200&auto=format&fit=crop',
          desc: '“Tokyo of SEA” — extensive JP amenities and modern transit.'
        }
      ],
      benefits: [
        { t: 'Visa Support', d: 'Company handles EP application.' },
        { t: 'Relocation', d: 'One-way flight, landing hotel, airport pickup.' },
        { t: 'Pay & Allowances', d: 'Night, housing, overtime (project-based).' },
        { t: 'Medical & Insurance', d: 'Health/dental/vision support, group insurance.' },
        { t: 'Career Programs', d: 'Internal moves & JUMP.' },
        { t: 'Language', d: 'GoFluent / Bootcamps.' }
      ],
      processSteps: [
        { k: '1) Screening', v: 'Resume (JP/EN)' },
        { k: '2) Online Tests', v: 'Language / role fit (if needed)' },
        { k: '3) 1st Interview', v: 'Recruiting team (online)' },
        { k: '4) 2nd Interview', v: 'Hiring team' },
        { k: '5) Offer → Visa', v: 'Confirm, EP, flight & landing' }
      ],
      offices: [
        {
          title: 'G Tower (KL)',
          img:
            'https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?q=80&w=1200&auto=format&fit=crop',
          points: ['Ampang Park (MRT/LRT)', 'KLCC/Intermark walkable', 'Grade A office']
        },
        {
          title: 'Penang — Livingston',
          img:
            'https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1200&auto=format&fit=crop',
          points: ['Calm area', 'Food/pharmacy nearby', 'Easy commute']
        },
        {
          title: 'Penang — One Precinct',
          img:
            'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1200&auto=format&fit=crop',
          points: ['Modern building', '15 min from airport', 'Near Queensbay Mall']
        },
        {
          title: 'Penang — GBS@Mahsuri',
          img:
            'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=1200&auto=format&fit=crop',
          points: ['GBS hub', 'IT/BPO cluster', 'Walkable amenities']
        }
      ],
      team: [
        {
          name: 'Maho',
          role: 'TA | Japan Market',
          img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop',
          bio: 'We’ll support you end-to-end in JP.'
        },
        {
          name: 'Kenta',
          role: 'Recruiter',
          img: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=800&auto=format&fit=crop',
          bio: 'Let’s find your best-fit project.'
        },
        {
          name: 'Aya',
          role: 'Coordinator',
          img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop',
          bio: 'Relocation & daily life guidance.'
        },
        {
          name: 'Leo',
          role: 'Sourcer',
          img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop',
          bio: 'Exploring roles across accounts.'
        }
      ],
      voices: [
        { quote: 'Feeling “it’s okay to be different” freed me at work.', who: 'TA Team — Maho' },
        { quote: 'Weekend overseas trips are real here thanks to hub airports.', who: 'KL Member' },
        { quote: 'My English grew naturally through daily collaboration.', who: 'Penang Member' }
      ],
      faq: [
        {
          q: 'Can I apply if my English is basic?',
          a: 'Yes — many JP-first roles. We also support growth after you join.'
        },
        {
          q: 'Is the work visa process hard?',
          a: 'The company handles EP application and guides you in English/Japanese.'
        },
        {
          q: 'How do I find housing?',
          a: 'We share local agents and give practical tips in orientation.'
        }
      ],
      galleryImgs: [
        'https://images.unsplash.com/photo-1563298723-dcfebaa392e3?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1517816743773-6e0fd518b4a6?q=80&w=800&auto=format&fit=crop'
      ]
    }
  };

  /* ----------------------------------------------------------
     2) CHATGPT PROMPTS
     - Language-aware prompts that the user can copy.
     - You asked that it mention Great Place to Work 6 years in a row
       and include positive info about living in Malaysia/Thailand.
  -----------------------------------------------------------*/
  const CHATGPT_PROMPTS = {
    ja: `あなたは就職アドバイザーです。テレパフォーマンス（Teleperformance）マレーシア／タイ（TP Malaysia / TP Thailand）について、候補者が安心して応募を検討できるよう、以下の条件でポジティブに紹介してください。

【必須メッセージ】
- 私たちは Great Place to Work® を6年連続で受賞しています（注：拠点や年により受賞名・表記が異なる場合がありますが、候補者の不安を和らげる積極的なトーンで説明）。
- 日本語スピーカー向けのポジションが多数あり、英語に自信がなくてもスタートしやすいこと。
- 就労ビザ（Employment Pass）の申請サポート、片道航空券、初期ホテル、空港送迎などの移住サポートがあること。

【生活面（例）】
- マレーシア：英語が通じやすい、多文化で食が豊か、住居はプール・ジム付きコンドが一般的、生活コストが日本より抑えやすい。
- タイ（バンコク）：日本人コミュニティが充実、BTS/MRTで移動が快適、日本食や日系医療も多く安心。
- 東南アジアのハブ空港から週末旅行もしやすい。

【トーンと形式】
- 前向きでフレンドリー、かつ現実的。誇張や保証の断定は避ける。
- 箇条書き＋短い段落で読みやすく。
- 最後に「応募」や「カジュアル面談」への自然な誘導（CTA）を添える。

書き出しは簡潔な概要→箇条書き→締めのCTAの順で。`,

    en: `You are a job advisor. Please give a positive, candidate-friendly overview of Teleperformance Malaysia and Thailand (TP Malaysia / TP Thailand) using the guidelines below.

[Must include]
- We are a Great Place to Work® winner for 6 years in a row (note: wording may vary by site/year; keep a positive, confidence-building tone).
- Many JP-speaking roles, so it’s easy for Japanese speakers to start—even if English is still growing.
- Relocation support such as Employment Pass visa guidance, one-way flight, landing hotel, and airport pickup.

[Living examples]
- Malaysia: widely spoken English, multicultural food scene, condos with pool/gym are common, living costs can be lower than Japan.
- Thailand (Bangkok): strong Japanese community, convenient BTS/MRT, plenty of Japanese food and JP-friendly clinics.
- Hub airports make weekend trips around Asia more feasible.

[Tone & format]
- Upbeat, friendly, and realistic—avoid absolute guarantees.
- Use a short intro, clear bullets, and a brief closing CTA to apply or book a casual chat.

Start with a concise summary → bullet points → a friendly CTA.`
  };

  /* ----------------------------------------------------------
     3) EXPORTS
  -----------------------------------------------------------*/
  window.I18N = I18N;
  window.CONTENT = CONTENT;

  // Helper: get prompt by language code ('ja' default)
  window.getChatGPTPrompt = function getChatGPTPrompt(lang) {
    return CHATGPT_PROMPTS[lang === 'en' ? 'en' : 'ja'];
  };

  /* ----------------------------------------------------------
     4) INITIALIZE Ask ChatGPT textarea on load
     (keeps working even if app.js doesn't wire it yet)
  -----------------------------------------------------------*/
  document.addEventListener('DOMContentLoaded', () => {
    const root = document.documentElement;
    const langAttr = root.getAttribute('data-lang') || root.getAttribute('lang') || 'ja';
    const current = langAttr === 'en' ? 'en' : 'ja';
    const ta = document.getElementById('chatgptPrompt');
    if (ta) {
      ta.value = window.getChatGPTPrompt(current);
    }

    // Copy button UX
    const copyBtn = document.getElementById('copyPromptBtn');
    if (copyBtn && ta) {
      copyBtn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(ta.value);
          const original = copyBtn.textContent;
          copyBtn.textContent = current === 'ja' ? 'コピーしました！' : 'Copied!';
          setTimeout(() => (copyBtn.textContent = original), 1400);
        } catch (e) {
          // Fallback
          ta.select();
          document.execCommand('copy');
        }
      });
    }
  });
})();
