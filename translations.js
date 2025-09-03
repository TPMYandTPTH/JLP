/* ============================================================================
   TP Candidate Microsite — translations.js (JAPANESE ONLY • FULL)
   Purpose: Centralized copy deck + structured content (JP only)
   Source of truth: User-provided slide spec “Microsite Execution File – Japan”
   Updated: 2025-09-03
   Notes:
     - No EN / KR bundles to keep payload light (as requested).
     - All new sections from slides are included (Intro, Travel Hub, Cost table,
       Accommodation features, Activities, City deep dives, Team long bio, etc.)
     - External links normalized; VR tour URL encoded for apostrophes.
============================================================================ */

(function () {
  /* ------------------------------------------------------------------------
     1) I18N — UI strings, headings, CTAs (JP only)
  -------------------------------------------------------------------------*/
  const I18N = {
    jp: {
      // Brand & Header
      'brand.title': 'TP',
      'brand.sub': 'Malaysia · Thailand — 日本語採用',
      'nav.about': '会社紹介',
      'nav.intro': '概要 / GPTW',
      'nav.jobs': '求人・福利厚生',
      'nav.relocation': '移住・ビザ',
      'nav.why': 'マレーシア・タイの魅力',
      'nav.cities': '勤務先都市',
      'nav.cost': '生活コスト',
      'nav.accommodation': '住まい',
      'nav.activities': 'アクティブライフ',
      'nav.process': '面接プロセス',
      'nav.vtour': 'バーチャルツアー',
      'nav.faq': 'FAQ',
      'nav.contact': 'お問い合わせ',
      'nav.casual': 'カジュアル面談',
      'nav.team': '採用チーム',
      'nav.office': '働く環境',
      'nav.career': 'キャリア・語学',
      'nav.testimonials': '社員の声',

      // Drawer (mobile navigation)
      'drawer.about': '会社紹介',
      'drawer.intro': '概要 / GPTW',
      'drawer.jobs': '求人・給与/福利厚生',
      'drawer.relocation': '移住・ビザ',
      'drawer.process': '面接プロセス',
      'drawer.why': 'マレーシア・タイの魅力',
      'drawer.cities': '勤務先都市',
      'drawer.cost': '生活コスト',
      'drawer.accommodation': '住まい',
      'drawer.activities': 'アクティブライフ',
      'drawer.casual': 'カジュアル面談',
      'drawer.testimonials': '社員の声',
      'drawer.office': '働く環境',
      'drawer.career': 'キャリア・語学',
      'drawer.team': '採用チーム',
      'drawer.faq': 'FAQ',

      // Hero
      'hero.eyebrow': '暮らすように、海外で働く。',
      'hero.leading': 'あなたの新しいキャリアの舞台に、',
      'hero.lead': 'マレーシア・タイという選択。多国籍な仲間と、一歩踏み出す。',
      'hero.lead_long':
        'あなたの新しいキャリアの舞台に、マレーシアという選択を。多国籍な環境と、日本語を活かせる仕事。コストを抑えた快適な暮らし。そんな“ちょうどいい”海外生活、マレーシアで始めませんか？',
      heroTexts: [
        'マレーシア・タイという選択。',
        'グローバルなキャリア。',
        '安心の移住サポート。',
      ],

      // Stats
      'stat.countries': '拠点国',
      'stat.people': '従業員',
      'stat.jp_roles': '日本語ポジション',
      'stat.jp_roles_n': '多数',

      // Priority Icons (expanded to match Slide 1)
      'priority.title': 'TPが選ばれる理由',
      'priority.sub': 'グローバルな環境、日本語ポジション多数、手厚い移住サポート',
      'priority.gallery.title': '優先メニュー',
      'priority.gallery.sub': '主要トピック',
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
      'prio.office.d': 'オフィス&バーチャル',
      'prio.career.t': 'キャリア・語学',
      'prio.career.d': 'キャリアパス/研修',
      // Added per spec:
      'prio.vtour.t': 'バーチャルツアー',
      'prio.vtour.d': '現地オフィスをオンライン体験',
      'prio.cgrowth.t': 'キャリアパス・昇進',
      'prio.cgrowth.d': '評価・異動・JUMP',
      'prio.lang.t': '言語プログラム',
      'prio.lang.d': 'GoFluent/Bootcamp',

      // Secondary Icons (Slide 2 incl. External RAF)
      'secondary.title': '生活情報・カルチャー・サポート',
      'secondary.sub': '暮らしに役立つ情報',
      'sec.cost.t': '生活コスト',
      'sec.cost.d': '食事・交通・住まい',
      'sec.team.t': '採用チーム',
      'sec.team.d': '採用チームの紹介',
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
      'sec.raf.t': 'リファラル（友達紹介）',
      'sec.raf.d': '外部フォームから紹介',

      // Benefits
      'benefits.title': '福利厚生ハイライト',
      'benefits.sub': '“安心・成長・楽しさ”を全方位でサポート',

      // ChatGPT
      'chatgpt.title': 'Ask ChatGPT（TPについて質問）',
      'chatgpt.sub':
        '下のプロンプトをコピーして、ChatGPTに貼り付けてください。',
      'chatgpt.copy': 'プロンプトをコピー',
      'chatgpt.open': 'ChatGPT を開く',
      'chatgpt.note': '※ AIアシスタントに相談できます。',

      // Footer
      'footer.about': '会社紹介',
      'footer.privacy': 'プライバシー',
      'footer.contact': 'お問い合わせ',
      'bar.faq': 'FAQ',

      // CTAs
      'cta.apply': 'ご応募はこちら',
      'cta.viewJobs': '求人を見る',
      'cta.relocation': '移住サポート',
      'cta.casual': 'カジュアル面談',
      'cta.learnMore': 'さらに見る',
      'cta.open': '開く',
      'cta.copy': 'コピー',
      'cta.contact': '問い合わせ',

      // Form fields
      'form.name.placeholder': '山田 太郎',
      'form.email.placeholder': 'you@example.com',
      'form.message.placeholder':
        '気になる求人、移住、英語レベル、入社時期など',
      'form.name.label': 'お名前',
      'form.email.label': 'メールアドレス',
      'form.message.label': 'ご相談内容',
      'form.submit': '送信',

      // Contact thank you
      contactThanks: (name) =>
        `${name || '応募者'} さん、ありがとうございます！メッセージを受け取りました。`,
    },
  };

  /* ------------------------------------------------------------------------
     2) CONTENT — Structured data for sections (JP only)
  -------------------------------------------------------------------------*/
  const CONTENT = {
    // External links (canonicals). Keep one apply link everywhere.
    links: {
      apply:
        'https://careerseng-teleperformance.icims.com/jobs/49026/customer-service-representative---japanese-speaking-%28kl%29/job?mode=job&iis=LANDINGPAGE',
      casual: 'https://forms.office.com/e/2UvpbweQww',
      line: 'https://line.me/R/ti/p/@286nmdsd?from=page&searchId=286nmdsd',
      raf: '#', // 外部RAFフォームが確定次第差し替え
      youtube1: 'https://www.youtube.com/watch?v=I0Uz5WbulNE&t=14s',
      youtube2: 'https://www.youtube.com/watch?v=aPahVrsApXY&t=8s',
      vtour: 'https://vtour.cloud/mh2n0j/ae5772z1/Bella%27s', // apostrophe encoded
    },

    // Intro / Overview (Slide 5)
    intro: {
      title:
        'TPマレーシア、タイ求人情報サイトへようこそ – あなたの次のキャリアがここから始まります！',
      body_long:
        'TPは1978年にフランス パリにて設立されたBPO（ビジネスプロセスアウトソーシング）企業です。TP（テレパフォーマンス）は、世界100カ国以上・50万人以上の従業員を擁する、グローバルなビジネスサービスのリーダー企業です。最先端のテクノロジーと優れた人材を融合し、世界中の有名ブランドに最高のカスタマーエクスペリエンスを提供しています。現在、日本語スピーカーを対象に、タイおよびマレーシアにて積極的な採用を行っております。新卒の方から経験豊富なプロフェッショナルまで、皆さまの語学力と個性が活かせる、多文化で働きやすい職場をご用意しています。マレーシアとタイを合わせて日本人スタッフが多数が在籍し、現在も増加中です。弊社はマレーシアにおいて日本スピーカーを最も多く雇用している企業のひとつであり、海外拠点としても最大規模を誇ります。',
      gptw:
        'Great Place to Work® 認証：働きやすさと多様性が評価されています。',
      videos: [
        'https://www.youtube.com/watch?v=I0Uz5WbulNE&t=14s',
        'https://www.youtube.com/watch?v=aPahVrsApXY&t=8s',
      ],
      mapImg: 'assets/map/tp-offices-world.png', // 画像をアップロードしてください
      // Growth stat for simple chart/badges (From inception → 5000 in Jan 2024 → 7300 in Jun 2025)
      growth: [
        { date: '2024-01', headcount: 5000 },
        { date: '2025-06', headcount: 7300 },
      ],
      languages: ['Japanese', 'English', 'Thai', 'Malay', 'Mandarin'],
      nationalitiesMY: '多国籍（例：35+）',
      nationalitiesTH: '多国籍（例：30+）',
    },

    // Why join TP? (Slides 6–7)
    jp: {
      why1: [
        {
          t: '🌍 グローバルな環境',
          d: '多国籍チームで日英を使いながら働ける。毎日が“プチ留学”。',
        },
        {
          t: '🛠 キャリアの幅',
          d: 'トレーナー/QA/リーダー/マネージャーへと成長可能。',
        },
        {
          t: '🛫 移住サポート',
          d: '就労ビザ、片道航空券、初期ホテル、空港送迎。',
        },
        {
          t: '🗣 バイリンガル歓迎',
          d: '日本語中心の業務からスタートもOK。英語ポジションも豊富。',
        },
        {
          t: '👥 日本人サポート',
          d: '日本人スタッフ在籍。生活も仕事も相談できる体制。',
        },
      ],
      why2: [
        {
          t: '🌈 多様性',
          d: '国籍・年齢・性別を超えてフラットに働ける。',
        },
        {
          t: '✅ こんな方に',
          d: '日本語を活かしたい／多国籍環境で価値観を広げたい／海外生活を楽しみたい。',
        },
        {
          t: '💰 余裕のある暮らし',
          d: '物価が安いから外食・カフェ巡り・趣味を楽しみやすい。',
        },
      ],

      // Cities (Slides 11–13) – card visuals
      cities: [
        {
          id: 'kl',
          title: 'クアラルンプール（KL）',
          img: 'assets/cities/kl.jpg', // 差し替え可（プレースホルダー可）
          desc: '都市の利便性・交通網・日本食・医療。',
        },
        {
          id: 'penang',
          title: 'ペナン（Penang）',
          img: 'assets/cities/penang.jpg',
          desc: '海・落ち着いた治安・高層コンド・空港アクセス。',
        },
        {
          id: 'bkk',
          title: 'バンコク（Bangkok）',
          img: 'assets/cities/bangkok.jpg',
          desc: '“東南アジアの東京”：日本人コミュニティ・日系医療・BTS/MRT。',
        },
      ],

      // Priority benefits snapshot (Slides 35–36)
      benefits: [
        { t: '就労ビザサポート', d: 'EP申請を会社が代行（会社負担）。' },
        { t: '渡航・宿泊サポート', d: '片道航空券、初期ホテル、空港送迎。' },
        { t: '給与・手当', d: '夜勤/住宅/時間外手当（プロジェクトによる）。' },
        { t: '医療と保険', d: '医療・歯科・眼科補助、団体保険。' },
        { t: 'キャリア支援', d: '社内異動／JUMPプログラム。' },
        { t: '語学', d: 'GoFluentやLanguage Bootcamp。' },
      ],

      // Interview Process (Slides 37–38)
      processSteps: [
        { k: '① 書類選考', v: '履歴書・職歴（日本語/英語）' },
        { k: '② オンラインテスト', v: '語学・業務適性（必要に応じて）' },
        { k: '③ 一次面接', v: '採用チームとオンライン' },
        { k: '④ 二次面接', v: '配属チームの面接' },
        { k: '⑤ オファー → ビザ', v: '条件確認、EP申請、渡航・初期宿泊' },
      ],

      // Offices (Slides 28–32)
      offices: [
        {
          title: 'G Tower（KL）',
          img: 'assets/offices/g-tower.jpg',
          points: ['Ampang Park直結（MRT/LRT）', 'KLCC/Intermark徒歩圏', 'Grade Aオフィス'],
        },
        {
          title: 'Penang — Livingston',
          img: 'assets/offices/penang-livingston.jpg',
          points: ['静かな環境', '飲食店・薬局', 'アクセス良好'],
        },
        {
          title: 'Penang — One Precinct',
          img: 'assets/offices/penang-one-precinct.jpg',
          points: ['Bayan Baruのモダンビル', '空港から約15分', 'Queensbay Mall近く'],
        },
        {
          title: 'Penang — GBS@Mahsuri',
          img: 'assets/offices/penang-gbs-mahsuri.jpg',
          points: ['州のGBSハブ', 'IT/BPO集積', '徒歩圏に生活インフラ'],
        },
        {
          title: 'Bangkok — Singha Complex',
          img: 'assets/offices/singha-complex.jpg',
          points: ['BTS/MRT至近', '日本人コミュニティに便利', 'モダンな商業複合'],
        },
      ],

      // Team (faces) – short cards
      team: [
        {
          name: 'Joseph',
          role: 'TA Manager | Recruiter',
          img: 'assets/team/joseph.jpg',
          bio: 'キャリア相談、お気軽にどうぞ。',
        },
        {
          name: 'Maho',
          role: 'TA | Japan Market',
          img: 'assets/team/maho.jpg',
          bio: '初めての海外就職も、日本語で伴走します。',
        },
        {
          name: 'Akito',
          role: 'Recruiter',
          img: 'assets/team/akito.jpg',
          bio: 'キャリア相談、お気軽にどうぞ。',
        },
        {
          name: 'Koyori',
          role: 'Coordinator',
          img: 'assets/team/koyori.jpg',
          bio: '渡航手続きや現地生活もフォローします。',
        },
        {
          name: 'Maya',
          role: 'Sourcer',
          img: 'assets/team/maya.jpg',
          bio: 'ご希望のプロジェクトを一緒に探します。',
        },
      ],

      // Employee Testimonials (Slides 9 & 26)
      voices: [
        { quote: '「違っていい」が当たり前。安心して挑戦できます。', who: '— TA Team（KL）' },
        { quote: '英語は毎日の実践で自然と伸びました。', who: '— JP Member（Penang）' },
        { quote: '週末の海外旅行が現実的。アジアのハブを実感。', who: '— JP Member（Bangkok）' },
        { quote: '日本にいる時より周りの目を気にしなくなった。', who: '— 採用チーム Maho' },
      ],

      // FAQ
      faq: [
        {
          q: '英語に自信がなくても応募できますか？',
          a: 'はい、日本語中心のポジションが多数あります。入社後に英語力を伸ばす支援もあります。',
        },
        {
          q: '就労ビザの手続きは難しいですか？',
          a: '会社が申請を代行します。必要書類も日本語でご案内します。',
        },
        {
          q: '住居はどうやって探せば良いですか？',
          a: '現地エージェントの紹介、オリエンテーションでのアドバイスなどを提供します。',
        },
        {
          q: 'シフト勤務はありますか？',
          a: 'プロジェクトにより24/7サービスの夜勤・週末シフトがありますが、手当が付きます。',
        },
      ],

      // Gallery (placeholder assets ok)
      galleryImgs: [
        'assets/gallery/office-1.jpg',
        'assets/gallery/office-2.jpg',
        'assets/gallery/team.jpg',
        'assets/gallery/event.jpg',
      ],

      // About TP (short) + video
      aboutTP: {
        title: 'About Teleperformance',
        body:
          '世界100カ国以上で事業展開するカスタマーエクスペリエンス企業。日本語スピーカー向けポジションも多数。',
        video: 'https://www.youtube.com/watch?v=aPahVrsApXY&t=8s',
      },

      // Jobs hook
      currentOpenings: {
        title: 'Current Opening',
        positions: ['カスタマーサポート（日本語）', 'ITサポート', '※時期により変動'],
      },

      // Training
      training: {
        jump: { title: 'Training program – JUMP', desc: '社内JUMPプログラムの紹介' },
        gofluent: {
          title: 'GoFluent',
          desc: '英語学習支援：GoFluentの内容・レベル・利用イメージ',
        },
        bootcamp: {
          title: 'Language Bootcamp',
          desc: '期間・内容・参加条件・効果',
        },
      },

      // Why Malaysia (Slides 8–10)
      whyMalaysia: {
        title: 'なぜ今マレーシア',
        summary:
          '英語が通じやすい多文化社会。プール・ジム付きコンドが一般的で、生活コストも抑えやすい。移住初心者にも優しい受け入れ体制。',
        points: [
          '英語が通じやすく多文化',
          '食が豊富（屋台〜日本食まで）',
          '生活コストを抑えやすい',
          '受け入れ体制：移住初心者にもやさしい',
        ],
        photos: [
          'assets/why/condo.jpg',
          'assets/why/food.jpg',
          'assets/why/city.jpg',
        ],
      },

      workLifeBalance: {
        title: '「仕事」も「暮らし」も、無理なく手に入る国',
        desc: 'コンドミニアムのプール/ジム、外食の気軽さ、オフィスアクセス。',
      },

      // Accommodation features (Slides 16, 24, 32, 40)
      accommodation: {
        title: 'マレーシアでの暮らし（クアラルンプール＆ペナン）',
        features: [
          '24時間セキュリティ＆ゲート付き（有人＋カードアクセス）',
          'プール・ジム・サウナ・BBQスペース標準搭載',
          '家具・家電付き（フルファーニッシュ）ですぐ生活開始',
          '駐車場1台分込みの物件も多い、Grab移動も便利',
          '共有ラウンジ、ヨガ、キッズ、コワーキングも',
          'KL：都市機能が充実、通勤アクセス良好、最新型物件多数',
          'Penang：海に近い物件、多くの緑、KLよりやや安い',
        ],
        rent:
          '家賃相場：RM1,500〜2,500（約5〜8万円前後）でプール・ジム付きが当たり前！',
        kl: 'KL：中心部〜近郊、利便性重視のコンドミニアムが豊富。',
        penang: 'Penang：海近く・落ち着いた暮らし、KLよりやや低コスト。',
      },

      // Weekends / Activities (Slides 20, 28, 36, 44)
      activities: {
        title: '仕事だけじゃない。アクティブな週末を',
        daily: ['公園や湖沿いで朝ラン・散歩', 'ジム・ヨガでリフレッシュ'],
        weekendNature: [
          'ビーチでのんびり、スノーケリング・ダイビング',
          '自然保護区や山岳エリアへ日帰り',
        ],
        food: [
          '屋台から高級まで外食が気軽',
          '各国料理が充実、カフェ巡りも楽しい',
        ],
        cityConvenience: [
          'モール・スーパー・映画館が身近',
          'Grabや電車で低コスト移動',
        ],
        travel: ['LCCで週末海外旅行も◎', '近隣諸国へのアクセス抜群'],
      },

      // Travel hubs (Slides 14/22/30/38/46–48 consolidated)
      travelHub: {
        title: '気軽に世界へ ― 海外旅行もすぐそこに',
        bullets: [
          '日本：東京・大阪・福岡への直行便が豊富',
          'アジア：シンガポール・韓国・台湾・ベトナム・インドネシアへ2〜4時間',
          '欧州・中東・豪州へも1本の便でアクセス可',
        ],
      },

      // Cost of Living (Slides 15/23/31/39/49 consolidated)
      costOfLiving: {
        title: '日本よりも“余裕”のある暮らし',
        table: [
          {
            item: '家賃（1LDK）',
            tokyo: '約12万円〜',
            kl: '約5〜6万円（24hセキュリティ・プール・ジム）',
          },
          { item: '外食', tokyo: '1,000円〜', kl: '約300円〜' },
          { item: '交通費', tokyo: '月1万円以上', kl: '数千円以内（Grab移動）' },
        ],
        quotes: [
          '「物価が安いから、カフェ巡りや外食が気軽に楽しめるようになりました。」— 30代・男性',
          '「通勤ストレスがなくなり、平日の夜もヨガや友達との時間をゆったり過ごせます。」— 20代・女性',
          '「毎週末にプール、サウナ、ジム。こんな暮らし、日本では考えられませんでした！」— 30代・女性',
          '「休日は友達とビーチやナイトマーケットへ。仕事も遊びもバランスよく楽しめています！」— 20代・男性',
        ],
      },

      // City deep dives (Slides 11–13)
      citiesDetail: {
        kl: {
          title: 'マレーシア・クアラルンプール（KL）',
          points: [
            'ドン・キホーテ、AEON、伊勢丹、日本食レストランが多数あり',
            '日本語対応の病院やクリニック、日本人学校、日本人会なども充実',
            'Mont Kiara／KLCCは高級コンドが多く、プール・ジム付きで家賃は日本より安価',
            '英語が広く通じ、移動はMRT/モノレール/Grabで快適',
            'KL国際空港から日本・アジア・世界へ直行便が多数',
          ],
        },
        penang: {
          title: 'マレーシア・ペナン（Penang）',
          points: [
            '世界遺産ジョージタウン、歴史と文化の街',
            'ビーチ×都市の融合、物価が安く景観良し',
            '日本語対応の医療や通訳サービス、日本人コミュニティも',
            '海の見える高層コンドが月5万円前後から可能',
            'KL経由・直行便でアジア各地へアクセス良好',
          ],
        },
        bangkok: {
          title: 'タイ・バンコク（Bangkok）',
          points: [
            '“東南アジアの東京”：約8万人の日本人が居住',
            '日本語対応の医療・教育・スーパーが超充実',
            'BTS/MRTで快適移動、家賃は東京の半額程度',
            '親日的で働きやすい、直行便も豊富',
            '日本に近い生活感でアジアの活気を満喫',
          ],
        },
      },

      // Casual Interview (Slides 18/26/34/42)
      casual: {
        title: '💬 カジュアル面談 実施中！',
        bullets: [
          '面接ではありません（不安・疑問解消が目的）',
          'オンライン（Microsoft Teams）で約30分',
          '就業経験不問（未経験OK）',
          '生活費・住居・働き方など日本語で相談可能',
        ],
      },

      // LINE Official
      lineAccount: {
        title: 'LINE公式アカウント',
        desc: '最新情報を受け取る、相談窓口',
        url: 'https://line.me/R/ti/p/@286nmdsd?from=page&searchId=286nmdsd',
        qr: 'assets/line/qr.png', // 任意：QR画像を追加する場合
      },

      // Virtual Office Tour
      vtour: {
        title: 'バーチャルオフィスツアー',
        url: 'https://vtour.cloud/mh2n0j/ae5772z1/Bella%27s',
        note: 'オンラインで現地の職場環境を体感',
      },

      // Team long bio (Joseph) – Slide 21 (full text)
      teamDetail: {
        joseph: {
          long:
            'こんにちは。TP Malaysiaで日本語スピーカーをはじめとした多国籍人材の採用を担当している、シニアマネージャーのジョセフです。これまで約14年にわたり、APAC地域を中心に人材採用の業務に携わってきました。IT、ロジスティクス、半導体、ITインフラなどの業界において、エンジニアやサポート職からマネジメント、Cレベルポジションまで、さまざまなポジションの採用を担当してきました。日本、マレーシア、シンガポール、タイ、韓国、オーストラリア、ニュージーランドなど、複数国をまたぐ採用プロジェクトに関わる中で、各国の文化や候補者の多様な背景に触れてきた経験を活かし、常に「一人ひとりに寄り添う採用」を大切にしています。\n\nプライベートでは、スキューバダイビングとゴルフが趣味です。マレーシアではこれらのアクティビティを非常にリーズナブルに楽しむことができ、生活のクオリティも高いと感じています！\n\n候補者の皆さまへ: 海外での転職は、大きなチャレンジであると同時に、新しい可能性を広げる素晴らしい機会でもあります。初めての環境に不安を感じる方もいらっしゃると思いますが、選考プロセスや現地の生活についても、できる限り分かりやすくご案内し、安心してご応募いただけるよう心がけています。これまでにも多くの日本語話者の方々が、マレーシアやタイで新たなキャリアをスタートされています。皆さまの挑戦が、より良い未来につながる第一歩となるよう、誠実にサポートさせていただきます。ご応募・ご相談を心よりお待ちしております。',
        },
      },
    },
  };

  /* ------------------------------------------------------------------------
     3) ChatGPT Prompt (JP only, per spec)
  -------------------------------------------------------------------------*/
  const CHATGPT_PROMPT_JP = `あなたは就職アドバイザーです。テレパフォーマンス（Teleperformance）マレーシア／タイ（TP Malaysia / TP Thailand）について、候補者が安心して応募を検討できるよう、以下の条件でポジティブに紹介してください。

【必須メッセージ】
- 私たちは Great Place to Work® を6年連続で受賞しています。
- 日本語スピーカー向けのポジションが多数あり、英語に自信がなくてもスタートしやすいこと。
- 就労ビザ（Employment Pass）の申請サポート、片道航空券、初期ホテル、空港送迎などの移住サポートがあること。

【生活面（例）】
- マレーシア：英語が通じやすい、多文化で食が豊か、住居はプール・ジム付きコンドが一般的、生活コストが日本より抑えやすい。
- タイ（バンコク）：日本人コミュニティが充実、BTS/MRTで移動が快適、日本食や日系医療も多く安心。
- 東南アジアのハブ空港から週末旅行もしやすい。

【トーンと形式】
- 前向きでフレンドリー、かつ現実的。誇張や保証の断定は避ける。
- 箇条書き＋短い段落で読みやすく。
- 最後に「応募」や「カジュアル面談」への自然な誘導（CTA）を添える。`;

  /* ------------------------------------------------------------------------
     4) Exports
  -------------------------------------------------------------------------*/
  window.I18N = I18N;
  window.CONTENT = CONTENT;

  // Helper: get ChatGPT prompt (Japanese only now)
  window.getChatGPTPrompt = function getChatGPTPrompt() {
    return CHATGPT_PROMPT_JP;
  };

  /* ------------------------------------------------------------------------
     5) Initialization for Ask ChatGPT & Copy button
  -------------------------------------------------------------------------*/
  document.addEventListener('DOMContentLoaded', () => {
    const ta = document.getElementById('chatgptPrompt');
    if (ta) {
      ta.value = window.getChatGPTPrompt();
    }

    const copyBtn = document.getElementById('copyPromptBtn');
    if (copyBtn && ta) {
      copyBtn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(ta.value);
          const original = copyBtn.textContent;
          copyBtn.textContent = 'コピーしました！';
          setTimeout(() => (copyBtn.textContent = original), 1400);
        } catch (e) {
          // Fallback for older browsers / insecure contexts
          ta.select();
          document.execCommand('copy');
        }
      });
    }
  });
})();
