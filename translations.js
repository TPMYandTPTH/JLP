/* ============================================================================
   TP Candidate Microsite — translations.js  (FULL / RESTORED / EXPANDED)
   ----------------------------------------------------------------------------
   What this file provides to the site (global namespace):
     • window.I18N                     → localized UI strings (ja / en / ko)
     • window.CONTENT                  → page content (why, cities, benefits, etc.)
     • window.getChatGPTPrompt(lang)   → returns the Ask ChatGPT prompt in that lang
     • window.normalizeLang(code)      → normalizes "jp" → "ja", "ja-JP" → "ja", etc.
     • window.getPreferredLang()       → best-guess of which language to use now
     • window.getLangFromPath()        → parses /en /jp /ja /ko from current URL path
     • window.LANGS                    → ordered list of supported langs: ['ja','en','ko']
     • window.LANG_ALIASES             → alias map used by normalizeLang()
     • DOM init: fills #chatgptPrompt and wires #copyPromptBtn/#openChatGPTBtn if present

   Guarantees:
     • Japanese is the default language.
     • '/jp' after the URL is treated as 'ja' (and '/ja' works too).
     • Nothing here requires app.js to change (helpers are additive).
     • Clipboard copy has a fallback; code runs only if nodes exist.

   Important links:
     • Apply job ad (confirmed): 
       https://careerseng-teleperformance.icims.com/jobs/49026/customer-service-representative---japanese-speaking-%28kl%29/job?mode=job&iis=LANDINGPAGE

   Updated: 2025-08-22
============================================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     0) Constants & Helpers (language plumbing)
     ----------------------------------------------------------
     - normalizeLang(code): maps alias → canonical ('jp' → 'ja')
     - getLangFromPath():   reads '/en' '/jp' '/ja' '/ko' from URL path (any segment)
     - getPreferredLang():  chooses language from (path → html[data-lang]/lang → browser)
  -----------------------------------------------------------*/

  // Supported languages (display order)
  const LANGS = ['ja', 'en', 'ko'];

  // Expose supported language list
  window.LANGS = LANGS.slice();

  // Aliases for user-land / URL inputs; kept broad and generous.
  const LANG_ALIASES = {
    jp: 'ja',
    ja: 'ja',
    'ja-jp': 'ja',
    en: 'en',
    'en-us': 'en',
    'en-gb': 'en',
    'en-au': 'en',
    ko: 'ko',
    'ko-kr': 'ko'
  };

  // Export aliases (read-only usage expected by outside scripts)
  window.LANG_ALIASES = Object.assign({}, LANG_ALIASES);

  /**
   * normalizeLang(code)
   * - Makes incoming codes safe and canonical (ja/en/ko).
   * - Unknown inputs → 'ja' (Japanese default).
   */
  function normalizeLang(code) {
    if (!code || typeof code !== 'string') return 'ja';
    const key = code.trim().toLowerCase().replace('_', '-');
    // Direct alias map
    if (LANG_ALIASES[key]) return LANG_ALIASES[key];
    // Prefix matches for 'ja-*', 'en-*', 'ko-*'
    if (key.startsWith('ja')) return 'ja';
    if (key.startsWith('en')) return 'en';
    if (key.startsWith('ko')) return 'ko';
    return 'ja';
  }

  // Expose
  window.normalizeLang = normalizeLang;

  /**
   * getLangFromPath()
   * - Returns a canonical language code inferred from the URL path,
   *   accepting '/en', '/jp', '/ja', '/ko' anywhere *after* the domain.
   * - If no match: returns '' (caller decides fallback).
   */
  function getLangFromPath() {
    try {
      const path = (location.pathname || '').toLowerCase();
      const segs = path.split('/').map(s => s.trim()).filter(Boolean);
      // Scan for any supported display segment
      for (const seg of segs) {
        if (seg === 'en' || seg === 'ja' || seg === 'jp' || seg === 'ko') {
          return normalizeLang(seg);
        }
      }
      return '';
    } catch (_e) {
      return '';
    }
  }

  // Expose
  window.getLangFromPath = getLangFromPath;

  /**
   * getPreferredLang()
   * Priority:
   *   1) URL path segment (/en /jp /ja /ko)
   *   2) <html data-lang> or <html lang>
   *   3) browser language (navigator.language)
   * Defaults to 'ja'.
   */
  function getPreferredLang() {
    const pathLang = getLangFromPath();
    if (pathLang) return pathLang;

    const root = document.documentElement;
    const attrDataLang = root.getAttribute('data-lang');
    const attrLang = root.getAttribute('lang');
    if (attrDataLang) return normalizeLang(attrDataLang);
    if (attrLang) return normalizeLang(attrLang);

    const navLang = (navigator && (navigator.language || navigator.userLanguage)) || 'ja';
    return normalizeLang(navLang);
  }

  // Expose
  window.getPreferredLang = getPreferredLang;

  /* ----------------------------------------------------------
     1) I18N: UI strings
     ----------------------------------------------------------
     Notes:
       - All keys preserved from your original mapping.
       - Functions like contactThanks(name) kept as-is.
       - No keys removed; some comments added for clarity.
  -----------------------------------------------------------*/
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
      'hero.lead': '多国籍な環境と、日本語を活かせる仕事。就労ビザ／移住サポートで海外就職も安心。',
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

      // Priority
      'priority.title': '優先メニュー',
      'priority.sub': 'よく見る項目をすぐに開けます',
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
      'sec.contact.t': 'お問い合わせ',
      'sec.contact.d': 'ご質問・面談予約',

      // Ask ChatGPT
      'chatgpt.title': 'Ask ChatGPT（TPについて質問）',
      'chatgpt.sub': '下のプロンプトをコピーして、ChatGPTに貼り付けてください。',
      'chatgpt.copy': 'プロンプトをコピー',
      'chatgpt.open': 'ChatGPT を開く',
      'chatgpt.note': '※ WebView が使えない場合の代替。言語を切り替えるとプロンプトも切り替わります。',

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
      'hero.lead': 'Multinational teams and Japanese-language roles. With visa & relocation support, getting started overseas is smooth.',
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
      'sec.contact.t': 'Contact',
      'sec.contact.d': 'Questions & interviews',

      // Ask ChatGPT
      'chatgpt.title': 'Ask ChatGPT (About TP)',
      'chatgpt.sub': 'Copy the prompt below and paste it into ChatGPT.',
      'chatgpt.copy': 'Copy Prompt',
      'chatgpt.open': 'Open ChatGPT',
      'chatgpt.note': 'If WebView is unavailable, use this. Switching languages updates the prompt.',

      // Footer
      'footer.about': 'About',
      'footer.privacy': 'Privacy',
      'footer.contact': 'Contact',
      'bar.faq': 'FAQ',

      // Misc / Contact
      contactThanks: (name) => `Thanks, ${name}! We received your message.`
    },

    ko: {
      // Brand & Nav
      'brand.title': 'TP',
      'brand.sub': 'Malaysia · Thailand — 일본어 채용',
      'nav.about': '회사 소개',
      'nav.jobs': '채용 정보・복리후생',
      'nav.relocation': '이주・비자',
      'nav.why': '말레이시아・태국의 매력',
      'nav.faq': 'FAQ',
      'cta.apply': '지원하기',
      'cta.viewJobs': '채용 정보 보기',
      'cta.relocation': '이주 지원',

      // Drawer
      'drawer.about': '회사 소개',
      'drawer.jobs': '채용 정보・급여/복리후생',
      'drawer.relocation': '이주・비자',
      'drawer.process': '면접 과정',
      'drawer.why': '말레이시아・태국의 매력',
      'drawer.casual': '캐주얼 면담',
      'drawer.testimonials': '직원 후기',
      'drawer.office': '근무 환경',
      'drawer.career': '커리어・어학',
      'drawer.faq': 'FAQ',

      // Hero
      'hero.eyebrow': '생활하듯, 해외에서 일하기.',
      'hero.leading': '당신의 새로운 커리어 무대:',
      'hero.lead': '다국적 환경과 일본어를 활용할 수 있는 일자리. 취업 비자/이주 지원으로 해외 취업도 안심.',
      heroTexts: [
        '말레이시아・태국이라는 선택.',
        '글로벌 커리어.',
        '안심 이주 지원.'
      ],

      // Stats
      'stat.countries': '거점국',
      'stat.people': '직원',
      'stat.jp_roles': '일본어 포지션',
      'stat.jp_roles_n': '다수',

      // Priority
      'priority.title': '우선 메뉴',
      'priority.sub': '자주 보는 항목을 바로 열 수 있습니다',
      'priority.gallery.title': '우선 메뉴 (보기 쉬운 갤러리)',
      'priority.gallery.sub': '9개 주요 주제를 타일로 표시',

      // Priority icon captions
      'prio.about.t': 'About TP',
      'prio.about.d': '텔레퍼포먼스란',
      'prio.jobs.t': '채용 정보 보기',
      'prio.jobs.d': '급여・복리후생',
      'prio.relo.t': '이주・비자 지원',
      'prio.relo.d': 'EP 신청・항공편・초기 숙박',
      'prio.process.t': '면접 과정',
      'prio.process.d': '온라인으로 완결',
      'prio.why.t': '말레이시아・태국의 매력',
      'prio.why.d': '생활・문화・여행 허브',
      'prio.casual.t': '캐주얼 면담',
      'prio.casual.d': '먼저 편하게 상담',
      'prio.testimonials.t': '직원 후기',
      'prio.testimonials.d': '체험담・인터뷰',
      'prio.office.t': '근무 환경',
      'prio.office.d': '오피스 & 가상 투어',
      'prio.career.t': '커리어 패스・승진',
      'prio.career.d': '어학/연수 (GoFluent 등)',

      // Secondary
      'secondary.title': '서브 메뉴',
      'secondary.sub': '생활 정보・문화・지원',
      'sec.cost.t': '생활비',
      'sec.cost.d': '식사・교통・주거',
      'sec.team.t': '채용팀 소개',
      'sec.team.d': 'Meet the TA Team',
      'sec.area.t': '주변 환경',
      'sec.area.d': '오피스 주변 편의 정보',
      'sec.blog.t': '블로그・칼럼',
      'sec.blog.d': '유용한 읽을거리',
      'sec.line.t': 'LINE 공식 계정',
      'sec.line.d': '최신 정보 받기',
      'sec.culture.t': '이벤트・문화',
      'sec.culture.d': '사내 커뮤니티',
      'sec.faq.t': 'FAQ・자주 묻는 질문',
      'sec.faq.d': '지원・생활・비자',
      'sec.contact.t': '문의하기',
      'sec.contact.d': '질문・면담 예약',

      // Ask ChatGPT
      'chatgpt.title': 'Ask ChatGPT (TP에 대해 질문)',
      'chatgpt.sub': '아래 프롬프트를 복사해서 ChatGPT에 붙여넣어 주세요.',
      'chatgpt.copy': '프롬프트 복사',
      'chatgpt.open': 'ChatGPT 열기',
      'chatgpt.note': '※ WebView를 사용할 수 없는 경우의 대체. 언어를 바꾸면 프롬프트도 바뀝니다.',

      // Footer
      'footer.about': '회사 소개',
      'footer.privacy': '개인정보',
      'footer.contact': '문의하기',
      'bar.faq': 'FAQ',

      // Misc / Contact
      contactThanks: (name) => `${name} 님, 감사합니다! 메시지를 받았습니다.`
    }
  };

  // Expose I18N
  window.I18N = I18N;

  /* ----------------------------------------------------------
     2) Content data (rendered by app.js)
     ----------------------------------------------------------
     Structure:
       CONTENT.links
       CONTENT.ja / CONTENT.en / CONTENT.ko:
         - why1, why2, cities, benefits, processSteps, offices, team,
           voices, faq, galleryImgs
     All preserved; harmless extra images are allowed (renderer loops).
  -----------------------------------------------------------*/
  const CONTENT = {
    links: {
      apply: 'https://careerseng-teleperformance.icims.com/jobs/49026/customer-service-representative---japanese-speaking-%28kl%29/job?mode=job&iis=LANDINGPAGE',
      casual: 'https://forms.office.com/e/2UvpbweQww'
    },

    // ---------------------- Japanese content ----------------------
    ja: {
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
      cities: [
        {
          id: 'kl',
          title: 'クアラルンプール（KL）',
          img: 'https://images.unsplash.com/photo-1507908708918-778587c9e563?q=80&w=1200&auto=format&fit=crop',
          desc: '都市の利便性 × 多文化の共存。日本食・病院・学校・交通網も充実で安心。'
        },
        {
          id: 'penang',
          title: 'ペナン（Penang）',
          img: 'https://images.unsplash.com/photo-1597200381847-3d1e2415dfcf?q=80&w=1200&auto=format&fit=crop',
          desc: '自然と歴史が息づく島ライフ。海の見える高層コンド、落ち着いた治安。'
        },
        {
          id: 'bkk',
          title: 'バンコク（Bangkok）',
          img: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=1200&auto=format&fit=crop',
          desc: '"東南アジアの東京"。日系施設が超充実、BTS/MRTで移動快適。'
        }
      ],
      benefits: [
        { t: '就労ビザサポート', d: 'EP申請を会社が代行（会社負担）。' },
        { t: '渡航・宿泊サポート', d: '片道航空券、6泊7日ホテル、空港送迎。' },
        { t: '給与・手当', d: '夜勤/住宅/時間外手当（プロジェクトによる）。' },
        { t: '医療と保険', d: '医療・歯科・眼科補助、団体保険。' },
        { t: 'キャリア支援', d: '社内異動／JUMPプログラム。' },
        { t: '語学', d: 'GoFluentやLanguage Bootcamp。' }
      ],
      processSteps: [
        { k: '① 書類選考', v: '履歴書・職歴（日本語/英語）' },
        { k: '② オンラインテスト', v: '語学・業務適性（必要に応じて）' },
        { k: '③ 一次面接', v: '採用チームとオンライン' },
        { k: '④ 二次面接', v: '配属チームの面接' },
        { k: '⑤ オファー → ビザ', v: '条件確認、EP申請、渡航・初期宿泊' }
      ],
      offices: [
        {
          title: 'G Tower（KL）',
          img: 'https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?q=80&w=1200&auto=format&fit=crop',
          points: ['Ampang Park駅直結（MRT/LRT）', 'KLCC/Intermarkが徒歩圏', 'Grade Aオフィス']
        },
        {
          title: 'Penang — Livingston',
          img: 'https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1200&auto=format&fit=crop',
          points: ['静かな環境', '周辺に飲食店・薬局', '通勤アクセス良好']
        },
        {
          title: 'Penang — One Precinct',
          img: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1200&auto=format&fit=crop',
          points: ['Bayan Baruのモダンビル', '空港から約15分', 'Queensbay Mall近く']
        },
        {
          title: 'Penang — GBS@Mahsuri',
          img: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=1200&auto=format&fit=crop',
          points: ['州のGBSハブ中心', 'IT/BPO企業が集積', '生活インフラが徒歩圏']
        }
      ],
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
      voices: [
        { quote: '「違っていい」という価値観が、心を自由にしてくれました。', who: '採用チーム Maho' },
        { quote: '週末に海外旅行が現実的。ハブ空港の強みを感じます。', who: '社員 Aさん（KL）' },
        { quote: '英語は自然と伸びます。毎日がプチ留学みたい。', who: '社員 Bさん（Penang）' }
      ],
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
      galleryImgs: [
        'https://images.unsplash.com/photo-1563298723-dcfebaa392e3?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1517816743773-6e0fd518b4a6?q=80&w=800&auto=format&fit=crop'
      ]
    },

    // ---------------------- English content ----------------------
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
          img: 'https://images.unsplash.com/photo-1507908708918-778587c9e563?q=80&w=1200&auto=format&fit=crop',
          desc: 'Big-city convenience & multicultural life. JP food, hospitals, schools, and transit.'
        },
        {
          id: 'penang',
          title: 'Penang',
          img: 'https://images.unsplash.com/photo-1597200381847-3d1e2415dfcf?q=80&w=1200&auto=format&fit=crop',
          desc: 'Island lifestyle with history, sea views, and calmer pace.'
        },
        {
          id: 'bkk',
          title: 'Bangkok',
          img: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=1200&auto=format&fit=crop',
          desc: '"Tokyo of SEA" — extensive JP amenities and modern transit.'
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
          img: 'https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?q=80&w=1200&auto=format&fit=crop',
          points: ['Ampang Park (MRT/LRT)', 'KLCC/Intermark walkable', 'Grade A office']
        },
        {
          title: 'Penang — Livingston',
          img: 'https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1200&auto=format&fit=crop',
          points: ['Calm area', 'Food/pharmacy nearby', 'Easy commute']
        },
        {
          title: 'Penang — One Precinct',
          img: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1200&auto=format&fit=crop',
          points: ['Modern building', '15 min from airport', 'Near Queensbay Mall']
        },
        {
          title: 'Penang — GBS@Mahsuri',
          img: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=1200&auto=format&fit=crop',
          points: ['GBS hub', 'IT/BPO cluster', 'Walkable amenities']
        }
      ],
      team: [
        {
          name: 'Maho',
          role: 'TA | Japan Market',
          img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop',
          bio: 'We\'ll support you end-to-end in JP.'
        },
        {
          name: 'Kenta',
          role: 'Recruiter',
          img: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=800&auto=format&fit=crop',
          bio: 'Let\'s find your best-fit project.'
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
        { quote: 'Feeling "it\'s okay to be different" freed me at work.', who: 'TA Team — Maho' },
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
    },

    // ---------------------- Korean content ----------------------
    ko: {
      why1: [
        { t: '🌍 글로벌 환경에서 레벨업', d: '영어・이문화 이해가 일상에서 단련되는 국제 팀.' },
        { t: '🗣️ 일본어 포지션이 풍부', d: '영어에 불안이 있어도 일본어 중심으로 안심 스타트.' },
        { t: '👥 일본인 지원의 안심감', d: '생활도 일도 일본어로 상담할 수 있는 체제.' }
      ],
      why2: [
        { t: '💼 실력에 따라 조기 승진도', d: '트레이너/QA/리더/매니저까지 다채로운 커리어.' },
        { t: '✈️ 비자・항공・숙박 지원', d: 'EP 신청 대행, 편도 항공권, 초기 호텔, 공항 픽업.' },
        { t: '🌈 다양성이 베이스인 문화', d: '국적・성별・연령을 넘어 플랫하게 일할 수 있다.' }
      ],
      cities: [
        {
          id: 'kl',
          title: '쿠알라룸푸르（KL）',
          img: 'https://images.unsplash.com/photo-1507908708918-778587c9e563?q=80&w=1200&auto=format&fit=crop',
          desc: '도시의 편리함 × 다문화 공존. 일본 음식・병원・학교・교통망도 충실해서 안심.'
        },
        {
          id: 'penang',
          title: '페낭（Penang）',
          img: 'https://images.unsplash.com/photo-1597200381847-3d1e2415dfcf?q=80&w=1200&auto=format&fit=crop',
          desc: '자연과 역사가 살아 숨쉬는 섬 라이프. 바다가 보이는 고층 콘도, 안정된 치안.'
        },
        {
          id: 'bkk',
          title: '방콕（Bangkok）',
          img: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=1200&auto=format&fit=crop',
          desc: '"동남아시아의 도쿄". 일계 시설이 초충실, BTS/MRT로 이동 쾌적.'
        }
      ],
      benefits: [
        { t: '취업 비자 지원', d: 'EP 신청을 회사가 대행（회사 부담）.' },
        { t: '항공・숙박 지원', d: '편도 항공권, 6박7일 호텔, 공항 픽업.' },
        { t: '급여・수당', d: '야근/주택/시간외 수당（프로젝트에 따라）.' },
        { t: '의료와 보험', d: '의료・치과・안과 보조, 단체 보험.' },
        { t: '커리어 지원', d: '사내 이동／JUMP 프로그램.' },
        { t: '어학', d: 'GoFluent나 Language Bootcamp.' }
      ],
      processSteps: [
        { k: '① 서류 심사', v: '이력서・경력（일본어/영어）' },
        { k: '② 온라인 테스트', v: '어학・업무 적성（필요에 따라）' },
        { k: '③ 1차 면접', v: '채용팀과 온라인' },
        { k: '④ 2차 면접', v: '배치팀 면접' },
        { k: '⑤ 오퍼 → 비자', v: '조건 확인, EP 신청, 항공・초기 숙박' }
      ],
      offices: [
        {
          title: 'G Tower（KL）',
          img: 'https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?q=80&w=1200&auto=format&fit=crop',
          points: ['Ampang Park역 직결（MRT/LRT）', 'KLCC/Intermark가 도보권', 'Grade A 오피스']
        },
        {
          title: 'Penang — Livingston',
          img: 'https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1200&auto=format&fit=crop',
          points: ['조용한 환경', '주변에 음식점・약국', '통근 액세스 양호']
        },
        {
          title: 'Penang — One Precinct',
          img: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1200&auto=format&fit=crop',
          points: ['Bayan Baru의 모던 빌딩', '공항에서 약 15분', 'Queensbay Mall 근처']
        },
        {
          title: 'Penang — GBS@Mahsuri',
          img: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=1200&auto=format&fit=crop',
          points: ['주의 GBS 허브 중심', 'IT/BPO 기업이 집적', '생활 인프라가 도보권']
        }
      ],
      team: [
        {
          name: 'Maho',
          role: 'TA | Japan Market',
          img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop',
          bio: '처음의 해외 취업도, 일본어로 동행합니다.'
        },
        {
          name: 'Kenta',
          role: 'Recruiter',
          img: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=800&auto=format&fit=crop',
          bio: '커리어 상담, 편하게 연락주세요.'
        },
        {
          name: 'Aya',
          role: 'Coordinator',
          img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop',
          bio: '항공 수속이나 현지 생활도 팔로우합니다.'
        },
        {
          name: 'Leo',
          role: 'Sourcer',
          img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop',
          bio: '희망하는 프로젝트를 함께 찾습니다.'
        }
      ],
      voices: [
        { quote: '「달라도 괜찮다」는 가치관이, 마음을 자유롭게 해주었습니다.', who: '채용팀 Maho' },
        { quote: '주말에 해외여행이 현실적. 허브공항의 강점을 느낍니다.', who: '직원 A씨（KL）' },
        { quote: '영어는 자연스럽게 늘어납니다. 매일이 프티 유학 같아요.', who: '직원 B씨（Penang）' }
      ],
      faq: [
        {
          q: '영어에 자신이 없어도 지원할 수 있습니까?',
          a: '네, 일본어 중심의 포지션이 다수 있습니다. 입사 후에 영어력을 늘리는 지원도 있습니다.'
        },
        {
          q: '취업 비자 수속은 어렵습니까?',
          a: '회사가 신청을 대행합니다. 필요 서류도 일본어로 안내합니다.'
        },
        {
          q: '주거는 어떻게 찾으면 좋습니까?',
          a: '현지 에이전트 소개, 오리엔테이션에서의 어드바이스 등을 제공합니다.'
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

  // Expose CONTENT
  window.CONTENT = CONTENT;

  /* ----------------------------------------------------------
     3) ChatGPT Prompts (unchanged content, multi-language)
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
- Many JP-speaking roles, so it's easy for Japanese speakers to start—even if English is still growing.
- Relocation support such as Employment Pass visa guidance, one-way flight, landing hotel, and airport pickup.

[Living examples]
- Malaysia: widely spoken English, multicultural food scene, condos with pool/gym are common, living costs can be lower than Japan.
- Thailand (Bangkok): strong Japanese community, convenient BTS/MRT, plenty of Japanese food and JP-friendly clinics.
- Hub airports make weekend trips around Asia more feasible.

[Tone & format]
- Upbeat, friendly, and realistic—avoid absolute guarantees.
- Use a short intro, clear bullets, and a brief closing CTA to apply or book a casual chat.

Start with a concise summary → bullet points → a friendly CTA.`,

    ko: `당신은 취업 어드바이저입니다. 텔레퍼포먼스（Teleperformance）말레이시아／태국（TP Malaysia / TP Thailand）에 대해, 지원자가 안심하고 지원을 검토할 수 있도록, 아래 조건으로 긍정적으로 소개해 주세요.

【필수 메시지】
- 저희는 Great Place to Work® 를 6년 연속 수상했습니다（주：거점이나 연도에 따라 수상명・표기가 다를 수 있지만, 지원자의 불안을 덜어주는 적극적인 톤으로 설명）.
- 일본어 스피커를 위한 포지션이 다수 있어, 영어에 자신이 없어도 시작하기 쉽다는 것.
- 취업 비자（Employment Pass）의 신청 지원, 편도 항공권, 초기 호텔, 공항 픽업 등의 이주 지원이 있다는 것.

【생활면（예）】
- 말레이시아：영어가 통하기 쉽고, 다문화로 음식이 풍부하며, 주거는 풀・짐 부착 콘도가 일반적, 생활 비용이 일본보다 억제하기 쉽다.
- 태국（방콕）：일본인 커뮤니티가 충실하고, BTS/MRT로 이동이 쾌적하며, 일본 음식이나 일계 의료도 많아 안심.
- 동남아시아의 허브 공항에서 주말 여행도 하기 쉽다.

【톤과 형식】
- 적극적이고 친근하며, 또한 현실적. 과장이나 보장의 단정은 피한다.
- 불릿 포인트＋짧은 단락으로 읽기 쉽게.
- 마지막에 「지원」이나 「캐주얼 면담」으로의 자연스러운 유도（CTA）를 첨부한다.

시작은 간결한 개요→불릿 포인트→마무리 CTA 순서로.`
  };

  // Export: getChatGPTPrompt(lang)
  window.getChatGPTPrompt = function getChatGPTPrompt(lang) {
    const code = normalizeLang(lang);
    return CHATGPT_PROMPTS[code] || CHATGPT_PROMPTS.ja;
  };

  /* ----------------------------------------------------------
     4) DOM initialization for "Ask ChatGPT" UI
        - Initializes textarea with prompt for the resolved language
        - Wires copy & open buttons if present
        - Defensive: runs only when nodes exist
  -----------------------------------------------------------*/
  document.addEventListener('DOMContentLoaded', () => {
    // Choose language using our best-guess function
    const resolved = getPreferredLang();

    // 4.1) Initialize Ask ChatGPT textarea
    const ta = document.getElementById('chatgptPrompt');
    if (ta) {
      ta.value = window.getChatGPTPrompt(resolved);
    }

    // 4.2) Copy button UX (+fallback)
    const copyBtn = document.getElementById('copyPromptBtn');
    if (copyBtn && ta) {
      copyBtn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(ta.value);
          const original = copyBtn.textContent;
          const copiedText =
            resolved === 'ja' ? 'コピーしました！' :
            resolved === 'ko' ? '복사했습니다!' : 'Copied!';
          copyBtn.textContent = copiedText;
          setTimeout(() => (copyBtn.textContent = original), 1400);
        } catch (_err) {
          // Fallback for http / older browsers
          try {
            ta.select();
            document.execCommand('copy');
          } catch (_ignored) {
            // No-op as absolute fallback
          }
        }
      });
    }

    // 4.3) Open ChatGPT button (optional)
    const openBtn = document.getElementById('openChatGPTBtn');
    if (openBtn) {
      openBtn.addEventListener('click', () => {
        // Keep simple & robust (avoid window features that some browsers block)
        window.open('https://chat.openai.com/', '_blank', 'noopener,noreferrer');
      });
    }

    // 4.4) Ensure <html> carries the normalized language (non-destructive)
    try {
      const root = document.documentElement;
      root.setAttribute('data-lang', resolved);
      root.setAttribute('lang', resolved);
    } catch (_ignored) {}
  });

})();
