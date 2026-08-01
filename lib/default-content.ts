// Default content for every public section.
// This is both the render fallback and the seed source.
// Everything here becomes editable from the admin Content Manager.

export const DEFAULT_SECTIONS = [
  {
    key: "hero",
    label: "قسم الهيرو",
    visible: true,
    order: 0,
    data: {
      title: "نوصلو مع البراند ديالك لأكثر من 100 طلبية يومياً",
      subtitle:
        "كنخدمو على النظام كامل: الإعلانات، التتبع، التحسين، والتوسع حتى نوصلو معاك لنتائج مستقرة بأقل تكلفة ممكنة.",
      ctaPrimary: { text: "احجز استشارة الآن", link: "#contact" },
      ctaSecondary: { text: "شوف النتائج", link: "#results" },
      badge: "شريك أداء معتمد للتجارة الإلكترونية",
      imageUrl: "",
      stats: [
        { value: "+100", label: "طلبية يومياً" },
        { value: "4.2x", label: "متوسط ROAS" },
        { value: "-38%", label: "خفض تكلفة الطلبية" },
        { value: "+40", label: "براند اشتغلنا معاه" },
      ],
    },
  },
  {
    key: "problem",
    label: "المشكل والحل",
    visible: true,
    order: 1,
    data: {
      title: "علاش أغلب الإعلانات كتخسر الفلوس؟",
      subtitle: "المشكل ماشي فالمنصة. المشكل فالنظام اللي خدام عليه.",
      problems: [
        {
          icon: "TrendingDown",
          title: "إعلانات بلا تتبع دقيق",
          text: "بلا Pixel و CAPI مضبوطين، الخوارزمية كتخدم عمياء وكتصرف الميزانية على جمهور خاطئ.",
        },
        {
          icon: "Target",
          title: "عرض ضعيف وكريياتيف مكرر",
          text: "الجمهور كيشوف نفس الإعلانات كل يوم. بلا Hook قوي وعرض واضح، CPA كيبقى طالع.",
        },
        {
          icon: "Workflow",
          title: "Funnel كيضيع الزبناء",
          text: "صفحة بطيئة، شراء معقد، بلا Retargeting — كل زيارة ضايعة هي فلوس محروقة.",
        },
      ],
      solutionTitle: "الحل ديالنا: نظام كامل، ماشي غير 'إطلاق إعلانات'",
      solutionText:
        "كنبنيو التتبع من الصفر، كنصلحو العرض والكريياتيف، كنهيكلو الحملات بطريقة علمية، وكنوسعو غير اللي كيربح. النتيجة: طلبيات مستقرة بتكلفة نازلة.",
    },
  },
  {
    key: "services",
    label: "الخدمات",
    visible: true,
    order: 2,
    data: {
      title: "الخدمات اللي كنقدموها",
      subtitle: "كل خدمة عندها هدف واحد: طلبيات أكثر بتكلفة أقل.",
    },
  },
  {
    key: "process",
    label: "كيفاش كنخدمو",
    visible: true,
    order: 3,
    data: {
      title: "كيفاش كنخدمو معاك، خطوة بخطوة",
      steps: [
        { title: "نفهمو المشروع", text: "جلسة تعارف: البراند، المنتج، الأهداف، والتحديات." },
        { title: "تحليل المتجر والجمهور", text: "Audit كامل للمتجر، المنافسين، والجمهور المستهدف." },
        { title: "إعداد التتبع", text: "Pixel + CAPI + GTM + GA4 — كل حدث كيتسجل بدقة." },
        { title: "مراجعة الحسابات الإعلانية", text: "تنظيف الحسابات وإصلاح الأخطاء البنيوية." },
        { title: "بناء الحملات", text: "هيكلة علمية: اختبار، تحجيم، وإعادة استهداف." },
        { title: "اختبار الكريياتيف", text: "Hooks وزوايا متعددة حتى نلقاو الرابح." },
        { title: "تحسين النتائج", text: "قرارات يومية مبنية على الأرقام، ماشي التخمين." },
        { title: "التوسع الذكي", text: "كنوسعو غير اللي مربح، بطريقة كتحافظ على ROAS." },
        { title: "تقارير مستمرة", text: "تقرير واضح كل أسبوع + خطة الأسبوع الجاي." },
      ],
    },
  },
  {
    key: "results",
    label: "النتائج ودراسات الحالة",
    visible: true,
    order: 4,
    data: {
      title: "نتائج حقيقية، ماشي وعود",
      subtitle: "أرقام من حسابات إعلانية كنديروها يومياً.",
    },
  },
  {
    key: "testimonials",
    label: "آراء العملاء",
    visible: true,
    order: 5,
    data: {
      title: "شنو كيقولو العملاء",
      subtitle: "براندات مغربية وخليجية خدمنا معاها.",
    },
  },
  {
    key: "pricing",
    label: "الباقات والأسعار",
    visible: true,
    order: 6,
    data: {
      title: "اختار الباقة اللي كتناسب مرحلتك",
      subtitle: "أسعار واضحة، بلا مفاجآت. كلشي بالدرهم المغربي.",
      note: "الأماكن محدودة — كنخدمو مع عدد صغير من البراندات باش نضمنو الجودة.",
    },
  },
  {
    key: "faq",
    label: "الأسئلة الشائعة",
    visible: true,
    order: 7,
    data: {
      title: "أسئلة كتوصلنا بزاف",
    },
  },
  {
    key: "contact",
    label: "فورم التواصل",
    visible: true,
    order: 8,
    data: {
      title: "واجد تبدا؟ عمر الفورم ونتواصلو معاك اليوم",
      subtitle: "الرد خلال أقل من 24 ساعة. الاستشارة الأولى مجانية.",
      urgency: "كنقبلو 3 براندات جداد فقط كل شهر",
    },
  },
  {
    key: "footer",
    label: "الفوتر",
    visible: true,
    order: 9,
    data: {
      about: "Earn Partner — وكالة أداء متخصصة فالتجارة الإلكترونية. الهدف: طلبيات أكثر، تكلفة أقل، ونمو مستقر.",
      phone: "+212 6 00 00 00 00",
      whatsapp: "+212 6 00 00 00 00",
      email: "contact@earnpartner.ma",
      location: "القنيطرة، المغرب",
      social: {
        instagram: "https://instagram.com/earnpartner",
        facebook: "https://facebook.com/earnpartner",
        tiktok: "https://tiktok.com/@earnpartner",
        linkedin: "",
      },
    },
  },
];

export const DEFAULT_SERVICES = [
  { icon: "Facebook", title: "إدارة إعلانات فيسبوك", description: "هيكلة، اختبار، وتحجيم حملات Meta بنظام مجرب.", metric: "ROAS يصل 5x", order: 0 },
  { icon: "Music2", title: "إدارة إعلانات تيك توك", description: "كريياتيف native وسرعة اختبار عالية على TikTok Ads.", metric: "CPA أقل بـ 35%", order: 1 },
  { icon: "Youtube", title: "استراتيجية يوتيوب", description: "حملات فيديو للوعي وإعادة الاستهداف على YouTube.", metric: "", order: 2 },
  { icon: "Radar", title: "تركيب البيكسل والتتبع", description: "Pixel + CAPI + GTM + GA4 بدقة 95%+ فالأحداث.", metric: "", order: 3 },
  { icon: "LayoutGrid", title: "هيكلة الحملات", description: "بنية علمية: TOF / MOF / BOF مع ميزانيات محسوبة.", metric: "", order: 4 },
  { icon: "Funnel", title: "تحسين الـ Funnel", description: "صفحات هبوط وتجربة شراء كترفع معدل التحويل.", metric: "+CVR 40%", order: 5 },
  { icon: "RefreshCcw", title: "إعادة الاستهداف", description: "استرجاع الزوار والسلات المهجورة بأقل تكلفة.", metric: "", order: 6 },
  { icon: "TrendingUp", title: "التوسع (Scaling)", description: "تحجيم عمودي وأفقي بلا ما يطيح الأداء.", metric: "", order: 7 },
  { icon: "Sparkles", title: "استراتيجية الكريياتيف", description: "Hooks وزوايا UGC مبنية على تحليل الجمهور.", metric: "", order: 8 },
  { icon: "FileBarChart", title: "تقارير أسبوعية", description: "أرقام واضحة + قرارات الأسبوع الجاي.", metric: "", order: 9 },
];

export const DEFAULT_PRICING = [
  {
    title: "Starter",
    priceMad: 3500,
    period: "شهرياً",
    products: "حتى 2 منتجات",
    features: ["إدارة منصة إعلانية واحدة", "تركيب Pixel وتتبع كامل", "3 كريياتيف شهرياً", "تقرير أسبوعي", "دعم واتساب"],
    ctaText: "ابدأ الآن",
    highlighted: false,
    badge: null,
    order: 0,
  },
  {
    title: "Growth",
    priceMad: 6500,
    period: "شهرياً",
    products: "حتى 5 منتجات",
    features: ["إدارة منصتين (Meta + TikTok)", "Pixel + CAPI + GA4", "8 كريياتيف شهرياً", "تحسين صفحات الهبوط", "إعادة استهداف كاملة", "تقرير أسبوعي + اجتماع شهري"],
    ctaText: "الأكثر طلباً — ابدأ",
    highlighted: true,
    badge: "الأفضل قيمة",
    order: 1,
  },
  {
    title: "Scale",
    priceMad: 12000,
    period: "شهرياً",
    products: "منتجات غير محدودة",
    features: ["كل منصات الإعلان", "فريق مخصص للحساب", "كريياتيف غير محدود", "استراتيجية توسع متعددة الدول", "اجتماع أسبوعي", "أولوية دعم 24/7"],
    ctaText: "احجز مكالمة",
    highlighted: false,
    badge: null,
    order: 2,
  },
];

export const DEFAULT_FAQ = [
  { question: "شحال من وقت باش نشوف النتائج؟", answer: "أول أسبوعين كيكونو للتتبع والاختبار. غالباً النتائج المستقرة كتبان بين الأسبوع 3 و 6 حسب المنتج والميزانية.", order: 0 },
  { question: "شنو الميزانية الإعلانية اللي خاصني؟", answer: "كننصحو تبدا بـ 200-300 درهم يومياً على الأقل باش الخوارزمية تلقى داتا كافية. الميزانية المثالية كنحددوها فالاستشارة.", order: 1 },
  { question: "على أي منصات كتخدمو؟", answer: "Meta (فيسبوك وإنستغرام)، TikTok، Google/YouTube. كنختارو المنصة حسب المنتج والجمهور ديالك.", order: 2 },
  { question: "واش خاصني متجر كبير باش نخدم معاكم؟", answer: "لا. كنخدمو مع براندات صغيرة وكبيرة. المهم يكون عندك منتج مربح وواجد تستثمر فالإعلانات.", order: 3 },
  { question: "واش التتبع (Pixel) داخل فالخدمة؟", answer: "نعم، تركيب Pixel و CAPI و GA4 داخل فجميع الباقات — هذا أساس أي نجاح إعلاني.", order: 4 },
  { question: "كيفاش كتم البداية معاكم؟", answer: "كتعمر الفورم → كنتواصلو معاك فأقل من 24 ساعة → استشارة مجانية → خطة عمل واضحة → البداية خلال 48 ساعة.", order: 5 },
];

export const DEFAULT_CASE_STUDIES = [
  { title: "براند كوزمتيك مغربي", niche: "مستحضرات تجميل", before: "12 طلبية/يوم", after: "115 طلبية/يوم", metricLabel: "الطلبيات اليومية", order: 0 },
  { title: "متجر أزياء محجبات", niche: "أزياء", before: "CPA: 95 درهم", after: "CPA: 41 درهم", metricLabel: "تكلفة الطلبية", order: 1 },
  { title: "منتجات منزلية — الخليج", niche: "منزل ومطبخ", before: "ROAS: 1.4x", after: "ROAS: 4.8x", metricLabel: "العائد على الإنفاق", order: 2 },
];

export const DEFAULT_TESTIMONIALS = [
  { name: "ياسين ب.", company: "براند كوزمتيك", quote: "قبل ما نخدمو معاهم كنا كنحرقو الميزانية بلا نتيجة. دابا 100+ طلبية يومياً والتكلفة نازلة كل شهر.", order: 0 },
  { name: "سلمى ر.", company: "متجر أزياء", quote: "أول مرة نلقى فريق كيشرح ليا الأرقام بوضوح. التقارير الأسبوعية وحدها كتستاهل.", order: 1 },
  { name: "عمر ك.", company: "منتجات منزلية", quote: "التتبع اللي ركبوه بدل كلشي. الخوارزمية ولات كتجيب زبناء فعلاً كيشريو.", order: 2 },
];

export const DEFAULT_SETTINGS: Record<string, any> = {
  company: { name: "Earn Partner", logoUrl: "", tagline: "شريكك فالنمو" },
  seo: {
    title: "Earn Partner — أكثر من 100 طلبية يومياً لمتجرك",
    description: "وكالة أداء متخصصة فالتجارة الإلكترونية: إعلانات، تتبع، تحسين، وتوسع بأقل تكلفة ممكنة.",
    ogImage: "",
  },
  theme: { mode: "system", primary: "#3B82F6", accent: "#D9A441" },
  locale: { language: "ar", direction: "rtl", timezone: "Africa/Casablanca" },
  contact: { phone: "+212600000000", whatsapp: "+212600000000", email: "contact@earnpartner.ma" },
  analytics: { metaPixelId: "", tiktokPixelId: "", ga4Id: "", gtmId: "" },
};
