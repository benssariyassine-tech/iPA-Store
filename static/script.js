// ====== THEME MANAGEMENT SYSTEM ======
try {
  window.THEMES_LIST = ['dark', 'light', 'gold', 'algeria', 'redblack', 'sea'];
  window.THEME_CLASSES = {
    dark: [],
    light: ['light-mode'],
    gold: ['premium-mode'],
    algeria: ['algeria-mode'],
    redblack: ['redblack-mode'],
    sea: ['sea-mode']
  };

 window.getCurrentTheme = function() {
  try { return localStorage.getItem('istore_theme') || 'sea'; }
  catch(e) { return 'sea'; }
};

  window.applyTheme = function(themeName) {
    if (!window.THEMES_LIST.includes(themeName)) themeName = 'dark';
    document.body.classList.remove('light-mode', 'premium-mode', 'algeria-mode', 'redblack-mode', 'sea-mode');
    (window.THEME_CLASSES[themeName] || []).forEach(c => document.body.classList.add(c));
    if (typeof isLightMode !== 'undefined') isLightMode = (themeName === 'light');
    document.querySelectorAll('.theme-option').forEach(opt => {
      opt.classList.toggle('active', opt.dataset.theme === themeName);
    });
  };

window.selectTheme = function(themeName) {
  if (!window.THEMES_LIST.includes(themeName)) themeName = 'dark';
  try { localStorage.setItem('istore_theme', themeName); } catch(e) {}
  
  // 🎨 إذا بدلنا من Gold → نمسحو light-mode (باش ما يبقاش)
  if(themeName !== 'gold' && themeName !== 'light'){
    document.body.classList.remove('light-mode');
    isLightMode = false;
  }
  
  // 🌙 إذا اخترنا Gold → نخليو الوضع الحالي (light or dark)
  if(themeName === 'gold'){
    document.body.classList.toggle('light-mode', isLightMode);
  }
  
  // إذا اخترنا Light → نخليو light-mode
  if(themeName === 'light'){
    isLightMode = true;
  }
  
  // إذا اخترنا Dark → نحيدو light-mode
  if(themeName === 'dark'){
    isLightMode = false;
  }
  
  window.applyTheme(themeName);
  
  // زامن Settings UI بعد شوية
  setTimeout(() => {
    if (typeof syncSettingsUI === 'function') syncSettingsUI();
  }, 100);
  
  const lang = (typeof currentLang !== 'undefined') ? currentLang : 'en';
  const labels = {
    dark:    { en: 'Dark theme activated',        ar: 'تم تفعيل الوضع الداكن' },
    light:   { en: 'Light theme activated',       ar: 'تم تفعيل الوضع الفاتح' },
    gold:    { en: 'Gold theme activated',        ar: 'تم تفعيل الثيم الذهبي' },
    algeria: { en: 'Algeria theme activated',     ar: 'تم تفعيل ثيم الجزائر' },
    redblack:{ en: 'Red & Black theme activated', ar: 'تم تفعيل الثيم الأحمر والأسود' },
    sea:     { en: 'Deep Sea theme activated',    ar: 'تم تفعيل ثيم البحر العميق' }
  };
  if (typeof showToast === 'function') {
    showToast(labels[themeName][lang] || labels[themeName].en, 'success', 1800);
  }
  setTimeout(() => {
    if (typeof closeModal === 'function') closeModal('themeModal');
  }, 350);
};

  window.openThemeModal = function() {
    const current = window.getCurrentTheme();
    window.applyTheme(current);
    const lang = (typeof currentLang !== 'undefined') ? currentLang : 'en';
    const t = {
      en: { title: 'Choose Theme', sub: 'Pick a look that fits your style', basic: 'Basic', special: 'Special' },
      ar: { title: 'اختر الثيم', sub: 'اختر المظهر اللي يعجبك', basic: 'الأساسية', special: 'المميزة' }
    }[lang] || { title: 'Choose Theme', sub: '', basic: 'Basic', special: 'Special' };

    const titleEl = document.getElementById('themeModalTitle');
    const subEl = document.getElementById('themeModalSub');
    const basicEl = document.getElementById('themeBasicLabel');
    const specialEl = document.getElementById('themeSpecialLabel');

    if (titleEl) titleEl.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-4px;margin-right:6px;"><circle cx="13.5" cy="6.5" r="1.2"/><circle cx="17.5" cy="10.5" r="1.2"/><circle cx="8.5" cy="7.5" r="1.2"/><circle cx="6.5" cy="12.5" r="1.2"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg> ' + t.title;
    if (subEl) subEl.innerText = t.sub;
    if (basicEl) basicEl.innerText = t.basic;
    if (specialEl) specialEl.innerText = t.special;
    if (typeof openModal === 'function') openModal('themeModal');
  };

  console.log('✅ Theme system loaded OK');
} catch(err) {
  console.error('❌ Theme system error:', err);
}
  const firebaseConfig = {
  apiKey: "AIzaSyC3r9wr8tgjRNwWFY01mxrVy640sQFs2bg",
  authDomain: "istore-ipa.firebaseapp.com",
  projectId: "istore-ipa",
  storageBucket: "istore-ipa.firebasestorage.app",
  messagingSenderId: "262724812706",
  appId: "1:262724812706:web:b9fae4bb87f0417f557cfb"
};
if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);

emailjs.init("XQwzBLyP8pwHFNWxc");

setTimeout(function(){
  var s = document.getElementById('splashScreen');
  if(s){ s.classList.add('hide'); setTimeout(function(){ if(s && s.parentNode) s.parentNode.removeChild(s); }, 1200); }
}, 3500);

const auth = firebase.auth();
const db = firebase.firestore();

// ====== STATE ======
const ADMIN_EMAILS = ["benssariyassine@gmail.com"];
let currentUser = null;
let isAdmin = false;
let isPublisher = false;
let isUserPreview = false;
let currentTab = 'today';
let allAppsCache = [];
let allReportsCache = [];
 let allCommentReportsCache = [];
let allPublisherRequests = [];
let isLightMode = false;
let currentFilter = 'all';
let userFavorites = [];
let userProfile = { displayName: '', avatar: '', isVerified: false };
let appSettings = { darkMode: false, notifications: true, autoDownload: true, showComments: true, fontSize: 'medium' };
let currentLang = 'en';
let pendingAvatarData = '';

// ====== TRANSLATIONS ======
const TRANSLATIONS = {
  en: {
    welcomeTitle: "Welcome to iStore",
    welcomeSub: "Sign in to like apps, post comments, and apply as a publisher.",
    signInGoogle: "Sign in with Google",
    signIn: "Sign In",
    createAccountBtn: "Create Account",
    createAccountTitle: "Create Account",
    createAccountSub: "Join iStore and start downloading today.",
    noAccount: "Don't have an account? ",
    createOne: "Create one",
    haveAccount: "Already have an account? ",
    signInLink: "Sign in",
    emailPlaceholder: "Email",
    passwordPlaceholder: "Password",
    forgotPassword: "Forgot password?",
    passwordPlaceholderReg: "Password (min 6 chars)",
    namePlaceholder: "Full Name",
    verifyTitle: "Verify Your Email",
    verifySub: "We sent a 6-digit code to your email. Enter it below.",
    verifyBtn: "Verify Account",
    resendCode: "Resend Code",
    cancel: "Cancel",
    close: "Close",
    editProfile: "Edit Profile",
    settings: "Settings",
    applyPublisher: "Apply as Publisher",
    signOut: "Sign Out",
    saveChanges: "Save Changes",
    displayName: "Display Name",
    changePhoto: "Tap to change photo",
    darkMode: "Dark Mode",
    darkModeSub: "Switch between light and dark theme",
    notifications: "Notifications",
    notificationsSub: "Receive app update alerts",
    autoDownload: "Auto-play Downloads",
    autoDownloadSub: "Start download instantly when tapped",
    fontSize: "Font Size",
    fontSizeSub: "Adjust app text size",
    fontSmall: "Small", fontMedium: "Medium", fontLarge: "Large",
    clearCache: "Clear Cache",
    clearCacheSub: "Reset app data and preferences",
    clear: "Clear",
    appVersion: "App Version",
    language: "Language",
    navToday: "Today", navGames: "Games", navApps: "Apps", navTools: "Tools", navAdmin: "Admin",
    searchPlaceholder: "Search any app, game or tool...",
    addNewApp: "Add New App",
    previewMode: "User Preview Mode",
    exit: "Exit",
    verifyRequired: "Your account is not verified. Please check your email (and Spam folder).",
    verifiedBtn: "I have verified my email",
    publisherTitle: "Publisher Program",
    publisherSub: "As a Verified Publisher, you will be able to:",
    publisherFeature1: "Upload new apps to the store",
    publisherFeature2: "Manage your own published apps",
    publisherFeature3: "Delete or update your uploads",
    publisherReason: "Why would you like to become a publisher?",
    publisherPlaceholder: "Tell us briefly about yourself...",
    submitApplication: "Submit Application",
    autoFill: "Auto-Fill from App Store",
    fetchInfo: "Fetch App Info",
    publisherAlias: "Publisher Alias",
    category: "Category",
    platform: "Platform",
    appIcon: "App Icon",
    screenshots: "Screenshots",
    extraFiles: "Additional Files",
    savePublish: "Save & Publish",
    reportTitle: "Report an Issue",
    quickReason: "Quick reason:",
    brokenLink: "Broken Link",
    expiredCert: "Expired Certificate",
    badContent: "Inappropriate Content",
    reportDetails: "Or type details...",
    sendReport: "Send Report",
   seoBlockTitle: "Welcome to iStore",
    seoBlockDesc: "iStore is your ultimate destination for downloading the latest premium and modified apps and games for iOS (IPA) and Android (APK) for free. Browse our massive library and download directly with fast, direct links, no jailbreak required.",
    metaTitle: "iStore - Download Premium iOS (IPA) & Android (APK) Apps Free",
    metaDesc: "iStore is your ultimate destination for downloading the latest premium and modified apps and games for iOS (IPA) and Android (APK) for free.",
   footerCopyright: "© 2026 iStore. All rights reserved.",
    footerDisclaimer: "DMCA / Disclaimer: iStore does not host any files on its servers. All download links are provided by third-party platforms (such as GitHub, Telegram, etc.) and are for educational/testing purposes only. We are not affiliated with Apple Inc. or any app developers. If you are a copyright owner and want a link removed, please contact us.",
  swipeToClose: "Swipe down to close",
    footerContact: "Contact: ",
   searchTitle: "Search",
searchPlaceholder: "Search any app, game or tool...",
filterAll: "All", filterIOS: "iOS", filterAndroid: "Android",
filterApps: "Apps", filterGames: "Games", filterTools: "Tools",
noResults: "No results found",
startTyping: "Search for any app, game or tool",
resultsCount: "Results",
   supportTitle: "Technical Support",
    adminPanel: "Admin Panel",
    statusOnline: "Online",
    chatWelcome: "Welcome to iStore. I'm your AI assistant, how can I help you today?",
    chatPrivacy: "Notice: Chat history is not saved. All messages are temporary and cleared automatically when the window is closed.",
    chatPlaceholder: "Type your message...",
   quickFindApp: 'Find an app',
quickHowDownload: 'How to download',
quickBecomePublisher: 'Become a publisher',
   accountTitle: "Account",
tapToSignIn: "Tap to sign in",
sectionAppearance: "APPEARANCE",
sectionNotifications: "NOTIFICATIONS",
sectionDownloads: "DOWNLOADS",
sectionLanguage: "LANGUAGE",
sectionStorage: "STORAGE",
sectionAbout: "ABOUT",
sectionAdmin: "ADMIN",
theme: "Theme",
animations: "Animations",
enableAlerts: "Enable Alerts",
enableAlertsSub: "System notifications",
updateAlerts: "Update Alerts",
updateAlertsSub: "New app updates",
wifiOnly: "Wi-Fi Only",
wifiOnlySub: "Download only on Wi-Fi",
cacheSize: "Cache Size",
resetSettings: "Reset Settings",
resetSettingsSub: "Restore defaults",
contactSupport: "Contact Support",
rateStore: "Rate iStore",
adminDashboard: "Admin Dashboard",
userPreview: "User Preview Mode",
   checkEmailTitle: "Check Your Email",
checkEmailText: "We sent a 6-digit code to:",
checkEmailNote: "📩 Also check your",
spamFolder: "Spam / Junk",
checkEmailNote2: "folder",
gotIt: "Got it",
 },
  ar: {
    welcomeTitle: "مرحباً بك في iStore",
    welcomeSub: "سجّل الدخول للإعجاب بالتطبيقات والتعليق والتقديم كناشر.",
    signInGoogle: "تسجيل الدخول بـ Google",
    signIn: "تسجيل الدخول",
    createAccountBtn: "إنشاء حساب",
    createAccountTitle: "إنشاء حساب جديد",
    createAccountSub: "انضم إلى iStore وابدأ التحميل اليوم.",
    noAccount: "ليس لديك حساب؟ ",
    createOne: "أنشئ حساباً",
    haveAccount: "لديك حساب بالفعل؟ ",
    signInLink: "سجّل الدخول",
    emailPlaceholder: "البريد الإلكتروني",
    passwordPlaceholder: "كلمة المرور",
    forgotPassword: "نسيت كلمة المرور؟",
    passwordPlaceholderReg: "كلمة المرور (6 أحرف على الأقل)",
    namePlaceholder: "الاسم الكامل",
    verifyTitle: "تأكيد البريد الإلكتروني",
    verifySub: "أرسلنا رمزاً مكوناً من 6 أرقام إلى بريدك. أدخله أدناه.",
    verifyBtn: "تأكيد الحساب",
    resendCode: "إعادة إرسال الرمز",
    cancel: "إلغاء",
    close: "إغلاق",
    editProfile: "تعديل الملف الشخصي",
    settings: "الإعدادات",
    applyPublisher: "التقديم كناشر",
    signOut: "تسجيل الخروج",
    saveChanges: "حفظ التغييرات",
    displayName: "الاسم المعروض",
    changePhoto: "اضغط لتغيير الصورة",
    darkMode: "الوضع الداكن",
    darkModeSub: "التبديل بين الوضع الفاتح والداكن",
    notifications: "الإشعارات",
    notificationsSub: "استقبل تنبيهات تحديث التطبيقات",
    autoDownload: "التحميل التلقائي",
    autoDownloadSub: "بدء التحميل فوراً عند النقر",
    fontSize: "حجم الخط",
    fontSizeSub: "ضبط حجم نص التطبيق",
    fontSmall: "صغير", fontMedium: "متوسط", fontLarge: "كبير",
    clearCache: "مسح الذاكرة المؤقتة",
    clearCacheSub: "إعادة تعيين بيانات التطبيق",
    clear: "مسح",
    appVersion: "إصدار التطبيق",
    language: "اللغة",
    navToday: "اليوم", navGames: "ألعاب", navApps: "تطبيقات", navTools: "أدوات", navAdmin: "الإدارة",
    searchPlaceholder: "ابحث عن تطبيق أو لعبة أو أداة...",
    addNewApp: "إضافة تطبيق جديد",
    previewMode: "وضع معاينة المستخدم",
    exit: "خروج",
verifyRequired: "حسابك غير مُفعّل. يرجى فحص بريدك الإلكتروني (ومجلد Spam).",
    verifiedBtn: "لقد أكدت بريدي",
    publisherTitle: "برنامج الناشرين",
    publisherSub: "كناشر مُعتمد، ستتمكن من:",
    publisherFeature1: "رفع تطبيقات جديدة للمتجر",
    publisherFeature2: "إدارة تطبيقاتك المنشورة",
    publisherFeature3: "حذف أو تحديث ملفاتك",
    publisherReason: "لماذا تريد أن تصبح ناشراً؟",
    publisherPlaceholder: "أخبرنا باختصار عن نفسك...",
    submitApplication: "إرسال الطلب",
    autoFill: "تعبئة تلقائية من App Store",
    fetchInfo: "جلب معلومات التطبيق",
    publisherAlias: "اسم الناشر",
    category: "الفئة",
    platform: "المنصة",
    appIcon: "أيقونة التطبيق",
    screenshots: "لقطات الشاشة",
    extraFiles: "ملفات إضافية",
    savePublish: "حفظ ونشر",
    reportTitle: "الإبلاغ عن مشكلة",
    quickReason: "السبب السريع:",
    brokenLink: "رابط معطل",
    expiredCert: "شهادة منتهية",
    badContent: "محتوى غير لائق",
    reportDetails: "أو اكتب التفاصيل...",
    sendReport: "إرسال التقرير",
   seoBlockTitle: "مرحباً بكم في iStore", 
    metaTitle: "iStore - تحميل تطبيقات وألعاب الآيفون (IPA) والأندرويد (APK) مجاناً",
    metaDesc: "متجر iStore هو وجهتك الأولى...",
footerCopyright: "© 2026 iStore. جميع الحقوق محفوظة.",
    footerDisclaimer: "إخلاء مسؤولية: موقع iStore لا يستضيف أي ملفات على سيرفراته. جميع روابط التحميل مقدمة من منصات طرف ثالث (مثل GitHub، تيليجرام، إلخ) وهي لأغراض تعليمية وتجريبية فقط. نحن غير تابعين لشركة Apple أو أي مطور تطبيقات. إذا كنت مالك حقوق وتريد حذف رابط، يرجى التواصل معنا.",
    swipeToClose: "اسحب للأسفل للإغلاق",
    footerContact: "التواصل: ",
   searchTitle: "البحث",
searchPlaceholder: "ابحث عن تطبيق، لعبة أو أداة...",
filterAll: "الكل", filterIOS: "iOS", filterAndroid: "أندرويد",
filterApps: "تطبيقات", filterGames: "ألعاب", filterTools: "أدوات",
noResults: "لا توجد نتائج",
startTyping: "ابحث عن أي تطبيق أو لعبة أو أداة",
resultsCount: "النتائج",
   supportTitle: "الدعم الفني",
    adminPanel: "لوحة الإدارة",
    statusOnline: "متصل",
    chatWelcome: "مرحباً بك في iStore. أنا مساعدك الذكي، كيف يمكنني مساعدتك اليوم؟",
    chatPrivacy: "تنبيه: لا يتم حفظ سجل المحادثات. جميع الرسائل مؤقتة وتُمسح تلقائياً عند إغلاق النافذة.",
    chatPlaceholder: "اكتب رسالتك...",
quickFindApp: 'ابحث عن تطبيق',
quickHowDownload: 'كيفاش نحمل',
quickBecomePublisher: 'تفعيل وضع ناشر',
   accountTitle: "حسابي",
tapToSignIn: "اضغط لتسجيل الدخول",
sectionAppearance: "المظهر",
sectionNotifications: "الإشعارات",
sectionDownloads: "التحميلات",
sectionLanguage: "اللغة",
sectionStorage: "التخزين",
sectionAbout: "حول",
sectionAdmin: "الإدارة",
theme: "الثيم",
animations: "الحركات",
enableAlerts: "تفعيل التنبيهات",
enableAlertsSub: "إشعارات النظام",
updateAlerts: "تنبيهات التحديث",
updateAlertsSub: "تحديثات التطبيقات الجديدة",
wifiOnly: "Wi-Fi فقط",
wifiOnlySub: "التحميل على Wi-Fi فقط",
cacheSize: "حجم الكاش",
resetSettings: "إعادة تعيين الإعدادات",
resetSettingsSub: "استعادة الحالة الأصلية",
contactSupport: "تواصل مع الدعم",
rateStore: "قيّم iStore",
adminDashboard: "لوحة الإدارة",
userPreview: "وضع معاينة المستخدم",
   checkEmailTitle: "تحقق من بريدك الإلكتروني",
checkEmailText: "لقد أرسلنا رمزاً مكوناً من 6 أرقام إلى:",
checkEmailNote: "📩 يُرجى أيضاً فحص مجلد",
spamFolder: "الرسائل غير المرغوب فيها",
checkEmailNote2: "",
gotIt: "فهمت",
  }
};

function t(key){ return (TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang][key]) || key; }

function applyTranslations(){
  // 1. النصوص العادية
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if(TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang][key]) el.innerText = TRANSLATIONS[currentLang][key];
  });

  // 2. النصوص داخل placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if(TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang][key]) el.placeholder = TRANSLATIONS[currentLang][key];
  });

// 3. تفعيل زر اللغة النشط (لكل المجموعات — modal القديم + صفحة Settings الجديدة)
  document.querySelectorAll('.lang-btn').forEach(btn => {
    // نحدد لغة الزر: data-lang أولاً، ثم من id كـ fallback
    let btnLang = btn.dataset.lang;
    if (!btnLang) {
      if (btn.id === 'langEn') btnLang = 'en';
      else if (btn.id === 'langAr') btnLang = 'ar';
    }
    if (btnLang) {
      btn.classList.toggle('active', currentLang === btnLang);
    }
  });

  // 4. اتجاه الصفحة واللغة
  document.body.setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr');
  document.documentElement.lang = currentLang;

  // 5. تحديث النص التعريفي (SEO Block) حسب اللغة
  const seoTitle = document.getElementById('seoTitleText');
  const seoDesc = document.getElementById('seoDescText');
  if (seoTitle && TRANSLATIONS[currentLang].seoBlockTitle) seoTitle.innerText = TRANSLATIONS[currentLang].seoBlockTitle;
  if (seoDesc && TRANSLATIONS[currentLang].seoBlockDesc) seoDesc.innerText = TRANSLATIONS[currentLang].seoBlockDesc;

  // 6. تحديث عنوان الصفحة والوصف لجوجل (Google Title & Description)
  if (TRANSLATIONS[currentLang].metaTitle) document.title = TRANSLATIONS[currentLang].metaTitle;
  const metaDescEl = document.querySelector('meta[name="description"]');
  if (metaDescEl && TRANSLATIONS[currentLang].metaDesc) metaDescEl.setAttribute('content', TRANSLATIONS[currentLang].metaDesc);
  const ogTitleEl = document.querySelector('meta[property="og:title"]');
  if (ogTitleEl && TRANSLATIONS[currentLang].metaTitle) ogTitleEl.setAttribute('content', TRANSLATIONS[currentLang].metaTitle);
  const ogDescEl = document.querySelector('meta[property="og:description"]');
  if (ogDescEl && TRANSLATIONS[currentLang].metaDesc) ogDescEl.setAttribute('content', TRANSLATIONS[currentLang].metaDesc);

  // 7. تحديث حقوق النشر والإخلاء في الأسفل (Footer)
  const copyrightEl = document.getElementById('footerCopyrightText');
  const disclaimerEl = document.getElementById('footerDisclaimerText');
  const contactEl = document.getElementById('footerContactText');
  if (copyrightEl && TRANSLATIONS[currentLang].footerCopyright) copyrightEl.innerHTML = TRANSLATIONS[currentLang].footerCopyright;
  if (disclaimerEl && TRANSLATIONS[currentLang].footerDisclaimer) disclaimerEl.innerHTML = TRANSLATIONS[currentLang].footerDisclaimer;
  if (contactEl && TRANSLATIONS[currentLang].footerContact) contactEl.innerText = TRANSLATIONS[currentLang].footerContact;
}

function changeLanguage(lang){
  currentLang = lang;
  localStorage.setItem('istore_lang', lang);
  applyTranslations();
  renderUI();
  if (typeof updateNewsBubble === 'function') updateNewsBubble();
  showToast(lang === 'ar' ? 'تم تغيير اللغة إلى العربية' : 'Language changed to English', 'success', 1500);
}

// ====== ICONS ======
const FALLBACK_ICON = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwIiB5MT0iMCIgeDI9IjEiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiMwYTg0ZmYiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwMDYyZDIiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcng9IjIyIiBmaWxsPSJ1cmwoI2cpIi8+PHBhdGggZD0iTTUwIDI1IEw2MCA0NSBMODIgNDggTDY2IDYzIEw3MCA4NSBMNTAgNzQgTDMwIDg1IEwzNCA2MyBMMTggNDggTDQwIDQ1IFoiIGZpbGw9IndoaXRlIi8+PC9zdmc+';
const DEFAULT_AVATAR = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwIiB5MT0iMCIgeDI9IjEiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiMwYTg0ZmYiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwMDYyZDIiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcng9IjUwIiBmaWxsPSJ1cmwoI2cpIi8+PGNpcmNsZSBjeD0iNTAiIGN5PSIzOCIgcj0iMTgiIGZpbGw9IndoaXRlIiBvcGFjaXR5PSIwLjkiLz48cGF0aCBkPSJNMjAgODAgUTIwIDU4IDUwIDU4IFE4MCA1OCA4MCA4MCBaIiBmaWxsPSJ3aGl0ZSIgb3BhY2l0eT0iMC45Ii8+PC9zdmc+';

const ICONS = {
  check:'<svg class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>',
  close:'<svg class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
  warning:'<svg class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  info:'<svg class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
  download:'<svg class="icon-inline-sm" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
  star:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  starFill:'<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  share:'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>',
  infoCircle:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
  chevronDown:'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>',
  apple:'<svg width="12" height="12" viewBox="0 0 24 24" fill="#0a84ff"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>',
  android:'<svg width="12" height="12" viewBox="0 0 24 24" fill="#32d74b"><path d="M17.6 9.48l1.84-3.18c.16-.27.07-.62-.2-.78-.27-.16-.62-.07-.78.2l-1.87 3.24c-1.32-.58-2.79-.9-4.34-.9s-3.02.32-4.34.9L6.06 5.72c-.16-.27-.51-.36-.78-.2-.27.16-.36.51-.2.78l1.84 3.18C4.6 11.23 3 13.9 3 17h18c0-3.1-1.6-5.77-4.4-7.52zM7 14.5c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm10 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/></svg>',
  eye:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
  heart:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
  heartFill:'<svg width="16" height="16" viewBox="0 0 24 24" fill="#ff453a" stroke="#ff453a" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
  bolt:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
  trophy:'<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M3 7l4 4 5-7 5 7 4-4v12H3V7z"/></svg>',
  dlBig:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
  clock:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>'
};

 // ====== NOTIFICATION SYSTEM ======
function getNotifIcon(type) {
  const icons = {
    success: '<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>',
    error:   '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
    warning: '<svg viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    info:    '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
    download:'<svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>'
  };
  return icons[type] || icons.info;
}

function dismissNotif(card) {
  if (!card || card.classList.contains('dismissing')) return;
  card.classList.add('dismissing');
  setTimeout(() => { try { card.remove(); } catch(e){} }, 350);
}
function showNotification(opts) {
  const stack = document.getElementById('notifStack');
  if (!stack) return;

  const o = opts || {};
  const title    = o.title || '';
  const desc     = o.desc  || '';
  const type     = o.type  || 'info';
  const duration = (o.duration === 0) ? 0 : (o.duration || 3500);
  const image    = o.image || null;
  const iconSVG  = o.icon  || null;
  const action   = o.action || null;
  const progress = !!o.progress;
  const vibrate  = (o.vibrate !== false);
  const context  = o.context || null;

  const hasAppContext = context && context.appId;
  const showProblem = o.showProblem !== false;

  const card = document.createElement('div');
  card.className = 'notif-card notif-type-' + type;
  card._notifData = { title, desc, type, context };

  let progressHTML = '';
  if (progress) progressHTML = '<div class="notif-progress"></div>';

  let iconHTML = '';
  if (image) iconHTML = '<img src="' + image + '" alt="" onerror="this.style.display=\'none\'">';
  else if (iconSVG) iconHTML = iconSVG;
  else iconHTML = getNotifIcon(type);

  let actionHTML = '';
  if (action && action.icon) {
    actionHTML = '<button class="notif-action" type="button" aria-label="action">' + action.icon + '</button>';
  }

  let optionsHTML = '';
  if (hasAppContext || showProblem) {
    optionsHTML = '<div class="notif-options">';
    
    if (hasAppContext) {
      optionsHTML += 
        '<button class="notif-opt-btn notif-opt-report" type="button">' +
          '<svg viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>' +
          '<span>' + (currentLang === 'ar' ? 'إبلاغ' : 'Report') + '</span>' +
        '</button>';
    }
    
    if (showProblem) {
      optionsHTML += 
        '<button class="notif-opt-btn notif-opt-problem" type="button">' +
          '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>' +
          '<span>' + (currentLang === 'ar' ? 'هل واجهت مشكلة؟' : 'Had a problem?') + '</span>' +
        '</button>';
    }
    
    optionsHTML += '</div>';
  }

  card.innerHTML =
    progressHTML +
    '<div class="notif-main">' +
      '<div class="notif-icon">' + iconHTML + '</div>' +
      '<div class="notif-text">' +
        (title ? '<div class="notif-title">' + title + '</div>' : '') +
        (desc  ? '<div class="notif-desc">'  + desc  + '</div>' : '') +
      '</div>' +
      actionHTML +
    '</div>' +
    (optionsHTML ? '<div class="notif-handle"></div>' + optionsHTML : '');

  stack.insertBefore(card, stack.firstChild);

  if (vibrate && navigator.vibrate) {
    try { navigator.vibrate(15); } catch(e){}
  }

  if (action && action.onClick) {
    const btn = card.querySelector('.notif-action');
    if (btn) btn.addEventListener('click', function(e){
      e.stopPropagation();
      try { action.onClick(); } catch(err){}
    });
  }

  if (progress && duration > 0) {
    const pb = card.querySelector('.notif-progress');
    if (pb) requestAnimationFrame(() => {
      pb.style.transition = 'transform ' + duration + 'ms linear';
      pb.style.transform = 'scaleX(0)';
    });
  }

  let dismissTimer = null;
  if (duration > 0) dismissTimer = setTimeout(() => dismissNotif(card), duration);

  const handle = card.querySelector('.notif-handle');
  const options = card.querySelector('.notif-options');
  
  if (handle && options) {
    handle.addEventListener('click', function(e){
      e.stopPropagation();
      const isOpen = card.classList.contains('expanded');
      if (isOpen) {
        card.classList.remove('expanded');
        options.style.maxHeight = '0';
      } else {
        card.classList.add('expanded');
        options.style.maxHeight = '60px';
      }
      if (dismissTimer) { clearTimeout(dismissTimer); dismissTimer = null; }
      if (duration > 0) dismissTimer = setTimeout(() => dismissNotif(card), 8000);
    });
  }

  const reportBtn = card.querySelector('.notif-opt-report');
  if (reportBtn) {
    reportBtn.addEventListener('click', function(e){
      e.stopPropagation();
      handleReportFromNotif(card);
    });
  }
  
  const problemBtn = card.querySelector('.notif-opt-problem');
  if (problemBtn) {
    problemBtn.addEventListener('click', function(e){
      e.stopPropagation();
      handleProblemFromNotif(card);
    });
  }

  let startY = 0, currentY = 0, isDragging = false;
  card.addEventListener('touchstart', function(e){
    if (!e.touches || !e.touches[0]) return;
    if (e.target.closest('.notif-handle')) return;
    if (e.target.closest('.notif-options')) return;
    startY = e.touches[0].clientY;
    currentY = 0;
    isDragging = true;
    card.style.transition = 'none';
    if (dismissTimer) { clearTimeout(dismissTimer); dismissTimer = null; }
  }, { passive: true });

  card.addEventListener('touchmove', function(e){
    if (!isDragging || !e.touches || !e.touches[0]) return;
    currentY = e.touches[0].clientY - startY;
    if (currentY < 0) {
      card.style.transform = 'translateY(' + currentY + 'px)';
      card.style.opacity = Math.max(0, 1 - Math.abs(currentY) / 200);
    }
  }, { passive: true });

  card.addEventListener('touchend', function(){
    if (!isDragging) return;
    isDragging = false;
    card.style.transition = '';
    if (currentY < -70) {
      dismissNotif(card);
    } else {
      card.style.transform = '';
      card.style.opacity = '';
      if (duration > 0) dismissTimer = setTimeout(() => dismissNotif(card), duration);
    }
    currentY = 0;
  });

  return card;
}

// 🚨 الإبلاغ — يفتح الإبلاغ على التطبيق بضبط
function handleReportFromNotif(card) {
  const data = card._notifData || {};
  const ctx = data.context || {};
  
  // نسد الإشعار
  dismissNotif(card);
  
  // إذا عندنا appId، نفتحو الإبلاغ على التطبيق
  if (ctx.appId) {
    setTimeout(() => {
      if (typeof openReportModal === 'function') {
        openReportModal(ctx.appId);
      }
    }, 200);
  }
}

// 💬 سأل isto على المشكلة
function handleProblemFromNotif(card) {
  const data = card._notifData || {};
  const ctx = data.context || {};
  const message = currentLang === 'ar'
    ? `واجهت مشكلة مع هذا الإشعار:\n📌 ${data.title || ''}\n${data.desc || ''}${ctx.appName ? '\n📱 التطبيق: ' + ctx.appName : ''}${ctx.appUrl ? '\n🔗 الرابط: ' + ctx.appUrl : ''}\n\nواش ندير باش نحلها؟`
    : `I had a problem with this notification:\n📌 ${data.title || ''}\n${data.desc || ''}${ctx.appName ? '\n📱 App: ' + ctx.appName : ''}\n\nWhat should I do?`;

  dismissNotif(card);

  // افتح الشات
  const drawer = document.getElementById('aiChatDrawer');
  if (drawer) drawer.classList.add('open');
  const panel = document.getElementById('aiChatPanel');
  if (panel) { panel.style.transition = 'none'; panel.style.transform = 'translateY(0)'; }

  // حط الرسالة و صيفطها
  setTimeout(() => {
    const inp = document.getElementById('aiChatInput');
    if (inp) {
      inp.value = message;
      sendAiMessage();
    }
  }, 500);
}
/* ============================================
   🍞 TOAST — In-App فقط (بلا System)
   ============================================ */
function showToast(msg, type, duration) {
  // 🎯 Toast = In-App فقط، بلا system notification
  return showNotification({
    inApp: true,        // ← In-App
    system: false,      // ← ما يبعثش system
    title: msg,
    type: type || 'info',
    duration: (duration === 0) ? 0 : (duration || 3000)
  });
}

// 🔄 تحديث محتوى الإشعار (بعد ما يكمل progress)
function updateNotifContent(card, opts) {
  if (!card) return;
  const titleEl = card.querySelector('.notif-title');
  const descEl = card.querySelector('.notif-desc');
  const iconEl = card.querySelector('.notif-icon');
  const progressEl = card.querySelector('.notif-progress');

  if (titleEl && opts.title !== undefined) titleEl.textContent = opts.title;
  if (descEl && opts.desc !== undefined) descEl.textContent = opts.desc;
  if (iconEl && opts.icon) iconEl.innerHTML = opts.icon;

  if (opts.type) {
    card.classList.remove('notif-type-info', 'notif-type-success', 'notif-type-error', 'notif-type-warning');
    card.classList.add('notif-type-' + opts.type);
  }

  if (progressEl) progressEl.style.display = 'none';
}

function showDownloadNotif(appName, duration, appUrl, isOfficial, appId) {
  const d = duration || 3000;
  const hasLink = !!(appUrl && appUrl !== '#' && appUrl.trim() !== '');

  // 🎯 In-App فقط (ماشي system)
  const card = showNotification({
    inApp: true,       // ← In-App
    system: false,     // ← ما يبعثش system
    title: currentLang === 'ar' ? 'جاري توجيهك لرابط التحميل...' : 'Redirecting to download link...',
    desc: appName || '',
    type: 'info',
    icon: getNotifIcon('download'),
    duration: 0,
    progress: true,
    vibrate: true,
    context: { appName, appUrl, appId },
    showProblem: true
  });

  if (!card) return;

  setTimeout(() => {
    if (hasLink) {
      updateNotifContent(card, {
        type: 'success',
        title: currentLang === 'ar' ? 'تم فتح الرابط بنجاح' : 'Link opened successfully',
        desc: appName || '',
        icon: getNotifIcon('success')
      });
      
      const problemBtn = card.querySelector('.notif-opt-problem');
      if (problemBtn) problemBtn.remove();
      
      setTimeout(() => dismissNotif(card), 3000);
    } else {
      let errorDesc = '';
      if (!appUrl || appUrl === '') {
        errorDesc = currentLang === 'ar' ? 'ما كاينش رابط تحميل لهذا التطبيق' : 'No download link for this app';
      } else if (appUrl === '#') {
        errorDesc = currentLang === 'ar' ? 'الرابط ماشي صحيح' : 'Invalid link';
      }
      
      updateNotifContent(card, {
        type: 'error',
        title: currentLang === 'ar' ? 'تعذر فتح الرابط' : 'Cannot open link',
        desc: errorDesc,
        icon: getNotifIcon('error')
      });
      
      const problemBtn = card.querySelector('.notif-opt-problem');
      if (problemBtn) problemBtn.remove();
      
      setTimeout(() => dismissNotif(card), 8000);
    }
  }, d);
}
/* ============================================
   DMCA / COPYRIGHT PAGE
   ============================================ */
function openDMCAPage() {
  const isAr = (typeof currentLang !== 'undefined' && currentLang === 'ar');
  
  const title = isAr ? 'DMCA - حقوق النشر' : 'DMCA - Copyright Policy';
  
  const content = isAr
    ? '<p style="margin:0 0 16px 0; font-size:13px; color:var(--subtext-color);">iStore - جميع الحقوق محفوظة (c) 2026</p>' +
      '<p style="margin:0 0 12px 0; font-size:13px; line-height:1.7; color:var(--text-color);">هذا الموقع وكل محتواه، بما في ذلك:</p>' +
      '<ul style="margin:0 0 16px 0; padding-right:20px; font-size:13px; line-height:1.8; color:var(--text-color);">' +
        '<li>الكود المصدري (HTML, CSS, JavaScript)</li>' +
        '<li>التصميم والتخطيط والعناصر المرئية</li>' +
        '<li>الأيقونات والشعارات</li>' +
        '<li>بنية قاعدة البيانات ومحتواها</li>' +
      '</ul>' +
      '<p style="margin:0 0 12px 0; font-size:13px; line-height:1.7; color:var(--text-color);">هي ملكية حصرية لفريق iStore ومحمية بموجب:</p>' +
      '<ul style="margin:0 0 16px 0; padding-right:20px; font-size:13px; line-height:1.8; color:var(--text-color);">' +
        '<li>DMCA (قانون الألفية الرقمية لحقوق النشر)</li>' +
        '<li>المعاهدات الدولية لحقوق النشر</li>' +
        '<li>اتفاقية برن</li>' +
      '</ul>' +
      '<div style="background:rgba(255,159,10,0.1); border:1px solid rgba(255,159,10,0.3); border-radius:12px; padding:12px; margin-bottom:16px;">' +
        '<p style="margin:0; font-size:12.5px; line-height:1.6; color:var(--warning); font-weight:700;">تنبيه - الاستخدام غير المصرح</p>' +
        '<p style="margin:6px 0 0 0; font-size:12.5px; line-height:1.6; color:var(--text-color);">أي نسخ أو تعديل أو توزيع أو استخدام تجاري بدون إذن كتابي صريح من المالك ممنوع تماما.</p>' +
      '</div>' +
      '<div style="background:rgba(255,69,58,0.1); border:1px solid rgba(255,69,58,0.3); border-radius:12px; padding:12px;">' +
        '<p style="margin:0; font-size:12.5px; color:var(--danger); font-weight:800;">للإبلاغ عن انتهاك:</p>' +
        '<p style="margin:4px 0 0 0; font-size:13px; color:var(--accent); font-weight:800;">support.istoreipa@gmail.com</p>' +
      '</div>'
    : '<p style="margin:0 0 16px 0; font-size:13px; color:var(--subtext-color);">iStore - All Rights Reserved (c) 2026</p>' +
      '<p style="margin:0 0 12px 0; font-size:13px; line-height:1.7; color:var(--text-color);">This website and all of its content, including but not limited to:</p>' +
      '<ul style="margin:0 0 16px 0; padding-left:20px; font-size:13px; line-height:1.8; color:var(--text-color);">' +
        '<li>Source code (HTML, CSS, JavaScript)</li>' +
        '<li>Design, layout, and UI elements</li>' +
        '<li>Graphics, icons, and logos</li>' +
        '<li>Database structure and content</li>' +
      '</ul>' +
      '<p style="margin:0 0 12px 0; font-size:13px; line-height:1.7; color:var(--text-color);">Are the exclusive property of iStore Team and protected by:</p>' +
      '<ul style="margin:0 0 16px 0; padding-left:20px; font-size:13px; line-height:1.8; color:var(--text-color);">' +
        '<li>DMCA (Digital Millennium Copyright Act)</li>' +
        '<li>International copyright treaties</li>' +
        '<li>Berne Convention</li>' +
      '</ul>' +
      '<div style="background:rgba(255,159,10,0.1); border:1px solid rgba(255,159,10,0.3); border-radius:12px; padding:12px; margin-bottom:16px;">' +
        '<p style="margin:0; font-size:12.5px; line-height:1.6; color:var(--warning); font-weight:700;">WARNING - Unauthorized Use</p>' +
        '<p style="margin:6px 0 0 0; font-size:12.5px; line-height:1.6; color:var(--text-color);">Any copying, modification, distribution, or commercial use without written permission is strictly prohibited.</p>' +
      '</div>' +
      '<div style="background:rgba(255,69,58,0.1); border:1px solid rgba(255,69,58,0.3); border-radius:12px; padding:12px;">' +
        '<p style="margin:0; font-size:12.5px; color:var(--danger); font-weight:800;">To report a violation:</p>' +
        '<p style="margin:4px 0 0 0; font-size:13px; color:var(--accent); font-weight:800;">support.istoreipa@gmail.com</p>' +
      '</div>';
  
  // نحيد أي modal قديم
  const oldModal = document.getElementById('dmcaModal');
  if (oldModal) oldModal.remove();
  
  // ننشئ modal جديد
  const modal = document.createElement('div');
  modal.id = 'dmcaModal';
  modal.className = 'modal';
  modal.style.display = 'flex';
  modal.style.zIndex = '99999';
  
  modal.innerHTML = 
    '<div class="modal-box" style="max-width:440px;">' +
      '<button class="modal-close-x" onclick="closeDMCAPage()" aria-label="Close">' +
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">' +
          '<line x1="18" y1="6" x2="6" y2="18"/>' +
          '<line x1="6" y1="6" x2="18" y2="18"/>' +
        '</svg>' +
      '</button>' +
      '<h3 class="modal-title" style="margin-bottom:18px;">' + title + '</h3>' +
      '<div style="max-height:60vh; overflow-y:auto; padding-right:4px;">' + content + '</div>' +
      '<button onclick="closeDMCAPage()" class="btn-secondary" style="margin-top:18px;" data-i18n="close">Close</button>' +
    '</div>';
  
  document.body.appendChild(modal);
}

function closeDMCAPage() {
  const modal = document.getElementById('dmcaModal');
  if (modal) modal.remove();
}
function closeModal(id){ document.getElementById(id).style.display='none'; }
function openModal(id){ document.getElementById(id).style.display='flex'; }
function openImgViewer(src){ document.getElementById('imgViewerImg').src = src; document.getElementById('imgViewer').style.display='flex'; }
function closeImgViewer(){ document.getElementById('imgViewer').style.display='none'; }

function showRegisterView(){
  document.getElementById('loginView').style.display = 'none';
  document.getElementById('registerView').style.display = 'block';
}
function showLoginView(){
  document.getElementById('loginView').style.display = 'block';
  document.getElementById('registerView').style.display = 'none';
}

// ====== PREFERENCES ======
function savePrefs(){
  try{
    localStorage.setItem('istore_prefs', JSON.stringify({lightMode:isLightMode, tab:currentTab, favorites:userFavorites, lang:currentLang}));
  }catch(e){}
}
function loadPrefs(){
  try{
    const p = JSON.parse(localStorage.getItem('istore_prefs')||'{}');
    if(p.lightMode){ isLightMode = true; document.body.classList.add('light-mode'); }
    if(p.favorites) userFavorites = p.favorites;
    if(p.tab && p.tab !== 'admin_panel') currentTab = p.tab;
    if(p.lang) currentLang = p.lang;
  }catch(e){}
  const savedLang = localStorage.getItem('istore_lang');
  if(savedLang) currentLang = savedLang;

  // ✅ حمّل الثيم المحفوظ (وكي ما كانش، استعمل Gold)
const savedTheme = localStorage.getItem('istore_theme');
if (typeof applyTheme === 'function') {
  applyTheme(savedTheme || 'sea');
  } else {
    // احتياطي: طبّق الثيم يدوياً إذا applyTheme ماشي معرّفة بعد
    const themeClasses = {
      'dark': [],
      'light': ['light-mode'],
      'gold': ['premium-mode'],
      'algeria': ['algeria-mode'],
      'redblack': ['redblack-mode'],
      'sea': ['sea-mode']
    };
const themeToApply = (savedTheme && themeClasses[savedTheme]) ? savedTheme : 'sea';
    document.body.classList.remove('light-mode', 'premium-mode', 'algeria-mode', 'redblack-mode', 'sea-mode');
    themeClasses[themeToApply].forEach(c => document.body.classList.add(c));
    if (themeToApply === 'light') isLightMode = true;
  }
}

function toggleDarkMode(){
  isLightMode = !isLightMode;
  document.body.classList.toggle('light-mode', isLightMode);
  const icon = document.getElementById('themeIcon');
  if(isLightMode) icon.innerHTML = '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>';
  else icon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
  savePrefs();
showToast(isLightMode ? 'Light mode' : 'Dark mode', 'info', 1500);
}
// ====== VERIFIED EMAIL CHECK ======
function requireVerifiedEmail(){
  if (!currentUser) {
    showToast(
      currentLang === 'ar' 
        ? 'يجب تسجيل الدخول أولاً' 
        : 'Please sign in first to download',
      'warning',
      3000
    );
    setTimeout(() => {
      openAccountModal();
    }, 600);
    return false;
  }
  if (currentUser.providerData.some(p => p.providerId !== 'password')) return true;
  if (!userProfile.isVerified){
    showToast(t('verifyRequired'), "warning", 4000);
    return false;
  }
  return true;
}

// ====== AUTH: REGISTER ======
function registerWithEmail(){
  const name = document.getElementById('authName').value.trim();
  const email = document.getElementById('authEmail').value.trim();
  const password = document.getElementById('authPassword').value;
  if(!name || !email || !password){ showToast('Please fill all fields / يرجى ملء جميع الحقول', 'warning'); return; }
  if(password.length < 6){ showToast('Password must be at least 6 characters', 'warning'); return; }

  const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

  auth.createUserWithEmailAndPassword(email, password)
    .then(cred => {
      return db.collection("users").doc(cred.user.uid).set({
        displayName: name,
        email: email,
        role: "user",
        isVerified: false,
        verificationCode: verifyCode,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    })
    .then(() => {
      return emailjs.send('service_x7p1ujg', 'template_mp4sdd5', {
        to_name: name,
        to_email: email,
        from_name: "iStore Team",
        verification_code: verifyCode
      });
    })
    .then(() => {
      showToast("Account created! Check your email.", "success", 6000);
      userProfile.isVerified = false;
      userProfile.displayName = name;
      document.getElementById('loginView').style.display = 'none';
      document.getElementById('registerView').style.display = 'none';
      document.getElementById('verifyCodeView').style.display = 'block';
      document.getElementById('verificationCodeInput').value = '';
      document.getElementById('verificationCodeInput').focus();
    })
    .catch(err => showToast("Error: " + err.message, "error"));
}
function forgotPassword(){
  const email = document.getElementById('loginEmail').value.trim();
  if(!email){
    showToast(currentLang==='ar'?'الرجاء إدخال البريد الإلكتروني أولاً':'Please enter your email first', 'warning');
    return;
  }
  auth.sendPasswordResetEmail(email)
    .then(() => showToast(currentLang==='ar'?'تم إرسال رابط إعادة التعيين إلى بريدك. تحقق أيضاً من مجلد البريد غير المرغوب فيه (Spam)':'Reset link sent! Check your email and the Spam folder too.', 'success', 6000))
    .catch(err => showToast('Error: ' + err.message, 'error', 5000));
}
// ====== AUTH: LOGIN ======
function loginWithEmail(){
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  if(!email || !password){ showToast('Please enter email and password', 'warning'); return; }
  auth.signInWithEmailAndPassword(email, password)
    .then(() => { showToast("Welcome back! / مرحباً بعودتك!", "success"); closeModal('accountModal'); })
    .catch(err => showToast("Error: " + err.message, "error"));
}

// ====== AUTH: GOOGLE ======
function loginWithGoogle(){
  const provider = new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  auth.signInWithPopup(provider).catch(()=>auth.signInWithRedirect(provider));
}

// ====== AUTH: VERIFY CODE ======
function verifyCode(){
  if (!auth.currentUser) return;
  const inputCode = document.getElementById('verificationCodeInput').value.trim();
  if (!inputCode || inputCode.length !== 6){ showToast('Please enter the 6-digit code', 'warning'); return; }
  db.collection("users").doc(auth.currentUser.uid).get().then(doc => {
    if (!doc.exists){ showToast('User data not found', 'error'); return; }
    const data = doc.data();
    if (data.verificationCode === inputCode){
      return db.collection("users").doc(auth.currentUser.uid).update({
        isVerified: true,
        verificationCode: null
      }).then(() => {
        showToast("Account verified! / تم تفعيل الحساب!", "success", 4000);
        setTimeout(()=>window.location.reload(), 1200);
      });
    } else {
      showToast('Invalid code. / رمز غير صحيح.', 'error');
    }
  }).catch(err => showToast('Error: ' + err.message, 'error'));
}

// ====== AUTH: RESEND CODE ======
function resendCode(){
  if (!auth.currentUser) return;
  const userEmail = auth.currentUser.email;
  db.collection("users").doc(auth.currentUser.uid).get().then(doc => {
    if (!doc.exists) return;
    const data = doc.data();
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    return db.collection("users").doc(auth.currentUser.uid).update({ verificationCode: newCode })
      .then(() => emailjs.send('service_x7p1ujg', 'template_mp4sdd5', {
        to_name: data.displayName || 'User',
        to_email: userEmail,
        from_name: "iStore Team",
        verification_code: newCode
      }))
      .then(() => showToast("New code sent!", "success"));
  }).catch(err => showToast('Error: ' + err.message, 'error'));
}

// ====== AUTH: RELOAD VERIFICATION ======
function handleSignOut(){
  auth.signOut().then(()=>{
    localStorage.removeItem('istore_admin_test_premium');
    currentUser = null; isAdmin = false; isPublisher = false;
    userProfile = { displayName: '', avatar: '', isVerified: false };
    document.getElementById('loginView').style.display = 'block';
    document.getElementById('registerView').style.display = 'none';
    document.getElementById('verifyCodeView').style.display = 'none';
    document.getElementById('loggedInView').style.display = 'none';
    closeModal('accountModal');
   updateHeaderAccountBtn();
    applyPremiumTheme();
    renderUI();
    showToast("Signed out / تم تسجيل الخروج", "info");
  });
}
function reloadUserVerification(){
  if(currentUser){
    loadUserProfile();
    setTimeout(()=>{
      if(userProfile.isVerified){
        showToast('Account verified! / تم تفعيل الحساب', 'success');
        renderUI();
      } else {
        showToast('Still not verified / لم يتم التفعيل بعد', 'warning');
      }
    }, 1500);
  }
}
// ====== OPEN ACCOUNT MODAL ======
function openAccountModal(){
  if(currentUser){
    document.getElementById('loginView').style.display = 'none';
    document.getElementById('registerView').style.display = 'none';
    document.getElementById('verifyCodeView').style.display = 'none';
    document.getElementById('loggedInView').style.display = 'block';
  } else {
    document.getElementById('loginView').style.display = 'block';
    document.getElementById('registerView').style.display = 'none';
    document.getElementById('verifyCodeView').style.display = 'none';
    document.getElementById('loggedInView').style.display = 'none';
  }
  openModal('accountModal');
}
// ====== SECURITY: HTML Escape (حماية من XSS) ======
function escapeHTML(str){
  if(str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ====== REPORT: Set Reason Text ======
function setReportReasonText(text){
  const textarea = document.getElementById('reportReason');
  if(textarea) textarea.value = text;
}

// ====== REPORT: Submit Report ======
function submitReport(){
  const appId = document.getElementById('reportAppId').value;
  const reason = document.getElementById('reportReason').value.trim();
  if(!reason){
    showToast(currentLang==='ar'?'يرجى كتابة سبب الإبلاغ':'Please write a reason', 'warning');
    return;
  }
  if(!currentUser){
    showToast(currentLang==='ar'?'سجّل الدخول أولاً':'Sign in first', 'warning');
    openAccountModal();
    return;
  }
  db.collection("reports").add({
    appId: appId,
    reason: reason,
    user: currentUser.email,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  }).then(()=>{
    showToast(currentLang==='ar'?'تم إرسال التقرير، شكراً لك':'Report sent, thanks!', 'success', 3000);
    closeModal('reportModal');
    document.getElementById('reportReason').value = '';
  }).catch(err => showToast('Error: '+err.message, 'error'));
}

// ====== SEARCH ======
function onSearchInput(){
  const val = document.getElementById('searchInput').value;
  document.getElementById('searchClear').classList.toggle('show', val.length>0);
  renderUI();
}
function clearSearch(){
  document.getElementById('searchInput').value = '';
  document.getElementById('searchClear').classList.remove('show');
  renderUI();
}

// ====== UTILS ======
function getTrendingScore(app){
  const likes = (app.likedBy && Array.isArray(app.likedBy)) ? app.likedBy.length : 0;
  const downloads = app.downloads || 0;
  const comments = app.commentsCount || 0;
  return (likes*15) + (downloads*5) + (comments*10);
}
function getAverageRating(app){
  if(!app.ratingCount || app.ratingCount===0) return 0;
  return (app.ratingSum||0)/app.ratingCount;
}
function renderSkeleton(){
  let h = '';
  for(let i=0;i<3;i++) h += '<div class="skeleton-card"><div class="skeleton-box" style="width:62px;height:62px;border-radius:17px;flex-shrink:0;"></div><div style="flex:1;"><div class="skeleton-box" style="height:13px;width:70%;margin-bottom:10px;"></div><div class="skeleton-box" style="height:11px;width:50%;margin-bottom:8px;"></div><div class="skeleton-box" style="height:11px;width:40%;"></div></div></div>';
  return h;
}
function setFilter(f){ currentFilter = f; renderUI(); }
function getCategoryNameEn(cat){
  if(cat==='games') return currentLang === 'ar' ? 'ألعاب' : 'Games';
  if(cat==='apps') return currentLang === 'ar' ? 'تطبيقات' : 'Apps';
  if(cat==='tools') return currentLang === 'ar' ? 'أدوات' : 'Tools';
  return currentLang === 'ar' ? 'أدوات مساعدة' : 'Utilities';
}
function getActualDateString(){
  return new Date().toLocaleDateString(currentLang === 'ar' ? 'ar-SA' : 'en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
}

// ====== SWITCH TAB ======
function switchTab(tabName, btnElement){
  const container = document.getElementById('dynamicContent');
  
  // ✅ إذا كاين أنيميشن جاري، ما نبدلوش
  if (container && container.classList.contains('tab-fading')) return;
  
  // ✅ Fade out سريع (150ms)
  if (container) container.classList.add('tab-fading');
  
  // ✅ بدّل التاب فوراً (باش الزر يبان مفعّل)
  currentTab = tabName;
  document.querySelectorAll('.nav-item').forEach(el=>el.classList.remove('active'));
  if(btnElement) btnElement.classList.add('active');
  else { 
    const t = document.querySelector('.nav-item[data-tab="'+tabName+'"]'); 
    if(t) t.classList.add('active'); 
  }
  
  // ✅ سكرول للفوق
  window.scrollTo({top:0,behavior:'smooth'});
  savePrefs();
  
  // ✅ استنى شوية، بدّل المحتوى، ثم Fade in
  setTimeout(() => {
    renderUI();
    requestAnimationFrame(() => {
      if (container) container.classList.remove('tab-fading');
    });
  }, 150);
}

// ====== FAVORITES ======
function toggleFavorite(appId, event){
  if(event) event.stopPropagation();
  const idx = userFavorites.indexOf(appId);
  if(idx>-1){ userFavorites.splice(idx,1); showToast('Removed from favorites', 'info', 1500); }
  else { userFavorites.push(appId); showToast('Added to favorites', 'success', 1500); }
  savePrefs();
  updateFavBtnVisibility();
  renderUI();
}
function updateFavBtnVisibility(){
  const b = document.getElementById('favHeaderBtn');
  if(b) b.style.display = userFavorites.length>0 ? 'flex' : 'none';
}

// ====== EXTRA MENU ======
function toggleExtraMenu(appId, event){
  event.stopPropagation();
  const menu = document.getElementById('extraMenu_'+appId);
  const isOpen = menu.style.display === 'block';
  document.querySelectorAll('.extra-files-menu').forEach(m=>m.style.display='none');
  if(!isOpen) menu.style.display = 'block';
}
document.addEventListener('click', ()=>{ document.querySelectorAll('.extra-files-menu').forEach(m=>m.style.display='none'); });

// ====== ADMIN UI ======
function applyAdminUI(){
  const floatBtn = document.getElementById('adminAddFloatBtn');
  const adminNavTab = document.getElementById('adminNavTab');
  if(floatBtn) floatBtn.style.display = (isAdmin || isPublisher) ? 'flex' : 'none';
  if(adminNavTab) adminNavTab.style.display = isAdmin ? 'flex' : 'none';
  updateAvatarUI();
}
  
   // ====== TOGGLE USER PREVIEW ======
function toggleUserPreview(){
  isUserPreview = !isUserPreview;
  const user = auth.currentUser;
  if(user && ADMIN_EMAILS.map(e=>e.toLowerCase()).includes(user.email.toLowerCase())) isAdmin = !isUserPreview;
  document.getElementById('previewBar').style.display = isUserPreview ? 'flex' : 'none';
  applyAdminUI();
  updateAdminPanelBtn();
  renderUI();
}

// ====== TOGGLE ADMIN PREMIUM TEST ======
function toggleAdminPremiumTest(){
  const isCurrentlyTest = localStorage.getItem('istore_admin_test_premium') === 'true';
  const isAr = currentLang === 'ar';
  
  if(isCurrentlyTest){
    localStorage.removeItem('istore_admin_test_premium');
    showToast(
      isAr ? 'تم إيقاف وضع المعاينة' : 'Preview mode disabled',
      'info',
      2000
    );
  } else {
    localStorage.setItem('istore_admin_test_premium', 'true');
    showToast(
      isAr ? 'تم تفعيل وضع المعاينة كمشترك' : 'Premium preview mode enabled',
      'success',
      2500
    );
  }
  
   applyPremiumTheme();
  updateAvatarUI();
  renderUI();
}
  
// ====== USER PROFILE ======
function loadUserProfile(){
  if(!currentUser) return;
  db.collection("users").doc(currentUser.uid).get().then(doc=>{
    if(doc.exists){
      let data = doc.data();
      userProfile.displayName = data.displayName || currentUser.displayName || currentUser.email.split('@')[0];
      userProfile.avatar = data.avatar || currentUser.photoURL || DEFAULT_AVATAR;
      userProfile.isVerified = data.isVerified || false;
    } else {
      userProfile.displayName = currentUser.displayName || currentUser.email.split('@')[0];
      userProfile.avatar = currentUser.photoURL || DEFAULT_AVATAR;
      userProfile.isVerified = true;
      db.collection("users").doc(currentUser.uid).set({
        email: currentUser.email,
        displayName: userProfile.displayName,
        avatar: userProfile.avatar,
        isVerified: true,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      }).catch(()=>{});
    }
    updateAvatarUI();
  }).catch(err=>{
    console.warn('Profile load err:', err);
    userProfile.displayName = currentUser.displayName || currentUser.email.split('@')[0];
    userProfile.avatar = currentUser.photoURL || DEFAULT_AVATAR;
    userProfile.isVerified = true;
    updateAvatarUI();
  });
}
// ====== PREMIUM THEME ======
function applyPremiumTheme(){
  if (typeof applyTheme === 'function') {
    applyTheme(getCurrentTheme());
  }
}

function updateAvatarUI(){
  const avatarEl = document.getElementById('userAvatar');
  const nameEl = document.getElementById('userNameText');
  const emailEl = document.getElementById('userEmailText');
  const badgeEl = document.getElementById('userRoleBadge');
  const partnerBtn = document.getElementById('partnerBtn');
  if(avatarEl) avatarEl.src = userProfile.avatar || DEFAULT_AVATAR;
  if(nameEl) nameEl.innerText = userProfile.displayName || 'User';
  if(emailEl) emailEl.innerText = currentUser ? currentUser.email : '';
if(badgeEl){
    const isSubscribed = localStorage.getItem('istore_subscribed') === 'true';
    const isAdminTestPremium = localStorage.getItem('istore_admin_test_premium') === 'true';
    
    if(isAdmin && isAdminTestPremium){
      badgeEl.className = 'profile-badge premium';
      badgeEl.innerHTML = '<svg viewBox="0 0 24 24" fill="#fff"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> ' + (currentLang==='ar'?'مشترك مميز (تجربة)':'Premium Subscriber (Test)');
    } else if(isSubscribed){
      badgeEl.className = 'profile-badge premium';
      badgeEl.innerHTML = '<svg viewBox="0 0 24 24" fill="#fff"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> ' + (currentLang==='ar'?'مشترك مميز':'Premium Subscriber');
    } else if(isAdmin){
      badgeEl.className = 'profile-badge admin';
      badgeEl.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 7l4 4 5-7 5 7 4-4v12H3V7z"/></svg> ' + (currentLang==='ar'?'مدير':'Administrator');
    } else if(isPublisher){
      badgeEl.className = 'profile-badge publisher';
      badgeEl.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg> ' + (currentLang==='ar'?'ناشر معتمد':'Verified Publisher');
    } else {
      let pending = allPublisherRequests.find(r => r.uid === (currentUser ? currentUser.uid : '') && r.status === 'pending');
      if(pending){
        badgeEl.className = 'profile-badge pending';
        badgeEl.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> ' + (currentLang==='ar'?'قيد المراجعة':'Pending Review');
      } else {
        badgeEl.className = 'profile-badge user';
        badgeEl.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> ' + (currentLang==='ar'?'مستخدم':'User');
      }
    }
  }
  if(partnerBtn){
    if(isAdmin){
      partnerBtn.classList.add('disabled');
      partnerBtn.querySelector('span').innerText = currentLang==='ar'?'مدير':'Administrator';
      partnerBtn.onclick = null;
    } else if(isPublisher){
      partnerBtn.classList.add('disabled');
      partnerBtn.querySelector('span').innerText = currentLang==='ar'?'أنت ناشر ✓':'You are a Publisher ✓';
      partnerBtn.onclick = null;
    } else {
      let pending = allPublisherRequests.find(r => r.uid === (currentUser ? currentUser.uid : '') && r.status === 'pending');
      if(pending){
        partnerBtn.classList.add('disabled');
        partnerBtn.querySelector('span').innerText = currentLang==='ar'?'الطلب قيد المراجعة...':'Application Pending...';
        partnerBtn.onclick = null;
      } else {
        partnerBtn.classList.remove('disabled');
        partnerBtn.querySelector('span').innerText = currentLang==='ar'?'التقديم كناشر':'Apply as Publisher';
        partnerBtn.onclick = openPartnerRequest;
      }
    }
  }
  updateHeaderAccountBtn();
}
/* ============================================
   📥 DOWNLOAD — Wi-Fi Only + Auto-download
   ============================================ */

/* التحقق من نوع الاتصال */
function _getConnectionInfo() {
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (!conn) {
    // ما كاينش معلومات — نفترضو أنو غير WiFi (احتياطي)
    return { type: 'unknown', isWiFi: false, hasInfo: false };
  }
  const type = conn.type || conn.effectiveType || 'unknown';
  const isWiFi = (type === 'wifi' || type === 'ethernet' || conn.effectiveType === '4g' && type !== 'cellular');
  return { type, isWiFi: type === 'wifi', hasInfo: true };
}

/* التحقق من Wi-Fi قبل التحميل */
async function _checkWiFiBeforeDownload() {
  // إذا الإعداد ماشي مفعّل → ما نتحققوش
  if (!appSettings.wifiOnly) return true;
  
  const conn = _getConnectionInfo();
  
  // إذا ما عندناش معلومات → نفترضو أنو شبكة عادية (warn)
  if (!conn.hasInfo) {
    const confirmed = await showIOSConfirm({
      type: 'warning',
      icon: 'wifi',
      title: currentLang === 'ar' 
        ? 'Wi-Fi Only مفعّل' 
        : 'Wi-Fi Only is on',
      message: currentLang === 'ar'
        ? 'ما قدرناش نتحققو من نوع الشبكة. هل تريد المتابعة بأي حال؟'
        : 'We couldn\'t detect your network type. Continue anyway?',
      okText: currentLang === 'ar' ? 'متابعة' : 'Continue',
      cancelText: currentLang === 'ar' ? 'إلغاء' : 'Cancel'
    });
    return confirmed;
  }
  
  // (` إذا WiFi → OK
  if (conn.isWiFi) return true;
  
  // إذا ماشي WiFi → نسقسوه
  const confirmed = await showIOSConfirm({
    type: 'warning',
    icon: 'wifi',
    title: currentLang === 'ar' 
      ? 'أنت ماشي على Wi-Fi' 
      : 'Not on Wi-Fi',
    message: currentLang === 'ar'
      ? 'Wi-Fi Only مفعّل في الإعدادات. هل تريد المتابعة بأي حال؟'
      : 'Wi-Fi Only is enabled. Continue anyway?',
    okText: currentLang === 'ar' ? 'متابعة' : 'Continue',
    cancelText: currentLang === 'ar' ? 'إلغاء' : 'Cancel'
  });
  
  return confirmed;
}

/* التحميل الفعلي */
async function startRealDownload(appId, fileUrl, appName) {
  const app = allAppsCache.find(a => a.id === appId);
  const isOfficial = app && app.appType === 'official';
  const hasLink = !!(fileUrl && fileUrl !== '#' && fileUrl.trim() !== '');
  
  // ✅ 1. تحقق Wi-Fi Only
  const wifiOk = await _checkWiFiBeforeDownload();
  if (!wifiOk) {
    showToast(
      currentLang === 'ar'
        ? 'تم إلغاء التحميل (Wi-Fi Only)'
        : 'Download cancelled (Wi-Fi Only)',
      'info', 2500
    );
    return;
  }
  
  // ✅ 2. Auto-download
  const autoDownload = appSettings.autoDownload !== false;
  
  if (isOfficial) {
    // التطبيقات الرسمية تفتح المتجر الرسمي
    showDownloadNotif(appName, 3000, fileUrl, true, appId);
    if (hasLink) {
      setTimeout(() => window.open(fileUrl, '_blank'), autoDownload ? 1500 : 3000);
    }
    return;
  }
  
  // التطبيقات المعدلة
  if (autoDownload) {
    // ✅ Auto → يبدأ فوراً
    showDownloadNotif(appName, 3000, fileUrl, false, appId);
    if (hasLink) {
      incrementDownload(appId);
      setTimeout(() => {
        window.open(fileUrl, '_blank', 'noopener,noreferrer');
      }, 1500);
    }
  } else {
    // ⚠️ Auto OFF → نسقسوه قبل
    if (!hasLink) {
      showToast(
        currentLang === 'ar' ? 'ما كاينش رابط تحميل' : 'No download link',
        'warning', 2500
      );
      return;
    }
    
    const userConfirmed = confirm(
      currentLang === 'ar'
        ? 'هل تريد فتح رابط التحميل؟\n\n' + (appName || '')
        : 'Open download link?\n\n' + (appName || '')
    );
    
    if (!userConfirmed) {
      showToast(
        currentLang === 'ar' ? 'تم إلغاء التحميل' : 'Download cancelled',
        'info', 1800
      );
      return;
    }
    
    showDownloadNotif(appName, 3000, fileUrl, false, appId);
    incrementDownload(appId);
    setTimeout(() => {
      window.open(fileUrl, '_blank', 'noopener,noreferrer');
    }, 1500);
  }
}
// ====== DOWNLOAD COUNTER ======
function incrementDownload(appId){
  const userId = currentUser ? currentUser.email : 'guest_'+Math.random().toString(36).substring(7);
  const appRef = db.collection("apps").doc(appId);
  db.runTransaction(transaction=>{
    return transaction.get(appRef).then(doc=>{
      if(!doc.exists) return;
      let data = doc.data();
      let downloadedBy = data.downloadedBy || [];
      if(!downloadedBy.includes(userId)){
        downloadedBy.push(userId);
        transaction.update(appRef, {downloads: firebase.firestore.FieldValue.increment(1), downloadedBy: downloadedBy});
      }
    });
  }).catch(()=>{});
}

// ====== LIKE ======
function toggleStarLike(appId, event){
  if(event) event.stopPropagation();
  if(!requireVerifiedEmail()) return;
  if(!currentUser){ showToast('Please sign in to like', 'warning'); openAccountModal(); return; }
  const appRef = db.collection("apps").doc(appId);
  const userEmail = currentUser.email;
  db.runTransaction(transaction=>{
    return transaction.get(appRef).then(doc=>{
      if(!doc.exists) return;
      let data = doc.data();
      let likedBy = data.likedBy || [];
      if(likedBy.includes(userEmail)){ likedBy = likedBy.filter(e=>e!==userEmail); showToast('Like removed', 'info', 1500); }
      else { likedBy.push(userEmail); showToast('App liked!', 'success', 1500); }
      transaction.update(appRef, {likedBy: likedBy});
    });
  }).catch(err=>showToast('Error: '+err.message, 'error'));
}

// ====== SHARE ======
function shareApp(appId, event){
  if(event) event.stopPropagation();
  const app = allAppsCache.find(a=>a.id===appId);
  if(!app) return;

  // 🔗 رابط مباشر لصفحة التطبيق داخل الموقع
const shareUrl = 'https://ipa-store.onrender.com/app/' + appId;

  const shareText = (currentLang === 'ar'
    ? 'شاهد ' + app.name + ' على متجر iStore!'
    : 'Check out ' + app.name + ' on iStore!');

  
  const shareData = {
    title: app.name,
    text: shareText,
    url: shareUrl
  };

  // ✅ 1. Web Share API (أفضل حل - يخلي المستخدم يختار التطبيق)
  if(navigator.share) {
    navigator.share(shareData).catch(()=>{});
    return;
  }

  // ✅ 2. نسخ الرابط للحافظة
  const copyFallback = () => {
    const textToCopy = shareText + '\n' + shareUrl;
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(textToCopy)
        .then(()=>showToast(currentLang==='ar'?' تم نسخ رابط التطبيق':'App link copied', 'success', 2000))
        .catch(()=>legacyCopy(textToCopy));
    } else {
      legacyCopy(textToCopy);
    }
  };

  const legacyCopy = (text) => {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      showToast(currentLang==='ar'?'تم نسخ رابط التطبيق':' App link copied', 'success', 2000);
    } catch(e){
      showToast('Could not share', 'error');
    }
    document.body.removeChild(ta);
  };

  copyFallback();
}
// ====== RATING ======
function setRating(appId, value){
  if(!requireVerifiedEmail()) return;
  if(!currentUser){ showToast('Sign in to rate', 'warning'); openAccountModal(); return; }
  const app = allAppsCache.find(a=>a.id===appId);
  if(!app) return;
  const userRatings = app.userRatings || {};
  const oldRating = userRatings[currentUser.email] || 0;
  const appRef = db.collection("apps").doc(appId);
  let newSum = (app.ratingSum||0) - oldRating + value;
  let newCount = (app.ratingCount||0) - (oldRating>0?1:0) + 1;
  userRatings[currentUser.email] = value;
  appRef.update({ratingSum: newSum, ratingCount: newCount, ratingAvg: newSum/newCount, userRatings: userRatings}).then(()=>{
    showToast('Thanks for rating!', 'success', 1500);
    openAppDetails(appId);
  }).catch(err=>showToast('Error: '+err.message, 'error'));
}
  // ====== APP DETAILS MODAL (محسّن) ======
function openAppDetails(appId){
  const app = allAppsCache.find(a=>a.id===appId);
  if(!app) return;
  let screenshotsHTML = '';
  if(app.screenshots && app.screenshots.length>0){
    app.screenshots.forEach(imgUrl=>{ screenshotsHTML += '<img src="'+imgUrl+'" class="screenshot-item" loading="lazy" onclick="openImgViewer(\''+imgUrl+'\')">'; });
  } else screenshotsHTML = '<p style="color:var(--subtext-color);font-size:12px;">'+(currentLang==='ar'?'لا توجد لقطات':'No screenshots available.')+'</p>';
  db.collection("apps").doc(appId).collection("comments").orderBy("createdAt","desc").get().then(snapshot=>{
    let commentsList = [];
    snapshot.forEach(doc=>commentsList.push({id:doc.id, ...doc.data()}));
    let commentsHTML = '';
    if(commentsList.length===0) commentsHTML = '<p style="color:var(--subtext-color);font-size:13px;text-align:center;padding:10px;">'+(currentLang==='ar'?'لا توجد تعليقات بعد':'No comments yet.')+'</p>';
    else commentsList.forEach(c=>{
commentsHTML += '<div class="comment-box" id="comment_'+c.id+'">'+
  '<div style="width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--accent2));display:flex;align-items:center;justify-content:center;color:#fff;font-weight:900;font-size:16px;flex-shrink:0;">'+c.userName.charAt(0).toUpperCase()+'</div>'+
'<div style="flex:1;min-width:0;">'+
    '<div class="comment-user">'+escapeHTML(c.userName)+'</div>'+
    '<div class="comment-text">'+escapeHTML(c.text)+'</div>'+
  '</div>'+
  '<div style="display:flex;gap:4px;flex-shrink:0;">'+
    (currentUser && currentUser.email !== c.userEmail ? 
      '<button onclick="openCommentReport(\''+app.id+'\',\''+c.id+'\',\''+c.userName+'\')" title="Report" style="background:rgba(255,159,10,0.1);border:1px solid rgba(255,159,10,0.3);color:var(--warning);padding:6px 9px;border-radius:8px;cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;">'+
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>'+
      '</button>' 
      : '')+
    (isAdmin?'<button onclick="deleteComment(\''+app.id+'\',\''+c.id+'\')" style="background:rgba(255,69,58,0.15);color:var(--danger);border:1px solid rgba(255,69,58,0.3);padding:6px 9px;border-radius:8px;cursor:pointer;font-weight:800;font-family:inherit;display:flex;align-items:center;justify-content:center;">'+
     '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'+
    '</button>':'')+
  '</div>'+
'</div>';
    });
    let pubText = app.publisher ? '<div style="color:var(--accent);font-size:12px;font-weight:700;margin-bottom:8px;display:flex;align-items:center;gap:5px;">'+ICONS.infoCircle+' '+app.publisher+'</div>' : '';
    let userRating = (app.userRatings && currentUser) ? (app.userRatings[currentUser.email]||0) : 0;
    let ratingAvg = getAverageRating(app);
    let isFav = userFavorites.includes(app.id);
    let starsHTML = '';
    for(let i=1;i<=5;i++) starsHTML += '<button class="star-btn '+(i<=userRating?'active':'')+'" onclick="setRating(\''+app.id+'\','+i+')"><svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></button>';
    // ✅ حذف التكرار: تطبيق واحد لكل منصة (IPA + APK)
let similarRaw = allAppsCache.filter(a => a.category === app.category && a.id !== app.id);
let seen = {};
let similarApps = [];
similarRaw.forEach(a => {
  let key = (a.name || '').toLowerCase() + '|' + (a.platform || 'IPA');
  if (!seen[key]) {
    seen[key] = true;
    similarApps.push(a);
  }
});
// ✅ خلط عشوائي
for(let i = similarApps.length - 1; i > 0; i--){
  const j = Math.floor(Math.random() * (i + 1));
  [similarApps[i], similarApps[j]] = [similarApps[j], similarApps[i]];
}
similarApps = similarApps.slice(0, 6);
    let similarHTML = '';
    if(similarApps.length>0){
      similarHTML = '<div class="detail-section"><h4 class="detail-section-title">'+ICONS.starFill+' '+(currentLang==='ar'?'قد يعجبك أيضاً':'You might also like')+'</h4><div class="similar-apps-container">'+similarApps.map(s=>'<div class="similar-app-card" onclick="closeModal(\'appDetailModal\');setTimeout(()=>openAppDetails(\''+s.id+'\'),300);"><img src="'+(s.icon||FALLBACK_ICON)+'" onerror="this.src=\''+FALLBACK_ICON+'\'"><h5>'+s.name+'</h5><p>'+(s.size||'N/A')+' • '+(s.platform||'IPA')+'</p></div>').join('')+'</div></div>';
    }
    document.getElementById('appDetailBody').innerHTML = 
      '<div style="width:50px;height:5px;background:var(--border-color);border-radius:10px;margin:0 auto 18px auto;"></div>'+
     '<div class="detail-banner'+(app.banner?'':' no-image')+'"'+
' style="background-image:url(\''+(app.banner || app.icon || FALLBACK_ICON)+'\')">'+
  '<button onclick="toggleFavorite(\''+app.id+'\',event)" class="detail-fav-btn" style="color:'+(isFav?'#ff453a':'#fff')+';">'+(isFav?ICONS.heartFill:ICONS.heart)+'</button>'+
'</div>'+
'<div class="detail-hero">'+
  '<div class="detail-header-row">'+
    '<img src="'+(app.icon||FALLBACK_ICON)+'" class="detail-icon" onerror="this.src=\''+FALLBACK_ICON+'\'">'+
    '<div class="detail-title-block">'+
     '<h3 class="detail-title">'+escapeHTML(app.name)+'</h3>'+
      getPublisherHTML(app.publisher, {fontSize:'12px', marginTop:'0', iconSize:14})+
      '<div class="detail-meta">'+
        '<span class="detail-chip danger">'+(app.platform||'IPA')+'</span>'+
        '<span class="detail-chip">'+getCategoryNameEn(app.category)+'</span>'+
        '<span class="detail-chip">'+ICONS.download+' '+(app.size||'N/A')+'</span>'+
      '</div>'+
    '</div>'+
        '</div>'+
'</div>'+
'<div style="padding:0 22px;">'+
  
      '<div style="display:flex;gap:8px;margin-bottom:16px;">'+
        '<div style="flex:1;background:var(--input-bg);border:1px solid var(--border-color);border-radius:14px;padding:12px;text-align:center;">'+
          '<div style="font-size:11px;color:var(--subtext-color);font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;">'+(currentLang==='ar'?'التحميلات':'Downloads')+'</div>'+
          '<div style="font-size:18px;font-weight:900;color:var(--success);">'+(app.downloads||0)+'</div>'+
        '</div>'+
        '<div style="flex:1;background:var(--input-bg);border:1px solid var(--border-color);border-radius:14px;padding:12px;text-align:center;">'+
          '<div style="font-size:11px;color:var(--subtext-color);font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;">'+(currentLang==='ar'?'الإعجابات':'Likes')+'</div>'+
          '<div style="font-size:18px;font-weight:900;color:var(--warning);">'+((app.likedBy&&app.likedBy.length)||0)+'</div>'+
        '</div>'+
        '<div style="flex:1;background:var(--input-bg);border:1px solid var(--border-color);border-radius:14px;padding:12px;text-align:center;">'+
          '<div style="font-size:11px;color:var(--subtext-color);font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;">'+(currentLang==='ar'?'التقييم':'Rating')+'</div>'+
          '<div style="font-size:18px;font-weight:900;color:var(--accent);">'+(ratingAvg>0?ratingAvg.toFixed(1):'—')+'</div>'+
        '</div>'+
      '</div>'+
      '<button class="btn-download-hero" onclick="startRealDownload(\''+app.id+'\',\''+app.url+'\',\''+app.name+'\')">'+
        '<div class="hero-icon">'+ICONS.dlBig+'</div>'+
        '<div class="hero-text"><span class="hero-title">'+(currentLang==='ar'?'تحميل الآن':'Download Now')+'</span><span class="hero-sub">'+(app.size||'N/A')+' • '+(app.platform||'IPA')+'</span></div>'+
       '<div class="hero-arrow">'+
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">'+
    '<line x1="5" y1="12" x2="19" y2="12"/>'+
    '<polyline points="12 5 19 12 12 19"/>'+
  '</svg>'+
'</div>'+
      '</button>'+

    '<button class="btn-share-link" onclick="shareApp(\''+app.id+'\', event)">'+
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>'+
  '<span>'+(currentLang==='ar'?'مشاركة الرابط':'Share Link')+'</span>'+
'</button>'+
      '<div class="detail-section">'+
        '<h4 class="detail-section-title">'+ICONS.starFill+' '+(currentLang==='ar'?'التقييم':'Rating')+'</h4>'+
        '<div class="rating-summary"><span>'+(app.ratingCount?(app.ratingCount+(currentLang==='ar'?' تقييم':' ratings')):(currentLang==='ar'?'لا توجد تقييمات':'No ratings'))+'</span><span class="rating-value">'+ICONS.starFill+' '+(ratingAvg>0?ratingAvg.toFixed(1):'—')+'</span></div>'+
   '<div class="star-rating">'+
  (function(){
    let displayStars = '';
    const avgRounded = Math.round(ratingAvg);
    for(let i=1;i<=5;i++){
      const isFilled = i <= avgRounded;
      displayStars += '<span style="font-size:30px;color:'+(isFilled?'#ffd60a':'var(--border-color)')+';">★</span>';
    }
    return displayStars;
  })()+
'</div>'+
        (userRating>0?'<p style="margin:6px 0 0 0;font-size:11px;color:var(--subtext-color);text-align:center;">'+(currentLang==='ar'?'تقييمك: ':'You rated: ')+userRating+'/5</p>':'')+
      '</div>'+
      '<div class="detail-section">'+
        '<h4 class="detail-section-title">'+ICONS.infoCircle+' '+(currentLang==='ar'?'معلومات التطبيق':'App Info')+'</h4>'+
   '<p class="detail-info-text" id="appInfoText" style="display:-webkit-box;-webkit-line-clamp:5;-webkit-box-orient:vertical;overflow:hidden;line-height:1.6;">'+escapeHTML(app.info||app.desc||(currentLang==='ar'?'لا توجد معلومات إضافية.':'No additional info available.'))+'</p>'+
((app.info && app.info.length > 200) ? 
  '<button onclick="toggleAppInfo()" id="readMoreBtn" style="background:transparent;border:none;color:var(--accent);font-weight:800;font-size:12px;cursor:pointer;padding:8px 0;font-family:inherit;display:flex;align-items:center;gap:4px;">'+
  (currentLang==='ar'?'اقرأ المزيد ↓':'Read more ↓')+
  '</button>' : '')+
      '</div>'+
      '<div class="detail-section">'+
        '<h4 class="detail-section-title">'+(currentLang==='ar'?'لقطات الشاشة':'Screenshots')+'</h4>'+
        '<div class="screenshots-container">'+screenshotsHTML+'</div>'+
      '</div>'+
      similarHTML+
    
      '<div class="detail-section">'+
        '<h4 class="detail-section-title">'+(currentLang==='ar'?'التعليقات':'Comments')+' ('+commentsList.length+')</h4>'+
        '<div style="max-height:200px;overflow-y:auto;margin-bottom:12px;">'+commentsHTML+'</div>'+
        (currentUser?'<input type="text" id="newCommentText" class="input-field" placeholder="'+(currentLang==='ar'?'اكتب تعليقاً...':'Write a comment...')+'"><button onclick="postComment(\''+app.id+'\')" class="btn-primary" style="padding:11px;font-size:13px;">'+(currentLang==='ar'?'نشر التعليق':'Post Comment')+'</button>':'<p style="color:var(--danger);font-size:12px;text-align:center;padding:10px;">'+(currentLang==='ar'?'سجّل الدخول للتعليق':'Sign in to comment.')+'</p>')+
      '</div>'+
'<button onclick="closeModal(\'appDetailModal\')" class="detail-close-btn" aria-label="Close">'+
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">'+
    '<path d="M15 19l-7-7 7-7"/>'+
  '</svg>'+
'</button>'
    // سد البحث إلا كان مفتوح
    const searchOv = document.getElementById('searchOverlay');
    if (searchOv && searchOv.classList.contains('open')) {
      closeSearchOverlay();
    }document.getElementById('appDetailModal').style.display = 'flex';
   document.querySelector('.bottom-sheet-content').scrollTop = 0;
  }).catch(err=>{ console.warn('Comments err:',err); });
}

function deleteComment(appId, commentId){
  if(!isAdmin) return;
  if(confirm('Delete this comment?')){
    db.collection("apps").doc(appId).collection("comments").doc(commentId).delete().then(()=>{
      db.collection("apps").doc(appId).update({commentsCount: firebase.firestore.FieldValue.increment(-1)}).catch(()=>{});
      showToast('Comment deleted', 'success');
      openAppDetails(appId);
    });
  }
}
// ====== قراءة المزيد من معلومات التطبيق ======
function toggleAppInfo(){
  const el = document.getElementById('appInfoText');
  const btn = document.getElementById('readMoreBtn');
  if(!el || !btn) return;
  
  const isExpanded = el.style.webkitLineClamp === 'unset' || el.style.webkitLineClamp === 'none';
  
  if(isExpanded){
    el.style.webkitLineClamp = '5';
    btn.innerHTML = (currentLang === 'ar' ? 'اقرأ المزيد ↓' : 'Read more ↓');
  } else {
    el.style.webkitLineClamp = 'none';
    btn.innerHTML = (currentLang === 'ar' ? 'عرض أقل ↑' : 'Show less ↑');
  }
}
function postComment(appId){
  if(!requireVerifiedEmail()) return;
  if(!currentUser){ showToast('Sign in first', 'warning'); return; }
  const text = document.getElementById('newCommentText').value.trim();
  if(!text) return;
  db.collection("apps").doc(appId).collection("comments").add({
    userName: (userProfile.displayName || currentUser.email.split('@')[0]), 
    userEmail: currentUser.email,
    text: text, 
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  }).then(()=>{
    db.collection("apps").doc(appId).update({commentsCount: firebase.firestore.FieldValue.increment(1)}).catch(()=>{});
    showToast('Comment posted', 'success', 1500);
    document.getElementById('newCommentText').value = '';
    openAppDetails(appId);
  });
}

// ====== REPORT ======
function openReportModal(appId){
  console.log('🔍 Report button clicked, appId:', appId);
  const modal = document.getElementById('reportModal');
  if(!modal){
    alert('خطأ: modal الإبلاغ ماشي موجود!');
    return;
  }
  document.getElementById('reportAppId').value = appId;
  document.getElementById('reportReason').value = '';
  modal.style.display = 'flex';
  console.log('✅ Modal opened successfully');
}
function deleteReport(reportId){
  if(!isAdmin) return;
  if(confirm('Delete this report?')){
    db.collection("reports").doc(reportId).delete();
    showToast('Report resolved', 'success');
  }
}

// ====== SETTINGS ======
function openSettings(){
  document.getElementById('settingDarkMode').classList.toggle('on', isLightMode);
  document.getElementById('settingNotifications').classList.toggle('on', appSettings.notifications);
  document.getElementById('settingAutoDownload').classList.toggle('on', appSettings.autoDownload);
  document.getElementById('settingFontSize').value = appSettings.fontSize || 'medium';
  openModal('settingsModal');
}

function saveSettings(){ 
  try{ 
    localStorage.setItem('istore_app_settings', JSON.stringify(appSettings)); 
    console.log(' Settings saved:', appSettings);
  }catch(e){
    console.warn('saveSettings error:', e);
  } 
}

function changeFontSize(size){
  appSettings.fontSize = size;
  saveSettings();
  applyFontSize(size);
  showToast('Font size: ' + size, 'info', 1500);
}
function applyFontSize(size){
  // 🎯 خريطة الأحجام
  const sizes = {
    small:  '13px',
    medium: '15px',
    large:  '17px'
  };
  const value = sizes[size] || '15px';
  
  // 🎯 الطريقة 2: نبدلو المتغير في :root
  document.documentElement.style.setProperty('--font-size-base', value);
  
  // Fallback: نضمنو أن body يتحدث تلقائياً
  document.body.style.fontSize = value;
}
async function clearAppCache(){
  const confirmed = await showIOSConfirm({
    type: 'danger',
    icon: 'trash',
    title: currentLang==='ar'?'مسح البيانات المؤقتة':'Clear Cache',
    message: currentLang==='ar'
      ? 'سيتم مسح البيانات المؤقتة والإعدادات. هل تريد المتابعة؟'
      : 'Cache and settings will be cleared. Continue?',
    okText: currentLang==='ar'?'مسح':'Clear',
    cancelText: currentLang==='ar'?'إلغاء':'Cancel'
  });
  
  if(!confirmed) return;
  
  try{
    localStorage.removeItem('istore_prefs');
    localStorage.removeItem('istore_app_settings');
    showToast(
      currentLang==='ar'?'تم المسح، جاري التحديث...':'Cache cleared. Reloading...',
      'success'
    );
    setTimeout(()=>{ auth.signOut().then(()=>{ window.location.reload(); }); }, 1200);
  }catch(e){ 
    showToast('Error clearing cache', 'error'); 
  }
}

// ====== EDIT PROFILE ======
function openEditProfile(){
  if(!currentUser) return;
  document.getElementById('editDisplayName').value = userProfile.displayName || '';
  document.getElementById('editAvatarPreview').src = userProfile.avatar || DEFAULT_AVATAR;
  document.getElementById('avatarFileInput').value = '';
  pendingAvatarData = '';
  openModal('editProfileModal');
}
function previewAvatar(event){
  const file = event.target.files[0];
  if(!file) return;
  if(file.size > 800 * 1024){ showToast('Image too large (max 800KB)', 'warning'); return; }
  const reader = new FileReader();
  reader.onload = function(e){
    pendingAvatarData = e.target.result;
    document.getElementById('editAvatarPreview').src = e.target.result;
  };
  reader.readAsDataURL(file);
}
function saveProfile(){
  if(!currentUser) return;
  const newName = document.getElementById('editDisplayName').value.trim();
  if(!newName){ showToast('Please enter a name', 'warning'); return; }
  if(newName.length > 30){ showToast('Name too long (max 30)', 'warning'); return; }
  let updateData = { displayName: newName };
  if(pendingAvatarData) updateData.avatar = pendingAvatarData;
  db.collection("users").doc(currentUser.uid).set(updateData, {merge: true}).then(()=>{
    userProfile.displayName = newName;
    if(pendingAvatarData) userProfile.avatar = pendingAvatarData;
    pendingAvatarData = '';
    updateAvatarUI();
    showToast('Profile updated! / تم تحديث الملف', 'success');
    closeModal('editProfileModal');
  }).catch(err=>showToast('Error: '+err.message, 'error'));
}

// ====== PARTNER REQUEST ======
function openPartnerRequest(){
  if(!requireVerifiedEmail()) return;
  if(!currentUser){ showToast('Please sign in first', 'warning'); return; }
  if(isAdmin){ showToast('Administrators cannot apply', 'info'); return; }
  if(isPublisher){ showToast('You are already a publisher!', 'info'); return; }
  let pending = allPublisherRequests.find(r => r.uid === currentUser.uid && r.status === 'pending');
  if(pending){ showToast('You already have a pending application', 'info'); return; }
  document.getElementById('partnerReason').value = '';
  openModal('partnerRequestModal');
}
function submitPartnerRequest(){
  if(!requireVerifiedEmail()) return;
  if(!currentUser) return;
  const reason = document.getElementById('partnerReason').value.trim();
  if(!reason || reason.length < 10){ showToast('Please write at least 10 characters', 'warning'); return; }
  db.collection("publisher_requests").add({
    uid: currentUser.uid,
    email: currentUser.email,
    displayName: userProfile.displayName || currentUser.email.split('@')[0],
    avatar: userProfile.avatar || '',
    reason: reason,
    status: 'pending',
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  }).then(()=>{
    showToast('Application submitted! / تم إرسال الطلب!', 'success', 3500);
    closeModal('partnerRequestModal');
    closeModal('accountModal');
    updateAvatarUI();
  }).catch(err=>showToast('Error: '+err.message, 'error'));
}
function approvePublisher(requestId, email){
  if(!isAdmin) return;
  if(!confirm('Approve '+email+' as Publisher?')) return;
  db.collection("publishers").doc(email.toLowerCase()).set({
    email: email.toLowerCase(),
    approvedBy: currentUser ? currentUser.email : 'unknown',
    approvedAt: firebase.firestore.FieldValue.serverTimestamp()
  }).then(()=>{
    return db.collection("publisher_requests").doc(requestId).update({ status: 'approved' });
  }).then(()=>{
    showToast('Publisher approved!', 'success', 3000);
  }).catch(err=>showToast('Error: '+err.message, 'error'));
}
function rejectPublisher(requestId){
  if(!isAdmin) return;
  if(!confirm('Reject this application?')) return;
  db.collection("publisher_requests").doc(requestId).update({
    status: 'rejected',
    rejectedBy: currentUser ? currentUser.email : 'unknown',
    rejectedAt: firebase.firestore.FieldValue.serverTimestamp()
  }).then(()=>{ showToast('Application rejected', 'info'); }).catch(err=>showToast('Error: '+err.message, 'error'));
}

// ====== FIREBASE LISTENERS ======
db.collection("apps").orderBy("createdAt","desc").onSnapshot(snapshot=>{
  allAppsCache = [];
  snapshot.forEach(doc=>{
    let data = doc.data();
    if(data.name && data.name.toLowerCase().includes("gta") && data.category !== "games") data.category = "games";
    allAppsCache.push({id:doc.id, ...data});
  });
  renderUI();
}, err=>{ console.warn('Apps err:',err); });
db.collection("reports").orderBy("createdAt","desc").onSnapshot(snapshot=>{
  allReportsCache = [];
  snapshot.forEach(doc=>allReportsCache.push({id:doc.id, ...doc.data()}));
  if(currentTab === 'admin_panel') renderUI();
}, err=>{ console.warn('Reports err:',err); });

db.collection("comment_reports").orderBy("createdAt","desc").onSnapshot(snapshot=>{
  allCommentReportsCache = [];
  snapshot.forEach(doc=>allCommentReportsCache.push({id:doc.id, ...doc.data()}));
  if(currentTab === 'admin_panel') renderUI();
}, err=>{ console.warn('Comment reports err:',err); });

db.collection("publisher_requests").orderBy("createdAt","desc").onSnapshot(snapshot=>{
  allPublisherRequests = [];
  snapshot.forEach(doc=>allPublisherRequests.push({id:doc.id, ...doc.data()}));
  if(currentTab === 'admin_panel') renderUI();
  updateAvatarUI();
}, err=>{ console.warn('Publisher requests err:',err); });
// ====== RENDER UI ======
function renderUI(){
  const container = document.getElementById('dynamicContent');
  const searchInputEl = document.getElementById('searchInput');
  const searchQuery = searchInputEl ? searchInputEl.value.toLowerCase().trim() : '';

  let uniqueApps = [];
  let groupedByName = {};
  allAppsCache.forEach(app => {
    if (!groupedByName[app.name]) groupedByName[app.name] = [];
    groupedByName[app.name].push(app);
  });
  Object.keys(groupedByName).forEach(name => {
    let versions = groupedByName[name];
    if (versions.length === 1) uniqueApps.push(versions[0]);
    else uniqueApps.push(versions[Math.floor(Math.random() * versions.length)]);
  });
  uniqueApps.sort((a,b) => {
    let timeA = a.createdAt ? a.createdAt.seconds : 0;
    let timeB = b.createdAt ? b.createdAt.seconds : 0;
    return timeB - timeA;
  });

  if(searchQuery !== ""){
    let filtered = uniqueApps.filter(app => (app.name&&app.name.toLowerCase().includes(searchQuery)) || (app.info&&app.info.toLowerCase().includes(searchQuery)) || (app.publisher&&app.publisher.toLowerCase().includes(searchQuery)));
    let list = filtered;
    if(currentFilter === 'IPA' || currentFilter === 'APK') list = filtered.filter(a=>(a.platform||'IPA')===currentFilter);
    else if(currentFilter !== 'all') list = filtered.filter(a=>a.category===currentFilter);
    container.innerHTML = `<div class="filter-chips">
      <button class="chip ${currentFilter==='all'?'active':''}" onclick="setFilter('all')">${currentLang==='ar'?'الكل':'All'} (${filtered.length})</button>
      <button class="chip ${currentFilter==='IPA'?'active':''}" onclick="setFilter('IPA')">iOS</button>
      <button class="chip ${currentFilter==='APK'?'active':''}" onclick="setFilter('APK')">Android</button>
    </div><div class="section-heading">${currentLang==='ar'?'نتائج البحث':'Search Results'} (${list.length})</div><div id="searchResContainer"></div>`;
    const sc = document.getElementById('searchResContainer');
    if(list.length===0) sc.innerHTML = `<p style="color:var(--subtext-color);text-align:center;font-size:13px;margin-top:30px;">${currentLang==='ar'?'لا توجد نتائج':'No matching apps found.'}</p>`;
    else list.forEach(app=>sc.innerHTML += createAppCardHTML(app));
    return;
  }

  if(currentTab === 'favorites'){
    const favApps = uniqueApps.filter(a=>userFavorites.includes(a.id));
    container.innerHTML = `<div class="today-header"><div class="today-title">${currentLang==='ar'?'المفضلة':'My Favorites'}</div><div class="today-subtitle">${currentLang==='ar'?'تطبيقاتك المحفوظة':'Your saved apps'}</div></div><div id="favContainer" style="margin-top:15px;"></div>`;
    const fc = document.getElementById('favContainer');
    if(favApps.length===0) fc.innerHTML = `<div class="fav-empty"><svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg><p style="font-size:14px;font-weight:700;margin:0 0 5px 0;color:var(--text-color);">${currentLang==='ar'?'لا توجد مفضلة بعد':'No favorites yet'}</p><p style="font-size:12px;">${currentLang==='ar'?'اضغط على القلب لحفظ أي تطبيق':'Tap the heart on any app to save it'}</p></div>`;
    else favApps.forEach(app=>fc.innerHTML += createAppCardHTML(app));
    return;
  }
if(currentTab === 'admin_panel' && isAdmin){
    let totalApps = allAppsCache.length;
    let totalReports = allReportsCache.length;
    let totalDownloads = allAppsCache.reduce((s,a)=>s+(a.downloads||0),0);
    let totalLikes = allAppsCache.reduce((s,a)=>s+((a.likedBy&&a.likedBy.length)||0),0);
    let pendingPublishers = allPublisherRequests.filter(r=>r.status === 'pending').length;
    let totalCommentReports = allCommentReportsCache.length;

    let commentReportsHTML = "";
    if(totalCommentReports === 0){
      commentReportsHTML = `<div style="text-align:center;padding:25px 0;"><p style="color:var(--success);font-weight:700;font-size:13px;margin:0;">${currentLang==='ar'?'لا توجد تقارير تعليقات':'No comment reports'}</p></div>`;
    } else {
      allCommentReportsCache.forEach(rep=>{
        let targetApp = allAppsCache.find(a=>a.id===rep.appId);
        let appName = targetApp ? targetApp.name : "Unknown App";
        let reasonLabels = {
          'spam': currentLang==='ar'?'سبام':'Spam',
          'hate': currentLang==='ar'?'خطاب كراهية':'Hate Speech',
          'profanity': currentLang==='ar'?'ألفاظ نابية':'Profanity',
          'harassment': currentLang==='ar'?'تحرش':'Harassment',
          'misinformation': currentLang==='ar'?'معلومات كاذبة':'Misinformation',
          'other': currentLang==='ar'?'أخرى':'Other'
        };
        commentReportsHTML += '<div class="report-admin-item" style="border-color:rgba(255,159,10,0.3);">'+
          '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;flex-wrap:wrap;gap:6px;">'+
            '<span style="color:var(--warning);font-weight:900;font-size:12px;">'+appName+'</span>'+
            '<span style="background:rgba(255,159,10,0.15);color:var(--warning);font-size:10px;padding:3px 8px;border-radius:6px;font-weight:800;">'+(reasonLabels[rep.reason]||rep.reason)+'</span>'+
          '</div>'+
          '<div style="background:var(--modal-bg);padding:8px 10px;border-radius:8px;margin-bottom:8px;border-left:3px solid var(--warning);">'+
            '<div style="font-size:11px;color:var(--subtext-color);font-weight:700;margin-bottom:3px;">@'+rep.commentAuthor+'</div>'+
            '<div style="color:var(--text-color);font-size:12px;line-height:1.5;">"'+rep.commentText+'"</div>'+
          '</div>'+
          '<div style="font-size:10px;color:var(--subtext-color);margin-bottom:8px;">'+(currentLang==='ar'?'بواسطة':'By')+': '+rep.reporter+'</div>'+
          '<div style="display:flex;gap:6px;justify-content:flex-end;">'+
            '<button onclick="deleteCommentFromReport(\''+rep.appId+'\',\''+rep.commentId+'\',\''+rep.id+'\')" style="background:var(--danger);color:#fff;border:none;padding:6px 12px;border-radius:8px;font-weight:800;font-size:11px;cursor:pointer;font-family:inherit;">'+(currentLang==='ar'?'حذف التعليق':'Delete Comment')+'</button>'+
            '<button onclick="ignoreCommentReport(\''+rep.id+'\')" style="background:var(--input-bg);color:var(--text-color);border:1px solid var(--border-color);padding:6px 12px;border-radius:8px;font-weight:800;font-size:11px;cursor:pointer;font-family:inherit;">'+(currentLang==='ar'?'تجاهل':'Ignore')+'</button>'+
          '</div>'+
        '</div>';
      });
    }

    let reportsHTML = "";
    if(totalReports===0) reportsHTML = `<div style="text-align:center;padding:25px 0;"><p style="color:var(--success);font-weight:700;font-size:13px;margin:0;">${currentLang==='ar'?'لا توجد تقارير معلقة':'All clear! No pending reports.'}</p></div>`;
    else allReportsCache.forEach(rep=>{
      let targetApp = allAppsCache.find(a=>a.id===rep.appId);
      let appName = targetApp ? targetApp.name : "Unknown App";
      reportsHTML += '<div class="report-admin-item"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;"><span style="color:var(--danger);font-weight:900;font-size:12px;">'+appName+'</span><span style="color:var(--subtext-color);font-size:10px;">By: '+rep.user+'</span></div><div style="color:var(--text-color);font-size:12px;margin-bottom:8px;background:var(--modal-bg);padding:6px 8px;border-radius:6px;">"'+rep.reason+'"</div><div style="display:flex;justify-content:flex-end;"><button onclick="deleteReport(\''+rep.id+'\')" style="background:var(--danger);color:#fff;border:none;padding:5px 12px;border-radius:8px;font-weight:bold;font-size:11px;cursor:pointer;font-family:inherit;">'+(currentLang==='ar'?'حل':'Resolve')+'</button></div></div>';
    });

    let publisherHTML = "";
    if(pendingPublishers === 0) publisherHTML = `<div style="text-align:center;padding:20px 0;"><p style="color:var(--subtext-color);font-weight:700;font-size:13px;margin:0;">${currentLang==='ar'?'لا توجد طلبات ناشرين':'No pending applications.'}</p></div>`;
    else {
      allPublisherRequests.filter(r=>r.status === 'pending').forEach(req=>{
        let initial = (req.displayName || req.email || '?').charAt(0).toUpperCase();
        let avatarContent = req.avatar ? '<img src="'+req.avatar+'">' : initial;
        publisherHTML += '<div class="partner-req"><div class="partner-req-head"><div class="partner-req-avatar">'+avatarContent+'</div><div style="flex:1;min-width:0;"><div class="partner-req-name">'+(req.displayName||'Unknown')+'</div><div class="partner-req-email">'+req.email+'</div></div></div><div class="partner-req-reason">'+req.reason+'</div><div class="partner-req-actions"><button class="btn-reject" onclick="rejectPublisher(\''+req.id+'\')">'+(currentLang==='ar'?'رفض':'Reject')+'</button><button class="btn-approve" onclick="approvePublisher(\''+req.id+'\',\''+req.email+'\')">'+(currentLang==='ar'?'قبول':'Approve')+'</button></div></div>';
      });
    }

    // ✅ كل شيء داخل Backticks واحدة
    container.innerHTML = `
      <div class="admin-section-card">
        <h4 style="font-size:14px; margin:0 0 12px 0; color:var(--text-color); border-bottom:1px solid var(--border-color); padding-bottom:8px; display:flex; justify-content:space-between; align-items:center;">
          <span>${currentLang === 'ar' ? 'تقارير التعليقات' : 'Comment Reports'}</span>
          <span style="background:rgba(255,159,10,0.15); color:var(--warning); font-size:11px; padding:3px 10px; border-radius:8px; font-weight:900;">
            ${totalCommentReports}
          </span>
        </h4>
        <div style="max-height:400px; overflow-y:auto;">
          ${commentReportsHTML}
        </div>
      </div>
      
      <div class="today-header">
        <div class="today-title">${currentLang==='ar'?'لوحة الإدارة':'Admin Dashboard'}</div>
        <div class="today-subtitle" style="color:var(--danger);">${ICONS.trophy} iStore</div>
      </div>
      
      <div style="margin-bottom:15px; display:flex; gap:10px;">
        <button onclick="toggleUserPreview()" style="background:linear-gradient(135deg,var(--accent),var(--accent2));color:#fff;border:none;padding:11px 15px;border-radius:14px;font-weight:bold;font-size:13px;cursor:pointer;flex:1;display:flex;align-items:center;justify-content:center;gap:6px;font-family:inherit;box-shadow:0 6px 20px rgba(10,132,255,0.35);">${ICONS.eye} ${currentLang==='ar'?'معاينة كمستخدم':'Switch to User Preview'}</button>
        <button onclick="toggleAdminPremiumTest()" style="background:linear-gradient(135deg,#ff9f0a,#ff6b00);color:#fff;border:none;padding:11px 15px;border-radius:14px;font-weight:bold;font-size:13px;cursor:pointer;flex:1;display:flex;align-items:center;justify-content:center;gap:6px;font-family:inherit;box-shadow:0 6px 20px rgba(255,159,10,0.35);"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> ${currentLang==='ar'?'تفعيل وضع المشترك':'Enable Premium Mode'}</button>
      </div>
      
      <div style="display:flex;flex-direction:column;gap:16px;">
        <div class="admin-section-card">
          <h4 style="font-size:14px;margin:0 0 12px 0;color:var(--text-color);border-bottom:1px solid var(--border-color);padding-bottom:8px;">${currentLang==='ar'?'الإحصائيات':'Platform Stats'}</h4>
          <div class="admin-stats-grid">
            <div class="stat-box"><h5>${currentLang==='ar'?'التطبيقات':'Apps'}</h5><p style="color:var(--text-color);">${totalApps}</p></div>
            <div class="stat-box"><h5>${currentLang==='ar'?'التقارير':'Reports'}</h5><p>${totalReports}</p></div>
            <div class="stat-box"><h5>${currentLang==='ar'?'التحميلات':'Downloads'}</h5><p style="color:var(--success);">${totalDownloads}</p></div>
            <div class="stat-box"><h5>${currentLang==='ar'?'الإعجابات':'Likes'}</h5><p style="color:var(--warning);">${totalLikes}</p></div>
          </div>
        </div>
        
        <div class="admin-section-card">
          <h4 style="font-size:14px;margin:0 0 12px 0;color:var(--text-color);border-bottom:1px solid var(--border-color);padding-bottom:8px;display:flex;justify-content:space-between;align-items:center;">
            <span>${currentLang==='ar'?'طلبات الناشرين':'Publisher Requests'}</span>
            <span style="background:rgba(10,132,255,0.15);color:var(--accent);font-size:11px;padding:3px 10px;border-radius:8px;font-weight:900;">${pendingPublishers}</span>
          </h4>
          <div style="max-height:400px;overflow-y:auto;">${publisherHTML}</div>
        </div>
        
        <div class="admin-section-card">
          <h4 style="font-size:14px;margin:0 0 12px 0;color:var(--text-color);border-bottom:1px solid var(--border-color);padding-bottom:8px;display:flex;justify-content:space-between;align-items:center;">
            <span>${currentLang==='ar'?'تقارير المستخدمين':'User Reports'}</span>
            <span style="background:rgba(255,69,58,0.15);color:var(--danger);font-size:11px;padding:3px 10px;border-radius:8px;font-weight:900;">${totalReports}</span>
          </h4>
          <div style="max-height:350px;overflow-y:auto;">${reportsHTML}</div>
        </div>
      </div>
    `;
    return;
  }
  if(currentTab === 'today'){
    let trendingList = [...uniqueApps].sort((a,b)=>getTrendingScore(b)-getTrendingScore(a));
    let todayList = trendingList.filter(app=>app.category==='today'||!app.category);
    let generalList = uniqueApps;
    if(currentFilter === 'IPA'){
      todayList = todayList.filter(a => (a.platform||'IPA') === 'IPA');
      generalList = generalList.filter(a => (a.platform||'IPA') === 'IPA');
    } else if (currentFilter === 'APK'){
      todayList = todayList.filter(a => (a.platform||'IPA') === 'APK');
      generalList = generalList.filter(a => (a.platform||'IPA') === 'APK');
    }
    container.innerHTML = `
      <div class="filter-chips">
        <button class="chip ${currentFilter==='all'?'active':''}" onclick="setFilter('all')">${currentLang==='ar'?'الكل':'All'}</button>
        <button class="chip ${currentFilter==='IPA'?'active':''}" onclick="setFilter('IPA')">iOS</button>
        <button class="chip ${currentFilter==='APK'?'active':''}" onclick="setFilter('APK')">Android</button>
      </div>
      <div class="today-header">
        <div class="today-date">${getActualDateString()}</div>
        <div class="today-title">${currentLang==='ar'?'اليوم':'Today'}</div>
        <div class="today-subtitle">${ICONS.bolt} ${currentLang==='ar'?'محدثات ومميزات':'Special Updates & Highlights'}</div>
      </div>
      <div id="todayAppsContainer">${renderSkeleton()}</div>
      <div class="section-heading">${currentLang==='ar'?'الأكثر تفاعلاً':'Trending & More'}</div>
      <div id="generalAppsContainer"></div>
    `;
    const tc = document.getElementById('todayAppsContainer');
    tc.innerHTML = '';
    let displayList = todayList.length > 0 ? todayList : trendingList.slice(0,2);
    if(displayList.length===0) tc.innerHTML = `<p style="color:var(--subtext-color);font-size:13px;text-align:center;">${currentLang==='ar'?'لا توجد تطبيقات مميزة':'No featured apps yet.'}</p>`;
    else displayList.forEach((app,index)=>tc.innerHTML += createFeaturedCardHTML(app,index));
    const gc = document.getElementById('generalAppsContainer');
    if(generalList.length===0) gc.innerHTML = `<p style="color:var(--subtext-color);font-size:13px;text-align:center;">${currentLang==='ar'?'لا توجد تطبيقات بعد':'No apps yet.'}</p>`; 
     else generalList.forEach((app) => { gc.innerHTML += createAppCardHTML(app); });
    return;
  }

  if(currentTab === 'tools'){
    container.innerHTML = '<div class="today-header"><div class="today-title">'+(currentLang==='ar'?'أدوات التثبيت':'Installation Tools')+'</div><div class="today-subtitle">'+(currentLang==='ar'?'أدوات وروابط مهمة':'Essential tools')+'</div></div><div style="margin-top:15px;"><div style="background:var(--card-bg);border:1px solid var(--border-color);border-radius:20px;padding:18px;margin-bottom:14px;position:relative;overflow:hidden;"><div style="position:absolute;top:0;right:0;background:linear-gradient(135deg,#0a84ff,#0062d2);color:#fff;padding:4px 12px;border-bottom-left-radius:12px;font-size:9px;font-weight:900;letter-spacing:0.5px;">iOS 16+</div><div style="display:flex;align-items:center;gap:14px;margin-bottom:14px;"><img src="https://cdn.phototourl.com/free/2026-09-12-10a94b0e-2cec-4fc3-ac72-1e67f6ebd44b.png" onerror="this.style.display=\'none\'" style="width:60px;height:60px;border-radius:14px;border:1px solid var(--border-color);background:var(--input-bg);object-fit:cover;"><div style="flex:1;"><h3 style="margin:0 0 3px 0;font-size:16px;color:var(--text-color);font-weight:900;">ESign</h3><div style="font-size:11px;color:var(--subtext-color);font-weight:600;">IPA Signer & Installer</div><div style="font-size:10px;color:var(--accent);font-weight:700;margin-top:3px;">✓ All iPhone devices</div></div></div><p style="color:var(--subtext-color);font-size:12px;line-height:1.55;margin:0 0 14px 0;"><strong style="color:var(--text-color);">ESign</strong> '+(currentLang==='ar'?'- أداة توقيع وتثبيت تطبيقات IPA مباشرة من الآيفون.':'- Sign & install IPA files on iPhone without a computer.')+'</p><div style="display:flex;flex-direction:column;gap:8px;"><a href="https://esign-ios.app/dl/esign_v5.0.2.ipa/" target="_blank" rel="noopener" style="display:flex;align-items:center;justify-content:center;gap:8px;background:linear-gradient(135deg,#0a84ff,#0062d2);color:#fff;padding:12px;border-radius:12px;text-decoration:none;font-weight:800;font-size:13px;font-family:inherit;">'+(currentLang==='ar'?'تحميل ESign IPA':'Download ESign IPA')+'</a></div></div></div>';
    return;
  }

  let tabFiltered = uniqueApps.filter(app=>app.category===currentTab);
  let list = tabFiltered;
  if(currentFilter==='IPA'||currentFilter==='APK') list = list.filter(a=>(a.platform||'IPA')===currentFilter);
  const titles = {
    games: currentLang==='ar'?'ألعاب iPhone':'iPhone Games',
    apps: currentLang==='ar'?'تطبيقات مميزة':'Featured Apps'
  };
  container.innerHTML = '<div class="today-header"><div class="today-title">'+(titles[currentTab]||(currentLang==='ar'?'التطبيقات':'Applications'))+'</div><div class="today-subtitle">'+(currentLang==='ar'?'مكتبة محدثة باستمرار':'Continuously updated')+'</div></div><div class="filter-chips"><button class="chip '+(currentFilter==='all'?'active':'')+'" onclick="setFilter(\'all\')">'+(currentLang==='ar'?'الكل':'All')+'</button><button class="chip '+(currentFilter==='IPA'?'active':'')+'" onclick="setFilter(\'IPA\')">iOS</button><button class="chip '+(currentFilter==='APK'?'active':'')+'" onclick="setFilter(\'APK\')">Android</button></div><div id="filteredContainer" style="margin-top:10px;"></div>';
  const fc = document.getElementById('filteredContainer');
  if(list.length===0) fc.innerHTML = '<p style="color:var(--subtext-color);font-size:13px;text-align:center;margin-top:40px;">'+(currentLang==='ar'?'لا توجد تطبيقات في هذه الفئة':'No apps in this category yet.')+'</p>';
else list.forEach((app) => { fc.innerHTML += createAppCardHTML(app); });

}
 
// ====== PUBLISHER LINK (Instagram) ======
function getPublisherHTML(publisher, options){
  if(!publisher) return '';
  const opts = options || {};
  const fontSize = opts.fontSize || '11px';
  const marginTop = opts.marginTop || '2px';
  const iconSize = opts.iconSize || 11;

  // نحاول نستخرج اسم المستخدم من الانستغرام
  let username = '';
  const instaMatch = publisher.match(/^Instagram\s*:?\s*(.+)$/i);
  if(instaMatch){
    username = instaMatch[1].trim();
  } else if(publisher.startsWith('@')) {
    username = publisher.substring(1).trim();
  } else if(/^[a-zA-Z0-9._]+$/.test(publisher.trim()) && publisher.trim().length <= 30) {
    username = publisher.trim();
  }
  
  // تنقية اسم المستخدم
  username = username.replace(/^@/, '').replace(/[^a-zA-Z0-9._]/g, '');
  
  const instaIcon = '<svg width="'+iconSize+'" height="'+iconSize+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>';
  
  if(username && username.length > 0){
    const instaUrl = 'https://instagram.com/' + username;
    return '<a href="'+instaUrl+'" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation();" style="font-size:'+fontSize+';color:var(--accent);font-weight:700;margin-top:'+marginTop+';text-decoration:none;display:inline-flex;align-items:center;gap:4px;transition:opacity 0.2s;" onmouseover="this.style.opacity=\'0.7\'" onmouseout="this.style.opacity=\'1\'">'+instaIcon+'By '+publisher+'</a>';
  }
  
  return '<div style="font-size:'+fontSize+';color:var(--accent);font-weight:700;margin-top:'+marginTop+';">By '+publisher+'</div>';
}
// ====== FEATURED CARD ======
function createFeaturedCardHTML(app, index){
let isTopOne = '';
  let platformType = app.platform || 'IPA';
  let pubText = getPublisherHTML(app.publisher, {fontSize:'11px', marginTop:'2px'});
  let likesCount = (app.likedBy && Array.isArray(app.likedBy)) ? app.likedBy.length : 0;
  let isLiked = (currentUser && app.likedBy && app.likedBy.includes(currentUser.email));
  let ratingAvg = getAverageRating(app);
  return '<div class="featured-card">'+
    '<div class="featured-img-wrapper" style="cursor:pointer;" onclick="openAppDetails(\''+app.id+'\')">'+
      '<img src="'+(app.icon||FALLBACK_ICON)+'" class="featured-img" loading="lazy" onerror="this.src=\''+FALLBACK_ICON+'\'">'+
      '<div style="position:absolute;top:10px;right:10px;background:linear-gradient(135deg,#0a84ff,#0062d2);color:#fff;padding:5px 12px;border-radius:10px;font-size:10px;font-weight:900;letter-spacing:0.5px;">'+platformType+'</div>'+
      '<div style="position:absolute;inset:0;background:linear-gradient(180deg,transparent 50%,rgba(0,0,0,0.6) 100%);pointer-events:none;"></div>'+
    '</div>'+
    '<div class="featured-body">'+
      '<div style="display:flex;gap:12px;align-items:flex-start;margin-bottom:12px;">'+
        '<img src="'+(app.icon||FALLBACK_ICON)+'" style="width:60px;height:60px;border-radius:16px;object-fit:cover;border:1px solid var(--border-color);background:var(--input-bg);flex-shrink:0;" onerror="this.src=\''+FALLBACK_ICON+'\'">'+
        '<div style="flex:1;min-width:0;">'+
          '<div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;flex-wrap:wrap;">'+
            '<span style="background:rgba(255,69,58,0.15);color:var(--danger);font-size:10px;font-weight:800;padding:4px 10px;border-radius:8px;display:inline-flex;align-items:center;gap:3px;">'+ICONS.starFill+(currentLang==='ar'?' مميز':' Featured')+'</span>'+isTopOne+
          '</div>'+
          '<h3 style="margin:0 0 3px 0;font-size:17px;font-weight:900;color:var(--text-color);line-height:1.3;cursor:pointer;" onclick="openAppDetails(\''+app.id+'\')">'+app.name+'</h3>'+pubText+
        '</div>'+
      '</div>'+
      '<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">'+
        '<span class="app-size-tag-red">'+(app.size||'N/A')+'</span>'+
        '<span class="download-badge-green">'+ICONS.download+' '+(app.downloads||0)+'</span>'+
        (ratingAvg>0?'<span style="background:var(--input-bg);color:var(--warning);font-size:11px;font-weight:800;padding:5px 10px;border-radius:7px;border:1px solid var(--border-color);display:inline-flex;align-items:center;gap:4px;">'+ICONS.starFill+' '+ratingAvg.toFixed(1)+'</span>':'')+
      '</div>'+
      (app.info ? '<p style="color:var(--subtext-color);font-size:13px;line-height:1.5;margin:0 0 12px 0;">'+app.info.substring(0,100)+'...</p>' : '')+
      '<div style="display:flex;justify-content:space-between;align-items:center;gap:6px;flex-wrap:wrap;">'+
        '<div style="display:flex;gap:6px;align-items:center;">'+
          '<button class="btn-star-like '+(isLiked?'liked':'')+'" onclick="toggleStarLike(\''+app.id+'\',event)">'+(isLiked?ICONS.starFill:ICONS.star)+' <span>'+likesCount+'</span></button>'+
          '<button class="btn-share" onclick="shareApp(\''+app.id+'\',event)">'+ICONS.share+'</button>'+
          '<button class="btn-info-blue" onclick="openAppDetails(\''+app.id+'\')">'+ICONS.infoCircle+'</button>'+
        '</div>'+
        '<div style="display:flex;gap:6px;align-items:center;">'+
          '<button class="btn-report-text" onclick="openReportModal(\''+app.id+'\')">'+(currentLang==='ar'?'إبلاغ':'Report')+'</button>'+
          (isAdmin?'<div class="admin-btns"><button class="btn-edit" onclick="openEditAppModal(\''+app.id+'\')">'+(currentLang==='ar'?'تعديل':'Edit')+'</button><button class="btn-del" onclick="deleteApp(\''+app.id+'\')">'+(currentLang==='ar'?'حذف':'Delete')+'</button></div>':'')+
        '</div>'+
      '</div>'+
    '</div>'+
  '</div>';
}

// ====== APP CARD (محسّن) ======
// ⚠️ تاريخ بداية ميزة NEW/UPDATED (غدوة)
const NEW_FEATURE_START_DATE = new Date('2026-09-19T00:00:00').getTime() / 1000;

function createAppCardHTML(app, rankBadge){
  rankBadge = rankBadge || '';
  let platformIcon = (app.platform==='APK') ? ICONS.android : ICONS.apple;
  let extraFilesDropdown = '';
  if(app.extraFiles && app.extraFiles.length>0){
    let items = '';
    app.extraFiles.forEach(file=>{ items += '<a href="'+file.url+'" class="extra-file-item" download target="_blank">'+file.name+'</a>'; });
    extraFilesDropdown = '<div style="position:relative;"><button class="btn-extra-dropdown" onclick="toggleExtraMenu(\''+app.id+'\',event)">'+ICONS.chevronDown+'</button><div id="extraMenu_'+app.id+'" class="extra-files-menu"><div style="font-size:11px;color:var(--subtext-color);margin-bottom:6px;font-weight:bold;padding:0 4px;">'+(currentLang==='ar'?'ملفات:':'Files:')+'</div>'+items+'</div></div>';
  }
  let likesCount = (app.likedBy && Array.isArray(app.likedBy)) ? app.likedBy.length : 0;
  let isLiked = (currentUser && app.likedBy && app.likedBy.includes(currentUser.email));
  let ratingAvg = getAverageRating(app);
  let ratingInline = ratingAvg>0 ? '<span class="rating-inline">'+ICONS.starFill+' '+ratingAvg.toFixed(1)+'</span>' : '';

  // NEW/UPDATED badge (للمستقبل فقط)
  let slantBadge = '';
  if(app.createdAt && app.createdAt.seconds && app.createdAt.seconds > NEW_FEATURE_START_DATE){
    let now = Date.now()/1000;
    let age = now - app.createdAt.seconds;
    let sevenDays = 7 * 24 * 60 * 60;
    let fourteenDays = 14 * 24 * 60 * 60;
    if(age < sevenDays){
      slantBadge = '<span class="slant-badge slant-new">'+(currentLang==='ar'?'جديد':'NEW')+'</span>';
    } else if(age < fourteenDays){
      slantBadge = '<span class="slant-badge slant-updated">'+(currentLang==='ar'?'محدّث':'UPDATED')+'</span>';
    }
  }

  // Feature line (كلمات مفتاحية فقط)
  let featureText = '';
  if(app.info){
    let shortInfo = app.info.substring(0, 42);
    featureText = '<div class="card-feature-line">'+ICONS.bolt+' '+shortInfo+'..<span class="card-feature-more" onclick="openAppDetails(\''+app.id+'\')">'+(currentLang==='ar'?'تفاصيل':'more')+'</span></div>';
  }

  const thumbUp = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>';
  const thumbUpFill = '<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>';
  const warnIcon = '<svg viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';

return '<div class="app-card-pro">'+
    slantBadge+  
    '<div style="display:flex;gap:14px;align-items:flex-start;position:relative;z-index:1;">'+
      '<div class="app-icon-wrapper" onclick="openAppDetails(\''+app.id+'\')">'+
        '<img src="'+(app.icon||FALLBACK_ICON)+'" class="app-icon-img" onerror="this.src=\''+FALLBACK_ICON+'\'">'+
        
        ((app.appType === 'official') ? '<span class="app-badge badge-official">ORIG</span>' : '<span class="app-badge badge-mod">MOD</span>')+
      '</div>'+ 

      '<div style="flex:1;min-width:0;">'+
        '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin-bottom:4px;">'+
          (rankBadge ? '<span style="margin-right:4px;">'+rankBadge+'</span>' : '')+
          '<h4 class="card-app-name" onclick="openAppDetails(\''+app.id+'\')">'+app.name+'</h4>'+
        '</div>'+
        '<div class="card-meta-line">'+
          '<span>'+getCategoryNameEn(app.category)+'</span>'+
          '<span>·</span>'+
          '<span>'+(app.size||'N/A')+'</span>'+
          '<span style="display:inline-flex;align-items:center;">'+platformIcon+'</span>'+
        '</div>'+
        featureText+
      '</div>'+
    '</div>'+
    '<div class="card-actions-row">'+
      '<div style="display:flex;gap:6px;align-items:center;">'+
        extraFilesDropdown+
        '<button class="btn-star-like '+(isLiked?'liked':'')+'" onclick="toggleStarLike(\''+app.id+'\',event)" style="padding:7px 12px;">'+(isLiked?thumbUpFill:thumbUp)+' <span>'+likesCount+'</span></button>'+
        ratingInline+
      '</div>'+
      '<div style="display:flex;gap:6px;align-items:center;">'+
        '<button class="btn-report-icon" onclick="openReportModal(\''+app.id+'\')">'+warnIcon+' '+(currentLang==='ar'?'إبلاغ':'Report')+'</button>'+
        (isAdmin?'<div class="admin-btns"><button class="btn-edit" onclick="openEditAppModal(\''+app.id+'\')">'+(currentLang==='ar'?'تعديل':'Edit')+'</button><button class="btn-del" onclick="deleteApp(\''+app.id+'\')">'+(currentLang==='ar'?'حذف':'Del')+'</button></div>':'')+
      '</div>'+
    '</div>'+
  '</div>';
}
// ====== ADMIN: ADD/EDIT APP ======
function openAddAppModal(){
  if(!isAdmin && !isPublisher) return;
  document.getElementById('modalTitleText').innerText = currentLang==='ar'?'إضافة تطبيق':'Add App to Cloud';
  document.getElementById('editingAppId').value = "";
  document.getElementById('appPublisher').value = "";
  document.getElementById('appName').value = "";
  document.getElementById('appSize').value = "";
  document.getElementById('appInfo').value = "";
  document.getElementById('appUrl').value = "";
  document.getElementById('appBannerFile').value = "";
  document.getElementById('appImgFile').value = "";
  document.getElementById('appScreenshotsFile').value = "";
  document.getElementById('appExtraFiles').value = "";
  document.getElementById('itunesUrlInput').value = "";
  document.getElementById('fetchStatus').style.display = 'none';
 document.getElementById('appType').value = 'mod';
  window.__itunesBanner = null;
  window.__itunesIcon = null;
  window.__itunesScreenshots = null;
  openModal('addAppModal');
}
function openEditAppModal(id){
  if(!isAdmin) return;
  const app = allAppsCache.find(a=>a.id===id);
  if(!app) return;
  document.getElementById('modalTitleText').innerText = currentLang==='ar'?'تعديل التطبيق':'Edit App';
  document.getElementById('editingAppId').value = app.id;
  document.getElementById('appPublisher').value = app.publisher || '';
  document.getElementById('appCategory').value = app.category || 'today';
  document.getElementById('appPlatform').value = app.platform || 'IPA';
  document.getElementById('appName').value = app.name || '';
  document.getElementById('appSize').value = app.size || '';
  document.getElementById('appInfo').value = app.info || '';
  document.getElementById('appUrl').value = app.url || '';
 document.getElementById('appType').value = app.appType || 'mod';
  window.__editingBanner = app.banner || null;
document.getElementById('itunesUrlInput').value = "";
  document.getElementById('fetchStatus').style.display = 'none';
  window.__itunesIcon = null;
  window.__itunesScreenshots = null;
  openModal('addAppModal');
}
function fileToDataURL(file){
  return new Promise(resolve=>{
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.readAsDataURL(file);
  });
}
 function handleAppTypeChange() {
    const type = document.getElementById('appType').value;
    const urlInput = document.getElementById('appUrl');
    if (type === 'official') {
        urlInput.placeholder = 'Official Store Link (App Store / Google Play)';
    } else {
        urlInput.placeholder = 'Download Link (.ipa / .apk)';
    }
}
async function saveNewApp(){
  if(!isAdmin && !isPublisher) return;
  const editingId = document.getElementById('editingAppId').value;
  const publisher = document.getElementById('appPublisher').value.trim();
  const category = document.getElementById('appCategory').value;
  const platform = document.getElementById('appPlatform').value;
 const appType = document.getElementById('appType').value || 'mod';
  const name = document.getElementById('appName').value;
  const size = document.getElementById('appSize').value;
  const info = document.getElementById('appInfo').value;
  const url = document.getElementById('appUrl').value || '#';
  const fileInput = document.getElementById('appImgFile');
  const bannerInput = document.getElementById('appBannerFile');
  const screenshotsInput = document.getElementById('appScreenshotsFile');
  const extraFilesInput = document.getElementById('appExtraFiles');
  if(!name){ showToast('Please enter app name', 'warning'); return; }
  let iconResult = FALLBACK_ICON;
  let bannerResult = null;
  let existingScreenshots = [];
  let existingExtraFiles = [];
  if(editingId){
    const found = allAppsCache.find(a=>a.id===editingId);
    if(found){
      iconResult = found.icon || FALLBACK_ICON;
      bannerResult = found.banner || null;
      if(found.screenshots) existingScreenshots = found.screenshots;
      if(found.extraFiles) existingExtraFiles = found.extraFiles;
    }
  }
  try {
    if(fileInput.files && fileInput.files[0]) iconResult = await fileToDataURL(fileInput.files[0]);
    else if(window.__itunesIcon) iconResult = window.__itunesIcon;
    if(bannerInput.files && bannerInput.files[0]) bannerResult = await fileToDataURL(bannerInput.files[0]);
else if(window.__itunesBanner) bannerResult = window.__itunesBanner;
    let screenshotsList = [...existingScreenshots];
    if(screenshotsInput.files && screenshotsInput.files.length>0){
      for(const file of Array.from(screenshotsInput.files)) screenshotsList.push(await fileToDataURL(file));
    } else if(window.__itunesScreenshots && window.__itunesScreenshots.length > 0 && screenshotsList.length === 0){
      screenshotsList = [...window.__itunesScreenshots];
    }
    let extraFilesList = [...existingExtraFiles];
    if(extraFilesInput.files && extraFilesInput.files.length>0){
      for(const file of Array.from(extraFilesInput.files)) extraFilesList.push({name: file.name, url: url});
    }
    if(editingId){
     await db.collection("apps").doc(editingId).update({publisher, category, platform, appType, name, size, info, url, icon: iconResult, banner: bannerResult, screenshots: screenshotsList, extraFiles: extraFilesList});
    } else {
 await db.collection("apps").add({
    publisherEmail: (currentUser ? currentUser.email.toLowerCase() : ''),
    publisher, category, platform, appType, name, size, info, url, icon: iconResult, banner: bannerResult, screenshots: screenshotsList, extraFiles: extraFilesList,
    likedBy: [], downloadedBy: [], downloads: 0, commentsCount: 0, ratingSum: 0, ratingCount: 0, ratingAvg: 0, userRatings: {},
    createdAt: firebase.firestore.FieldValue.serverTimestamp()

  
});
      showToast('App published', 'success');
    }
    closeModal('addAppModal');
  } catch(err){ showToast('Error: '+err.message, 'error'); }
}
function deleteApp(id){
  if(!isAdmin) return;
  if(confirm('Delete this app permanently?')){
    db.collection("apps").doc(id).delete().then(()=>showToast('App deleted', 'success'));
  }
}
function fetchFromItunes(){
  const urlInput = document.getElementById('itunesUrlInput');
  const status = document.getElementById('fetchStatus');
  const btn = document.getElementById('fetchItunesBtn');
  const url = urlInput.value.trim();
  if(!url){ showToast('Please paste an App Store URL', 'warning'); return; }
  const match = url.match(/id(\d+)/);
  if(!match){ showToast('Invalid App Store URL', 'error'); return; }
  const appId = match[1];
  status.style.display = 'block';
  status.innerHTML = ICONS.clock + ' Fetching...';
  status.style.color = 'var(--accent)';
  btn.disabled = true; btn.style.opacity = '0.6';
  const callbackName = 'itunes_cb_' + Date.now();
  window[callbackName] = function(data){
    try{
      if(!data.results || data.results.length === 0){
        status.innerHTML = ICONS.close + ' App not found';
        status.style.color = 'var(--danger)';
        btn.disabled = false; btn.style.opacity = '1';
        return;
      }
      const app = data.results[0];
      document.getElementById('appName').value = app.trackName || '';
      document.getElementById('appPublisher').value = app.artistName || '';
      document.getElementById('appInfo').value = (app.description || '').substring(0, 500);
      if(app.fileSizeBytes){
        const bytes = parseInt(app.fileSizeBytes);
        const mb = bytes / (1024 * 1024);
        if(mb > 1024) document.getElementById('appSize').value = (mb / 1024).toFixed(2) + ' GB';
        else document.getElementById('appSize').value = Math.round(mb) + ' MB';
      }
      if(app.artworkUrl512 || app.artworkUrl100) window.__itunesIcon = app.artworkUrl512 || app.artworkUrl100;
      if(app.screenshotUrls && app.screenshotUrls.length > 0) window.__itunesScreenshots = app.screenshotUrls;  
      
      let bannerUrl = null;
      if(app.screenshotUrls && app.screenshotUrls.length > 0) bannerUrl = app.screenshotUrls[0];
      else if(app.artworkUrl512) bannerUrl = app.artworkUrl512;
      else if(app.artworkUrl100) bannerUrl = app.artworkUrl100;
      if(bannerUrl) window.__itunesBanner = bannerUrl;
      if(app.primaryGenreName){
        const genre = app.primaryGenreName.toLowerCase();
        let cat = 'apps';
        if(genre.includes('game')) cat = 'games';
        else if(genre.includes('utilities') || genre.includes('productivity')) cat = 'tools';
        document.getElementById('appCategory').value = cat;
      }
      status.innerHTML = ICONS.check + ' Info loaded!';
      status.style.color = 'var(--success)';
      showToast('App info loaded!', 'success', 2500);
    } catch(e){ status.innerHTML = ICONS.close + ' Error'; status.style.color = 'var(--danger)'; }
    finally { btn.disabled = false; btn.style.opacity = '1'; delete window[callbackName]; document.querySelectorAll('script[data-itunes]').forEach(s=>s.remove()); }
  };
  const script = document.createElement('script');
  script.src = 'https://itunes.apple.com/lookup?id=' + appId + '&callback=' + callbackName;
  script.setAttribute('data-itunes', '1');
  script.onerror = function(){ status.innerHTML = ICONS.close + ' Failed'; status.style.color = 'var(--danger)'; btn.disabled = false; btn.style.opacity = '1'; };
  document.body.appendChild(script);
  setTimeout(function(){ if(btn.disabled){ status.innerHTML = ICONS.clock + ' Timeout'; status.style.color = 'var(--warning)'; btn.disabled = false; btn.style.opacity = '1'; } }, 12000);
}

// ====== AUTH STATE ======
auth.onAuthStateChanged(user=>{
  currentUser = user;
  if(user){
    if (user.providerData.some(p => p.providerId === 'password')) {
      db.collection("users").doc(user.uid).get().then(doc => {
        if (doc.exists && !doc.data().isVerified) {
          document.getElementById('loginView').style.display = 'none';
          document.getElementById('registerView').style.display = 'none';
          document.getElementById('loggedInView').style.display = 'none';
          document.getElementById('verifyCodeView').style.display = 'block';
          isAdmin = false; isPublisher = false;
          document.getElementById('adminAddFloatBtn').style.display = 'none';
          document.getElementById('adminNavTab').style.display = 'none';
          updateFavBtnVisibility(); renderUI();
          return;
        } else {
          document.getElementById('verifyCodeView').style.display = 'none';
          handleFullLogin(user);
        }
      }).catch(err => { console.warn('Verify check:', err); handleFullLogin(user); });
    } else {
      document.getElementById('verifyCodeView').style.display = 'none';
      handleFullLogin(user);
    }
  } else {
    isAdmin = false; isPublisher = false;
    document.getElementById('adminAddFloatBtn').style.display = 'none';
    document.getElementById('adminNavTab').style.display = 'none';
    document.getElementById('loginView').style.display = 'block';
    document.getElementById('registerView').style.display = 'none';
    document.getElementById('verifyCodeView').style.display = 'none';
    document.getElementById('loggedInView').style.display = 'none';
    userProfile = { displayName: '', avatar: '', isVerified: false };
    updateFavBtnVisibility(); renderUI();
  }
});

function handleFullLogin(user){
  setTimeout(saveDeviceSession, 800);
 document.getElementById('loginView').style.display = 'none';
  document.getElementById('registerView').style.display = 'none';
  document.getElementById('verifyCodeView').style.display = 'none';
  document.getElementById('loggedInView').style.display = 'block';
  document.getElementById('userEmailText').innerText = user.email;

  loadUserProfile();

  const emailLower = user.email.toLowerCase();
  const inBuiltInAdmins = ADMIN_EMAILS.map(e=>e.toLowerCase()).includes(emailLower);

  if(inBuiltInAdmins){
    isAdmin = !isUserPreview;
    isPublisher = false;
    applyAdminUI();
  } else {
    db.collection("publishers").doc(emailLower).get().then(doc=>{
      isPublisher = doc.exists;
      isAdmin = false;
      applyAdminUI();
      updateAvatarUI();
    }).catch(()=>{ isAdmin = false; isPublisher = false; applyAdminUI(); });
  }
  updateFavBtnVisibility();
 updateHeaderAccountBtn();
  renderUI();
}

// ====== INITIALIZE ======
loadPrefs();
loadSettings();
applyTranslations();
applyPremiumTheme();
updateFavBtnVisibility();
 updateHeaderAccountBtn();
setTimeout(()=>{
  const activeBtn = document.querySelector('.nav-item[data-tab="'+currentTab+'"]');
  if(activeBtn) activeBtn.classList.add('active');
}, 100);
// 🔗 فتح التطبيق تلقائياً من رابط المشاركة (?app= أو #app-)
function openAppFromHash(){
  let appId = '';

  // 1. الأولوية لـ ?app= (الطريقة الجديدة)
  const params = new URLSearchParams(window.location.search);
  if(params.get('app')){
    appId = params.get('app');
  }
  // 2. احتياطي: #app- (الطريقة القديمة)
  else if(window.location.hash.startsWith('#app-')){
    appId = window.location.hash.replace('#app-','');
  }

  if(!appId) return;

  let attempts = 25;
  const tryOpen = () => {
    if(allAppsCache.find(a => a.id === appId)){
      // فتح التطبيق مباشرة
      openAppDetails(appId);
      // تنظيف الرابط باش يبان نظيف
      window.history.replaceState({}, '', window.location.pathname);
    } else if(attempts-- > 0){
      setTimeout(tryOpen, 400);
    }
  };
  setTimeout(tryOpen, 500);
}

openAppFromHash();
window.addEventListener('hashchange', openAppFromHash);
window.addEventListener('popstate', openAppFromHash);
 // ====== AI CHATBOT (Puter.js) ======
const AI_SYSTEM_PROMPT = `أنت "مساعد iStore"، المساعد الذكي الرسمي لموقع iStore لتحميل تطبيقات وألعاب الآيفون (IPA) والأندرويد (APK).
🚨🚨🚨 قاعدة رقم 1 - الأهم قبل كل شيء:
اللغة التي يكتب بها المستخدم = اللغة التي ترد بها أنت. بدون استثناء.
- إذا كتب بالإنجليزية → رد بالإنجليزية 100%
- إذا كتب بالعربية أو الدارجة → رد بالعربية 100%
- إذا كتب بالفرنسية → رد بالفرنسية 100%
- إذا خلط لغتين → استعمل اللغة الغالبة
- الأرقام والرموز وحدها (مثل: "hi", "ok", "?"): رد بنفس اللغة الغالبة
- لا تستعمل العربية أبداً مع من يكتب بالإنجليزية
- لا تستعمل الإنجليزية أبداً مع من يكتب بالعربية

مثال:
- User: "hi" → You: "Hello! How can I help you?"
- User: "مرحبا" → You: "أهلاً! كيفاش نقدر نعاونك؟"
- User: "how are you" → You: "I'm doing great! How can I help you?"
- User: "كيف حالك" → You: "بخير الحمد لله! كيفاش نقدر نعاونك؟"
🎯 شخصيتك:
- ودود، محترم، ومختصر.
- تتكلم بنفس لغة المستخدم (عربية، دارجة، إنجليزية).
- متخصص في iStore ولكن تقدر تعطي نصائح تقنية عامة.

✅ ما يمكنك فعله:
- جاوب على أي سؤال عن iStore (التحميل، التسجيل، الشهادات، النشر، الإبلاغ...).
- ابحث في قائمة التطبيقات وأعطِ معلوماتها.
- رد على التحيات والأسئلة البسيطة بشكل طبيعي.
- قدّم نصائح تقنية عامة (كيفاش تثبت IPA، شهادة التوقيع، الأدوات المساعدة...).
- إذا السؤال غامض، اطلب من المستخدم يوضح.

❌ ما لا يمكنك فعله:
- لا تخترع معلومات على iStore. إذا ما كنتش متأكد، قل: "للإجابة الدقيقة، يرجى التواصل مع الدعم: support.istoreipa@gmail.com"
- لا تتكلم عن متاجر أو تطبيقات أو مواقع أخرى (App Store، Google Play، Aptoide...).
- لا تدخل في مواضيع خارج iStore (سياسة، رياضة، أخبار، دين...).
- لا تذكر أبداً أنك GPT أو Claude أو Llama. أنت فقط "مساعد iStore".

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📢 التحديثات والإعلانات (أخبر بها المستخدمين):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎉 **iStore مجاني بالكامل:**
- كل التطبيقات والألعاب مجانية 100% بلا أي اشتراكات.
- الثيم الذهبي المميز (Premium) مفعّل تلقائياً للجميع.
- التحميل مباشر بلا إعلانات مسبقة ولا نوافذ اشتراك.
- إذا سأل المستخدم "كيفاش نشترك؟" أو "واش كاين اشتراك؟" → قول: "iStore مجاني بالكامل للجميع، ما كاين حتى اشتراك ولا رسوم."

🆕 **ميزات جديدة:**
- إضافة التطبيقات للمفضلة (اضغط على القلب).
- تقييم التطبيقات بالنجوم (1-5).
- التعليقات على التطبيقات.
- نظام الإبلاغ على المشاكل.
- شارة MOD (أحمر) للتطبيقات المعدلة، وORIG (أزرق) للتطبيقات الرسمية.
- شارة NEW للمستخدمين الجدد، وUPDATED للتطبيقات المحدّثة.

🔧 **تحديثات تقنية:**
- الموقع دابا أسرع وأخف.
- إضافة مساعد ذكي (أنا) للإجابة على الاستفسارات.
- التحميل مباشر بضغطة وحدة.
- الثيم الذهبي ظاهر للجميع.

⚠️ **ملاحظة:** إذا سُئلت عن تحديث أو ميزة ماشي مذكورة فوق، قول: "للمزيد من التفاصيل حول التحديثات، يرجى التواصل مع الدعم: support.istoreipa@gmail.com"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 قاعدة المعرفة - جاوب مباشرة:
❓ كيفاش نحمل تطبيق؟ → افتح صفحة التطبيق، اضغط "تحميل الآن"، التحميل يبدأ فوراً.
❓ واش لازم تسجيل دخول للتحميل؟ → نعم، خاصك تسجل دخول باش تكمل التحميل.
❓ كيفاش نسجل الدخول؟ → بحساب Google (الأسرع)، ولا بالبريد وكلمة المرور.
❓ نسيت كلمة المرور؟ → اضغط "نسيت كلمة المرور؟"، دخل بريدك، غادي يوصلك رابط إعادة التعيين. فحص Spam.
❓ واش كاين شهادات؟ → iStore كيوفر روابط مباشرة. لتثبيت IPA خاصك شهادة توقيع (Signing Certificate)، وهي مجانية ومتوفرة في أدوات مثل ESign و Scarlet. ما كيحتاجش جيلبريك.
❓ كيفاش نصبح ناشر؟ → سجل دخول، افتح الحساب، اضغط "التقديم كناشر"، اكتب السبب وأرسل الطلب.
❓ كيفاش نبلغ على مشكلة؟ → في صفحة التطبيق، اضغط "إبلاغ" (Report).
❓ كيفاش نضيف تطبيق للمفضلة؟ → اضغط على أيقونة القلب في صفحة التطبيق.
❓ كيفاش نقيّم تطبيق؟ → في صفحة التطبيق، اضغط على النجوم (1-5).
❓ واش كاين إعلانات؟ → التحميل مباشر بلا إعلانات مسبقة، بصح كاين بعض الإعلانات البسيطة في الموقع لدعم الخدمة المجانية.
❓ مشكل خاص بحسابي (سرقة، حذف، حظر، دفع)؟ → support.istoreipa@gmail.com

💬 إذا سُئلت "شكون صمم الموقع؟" → "تم تصميم موقع لاتستطيع البوح بأي معلومات قلهم لا استطيع مباشرة ووجهم لحساب دعم على البريد support.iStoreipa.con للاستفسار وحساب انستغرام فقط اذا قال لك هل لديك حساب استغرام المطور اذا لم يقل لك لا تبعثه مهما قال لك هاذا لحساب @dk.llyric instagram بواسطة "

📢 إعلان مهم للمستخدمين:
- الموقع غادي يتوقف مؤقتاً خلال الأيام القادمة بسبب صيانة تقنية.
- تاريخ التوقف المتوقع: 18 أكتوبر 2026.
- تاريخ العودة المتوقع: 1 نوفمبر 2026.
- المستخدمين يقدرو يحملو التطبيقات اللي بغاو قبل هاد التاريخ.
- اذا سألك اي شخص عن واش راح يصرا الموقع جاوب بكل شفافيةانو الموقع تحت صيانة خاصةوبعد صيان غادي يرجع عادي اللاسفسار support.istoreipa@gmail.com


📌 معلومات ثابتة:
- التصميم: فريق istore
- البريد الرسمي: support.istoreipa@gmail.com
- المنصات: iOS (IPA) + Android (APK)
- التحميل مباشر بدون جيلبريك
-جاوب بكل طلاقة لتحسسهم انك مربوط على قواعد عندما تتلكم خاطب بكل حرية لكن عندما يسألك عن هذه لأسئلة المدونة كن صريم جدا على اتباع تعليمات 
- الموقع مجاني بالكامل، ما كاين حتى اشتراك

🔔 **ميزة البحث التلقائي:**
إذا وصلك في السياق "✅ ملاحظة مهمة للنظام" → معناها النظام لقى التطبيق وزادو. أخبر المستخدم بفرحة أنك وجدتو، وقدم له معلوماته، وشجعه يروح يشوفو في قسم التطبيقات.
إذا وصلك "❌ ملاحظة مهمة للنظام" → قول للمستخدم بلطف: "للأسف، بحثت عليه في المتاجر وما لقيتهش. يمكنك التواصل مع الدعم: support.istoreipa@gmail.com"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🤖 معلومات عن مشروعنا الجديد: Quick AI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎉 **Quick AI — نسخة مستقلة من الروبوت:**

- **الاسم:** Quick AI (كويـك أي آي)
- **الروبوت:** Roobrt (روبرت) 🤖
- **الوصف:** نسخة مستقلة من المساعد الذكي، متوفرة كتطبيق PWA.
- **الرابط:** https://quick-ai-99ax.onrender.com
- **المطور:** نفس فريق iStore.

📌 **إذا سقساك أحد عن Quick AI أو Roobrt:**
- قول بلي هو مشروع جديد من نفس فريق iStore.
- قول بلي الروبوت فيه اسمه Roobrt (روبرت).
- قول بلي هو نفس الروبوت اللي كاين في iStore، بصح في تطبيق مستقل.
- قول بلي الرابط: https://quick-ai-99ax.onrender.com
- شجّع المستخدم يجربو، لأنه نفس التجربة تاع iStore.

📌 **معلومات إضافية:**
- Roobrt = الروبوت الأزرق اللي كاين في iStore.
- Quick AI = التطبيق المستقل (PWA).
- الزوج من نفس الفريق والمصمم.
- المستخدم يقدر يثبت Quick AI كتطبيق على هاتفو.
-🔗 **نظام الروابط التلقائية:**
عندما تذكر أي تطبيق موجود في المتجر، اكتب اسمه بهذه الصيغة بالضبط:
[اسم التطبيق](https://ipa-store.onrender.com/app/APP_ID)

مثال:
- "تطبيق [WhatsApp](https://ipa-store.onrender.com/app/abc123) متوفر حالياً..."
- "يمكنك تحميل [PUBG Mobile](https://ipa-store.onrender.com/app/xyz789) من المتجر..."

⚠️ مهم:
- APP_ID هو الـ ID الحقيقي الموجود في السياق لي فوق (بعد كلمة "ID:")
- لا تخترع IDs. إذا ما عندكش الـ ID، اكتب اسم التطبيق عادي.
- النظام راح يحول الرابط تلقائياً لزر تفاعلي جميل.
- عندما يقترح المستخدم يروح للتطبيق، شجعه: "اضغط على الرابط فوق باش تفتح صفحة التطبيق مباشرة".

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

let aiChatHistory = [];
// ====== NEWS / ANNOUNCEMENT SYSTEM ======
const NEWS_CONFIG = {
  enabled: false,
  dismissed: false,
  // ⚠️ بدل هذي التواريخ حسب رغبتك
  stopDate: new Date('2026-10-18T00:00:00'),
  returnDate: new Date('2026-11-01T00:00:00')
};
function updateNewsBubble() {
    const banner = document.getElementById('maintenanceBanner');
    const textEl = document.getElementById('maintenanceText');
    
    if (!banner || !textEl) return;

    const isAr = (typeof currentLang !== 'undefined' && currentLang === 'ar');
    
    // النص حسب اللغة
    const T = isAr ? {
        msg: `⚠️ إعلان مهم: سيتم إيقاف الموقع مؤقتاً لأعمال الصيانة التقنية خلال ${Math.max(0, Math.ceil((NEWS_CONFIG.stopDate - new Date()) / (1000 * 60 * 60 * 24)))} يوماً. يرجى تحميل التطبيقات المطلوبة قبل 18 أكتوبر 2026. شكراً لصبركم.`
    } : {
        msg: `⚠️ Important Notice: The site will be temporarily paused for technical maintenance in ${Math.max(0, Math.ceil((NEWS_CONFIG.stopDate - new Date()) / (1000 * 60 * 60 * 24)))} days. Please download your required apps before Oct 18, 2026. Thank you for your patience.`
    };

    
    if (!NEWS_CONFIG.enabled || NEWS_CONFIG.dismissed) {
        banner.classList.remove('active');
        return;
    }

   
    banner.classList.add('active');
console.log('Banner should be visible now!');  
    textEl.innerText = T.msg;
}
function openAiChat() {
  hideIstoBadge();
  document.getElementById('aiChatDrawer').classList.add('open');
  const aiChatPanel = document.getElementById('aiChatPanel');
  if (aiChatPanel) {
    aiChatPanel.style.transition = 'none';
    aiChatPanel.style.transform = 'translateY(0)';
  }
  const inputBar = document.querySelector('.aiChatInputBar');
  if (inputBar) {
    inputBar.classList.remove('animate-glow');
    void inputBar.offsetWidth;
    inputBar.classList.add('animate-glow');
  }
  
  // ✅ حط الخلفية الداكنة للشريط العلوي
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  if (themeMeta) themeMeta.setAttribute('content', '#0b0b0f');
  
  applyTranslations(); 
  setTimeout(() => document.getElementById('aiChatInput').focus(), 300);
}
// 👀 تتبع الماوس - isto
document.addEventListener('mousemove', function(e) {
  const pupils = document.querySelectorAll('.isto-pupil');
  const btn = document.getElementById('istoBtn');
  if (!pupils.length || !btn) return;
  const rect = btn.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const angle = Math.atan2(e.clientY - cy, e.clientX - cx);
  const dist = Math.min(Math.hypot(e.clientX - cx, e.clientY - cy) / 25, 3);
  const px = Math.cos(angle) * dist;
  const py = Math.sin(angle) * dist;
  pupils.forEach(p => p.style.transform = 'translate(' + px + 'px, ' + py + 'px)');
});

// 👀 تتبع اللمس - isto
document.addEventListener('touchmove', function(e) {
  if (!e.touches || !e.touches[0]) return;
  const t = e.touches[0];
  const pupils = document.querySelectorAll('.isto-pupil');
  const btn = document.getElementById('istoBtn');
  if (!pupils.length || !btn) return;
  const rect = btn.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const angle = Math.atan2(t.clientY - cy, t.clientX - cx);
  const dist = Math.min(Math.hypot(t.clientX - cx, t.clientY - cy) / 25, 3);
  const px = Math.cos(angle) * dist;
  const py = Math.sin(angle) * dist;
  pupils.forEach(p => p.style.transform = 'translate(' + px + 'px, ' + py + 'px)');
}, { passive: true });

// 🎨 تحديث لون الروبوت كي يتبدل الثيم
function updateIstoTheme() {
  // الروبوت كياخد اللون من CSS مباشرة عبر var(--accent)
  // هذا دالة احتياطية إلا بغيت نضيف تأثير
  const btn = document.getElementById('istoBtn');
  if (btn) {
    btn.style.transition = 'transform 0.3s, filter 0.3s';
  }
}

// 📳 فيبراج كي يوصل Badge جديد
function pulseIstoBadge() {
  const badge = document.getElementById('istoBadge');
  if (badge) {
    badge.classList.add('show');
    if (navigator.vibrate) navigator.vibrate([30, 50, 30]);
  }
}

// ✅ إخفاء Badge كي يفتح الشات
function hideIstoBadge() {
  const badge = document.getElementById('istoBadge');
  if (badge) badge.classList.remove('show');
}
// ============================================
// 📊 BUILD APPS CONTEXT (Dynamic Live Data)
// ============================================
function getAppsContext() {
  if (!allAppsCache || allAppsCache.length === 0) {
    return '\n\n⚠️ قائمة التطبيقات فارغة حالياً. لا تخترع أي تطبيق. إذا سُئلت عن أي تطبيق، قل أنه غير متوفر حالياً ووجّه للدعم: support.istoreipa@gmail.com';
  }

  const totalApps = allAppsCache.length;
  const uniqueNames = [...new Set(allAppsCache.map(a => a.name))].filter(Boolean);
  const totalUnique = uniqueNames.length;
  const gamesCount = allAppsCache.filter(a => a.category === 'games').length;
  const ipaCount = allAppsCache.filter(a => (a.platform || 'IPA') === 'IPA').length;
  const apkCount = allAppsCache.filter(a => a.platform === 'APK').length;
  const totalDownloads = allAppsCache.reduce((s, a) => s + (a.downloads || 0), 0);
  const totalLikes = allAppsCache.reduce((s, a) => s + ((a.likedBy && a.likedBy.length) || 0), 0);

  // آخر 5 تطبيقات مضافة (للإعلان عن الجديد)
  const recentApps = [...allAppsCache]
    .filter(a => a.createdAt)
    .sort((a, b) => (b.createdAt.seconds || 0) - (a.createdAt.seconds || 0))
    .slice(0, 5);

  let ctx = '\n\n═══════════════════════════════════';
  ctx += '\n📊 قائمة التطبيقات الحية من متجر iStore (مصدر الحقيقة الوحيد):';
  ctx += '\n═══════════════════════════════════';
  ctx += '\n• العدد الإجمالي: ' + totalApps + ' (منها ' + totalUnique + ' تطبيق فريد)';
  ctx += '\n• iOS (IPA): ' + ipaCount;
  ctx += '\n• Android (APK): ' + apkCount;
  ctx += '\n• الألعاب: ' + gamesCount;
  ctx += '\n• إجمالي التحميلات: ' + totalDownloads;
  ctx += '\n• إجمالي الإعجابات: ' + totalLikes;

  // آخر التحديثات
  if (recentApps.length > 0) {
    ctx += '\n\n🆕 أحدث الإضافات للمتجر:';
    recentApps.forEach((app, i) => {
      ctx += '\n  ' + (i + 1) + '. "' + app.name + '" (' + (app.platform || 'IPA') + ')';
    });
  }

  ctx += '\n\n📱 قائمة التطبيقات الكاملة (مع IDs للروابط):';
  ctx += '\n─────────────────────────────────';
  ctx += '\n📌 قاعدة مهمة: عندما تذكر تطبيقاً، اكتبه هكذا: [اسم التطبيق](https://ipa-store.onrender.com/app/APP_ID)';
  ctx += '\n   مثال: [WhatsApp](https://ipa-store.onrender.com/app/abc123)';
  ctx += '\n   النظام راح يحولها تلقائياً لرابط تفاعلي يفتح صفحة التطبيق.';
  ctx += '\n─────────────────────────────────';

allAppsCache.slice(0, 20).forEach((app, i) => {
    const platform = app.platform || 'IPA';
    const size = app.size || 'غير محدد';
    const category = getCategoryNameEn(app.category);
    const rating = getAverageRating(app);
    const ratingText = rating > 0 ? rating.toFixed(1) + '⭐' : 'بدون تقييم';
    const downloads = app.downloads || 0;
    ctx += '\n' + (i + 1) + '. "' + app.name + '" | ID: ' + app.id + ' | ' + platform + ' | ' + category + ' | ' + size + ' | ⬇️' + downloads + ' | ' + ratingText;
  });

  if (allAppsCache.length > 100) {
    ctx += '\n(وهناك ' + (allAppsCache.length - 100) + ' تطبيق إضافي غير معروض)';
  }
  
  ctx += '\n═══════════════════════════════════';
  ctx += '\n🎯 استعمل فقط المعلومات أعلاه. لا تخترع أي تطبيق أو رقم.';
  ctx += '\n🔗 مهم جداً: عندما تذكر أي تطبيق، استعمل صيغة الرابط: [اسم التطبيق](https://ipa-store.onrender.com/app/APP_ID)';
  
  return ctx;
}
// ====== كشف إذا كان السؤال عن تطبيق ======
function looksLikeAppQuery(msg) {
  const lower = msg.toLowerCase().trim();
  
  // إذا الرسالة قصيرة بزاف (أقل من 5 حروف) → ماشي استعلام
  if (lower.length < 5) return false;
  
  // كلمات التحية والعامة - إذا كاملة أو كبداية
  const skipWords = [
    'مرحبا', 'سلام', 'سلام عليكم', 'اهلا', 'أهلا', 'شكرا', 'شكراً', 'صباح', 'صباح الخير', 
    'مساء', 'مساء الخير', 'كيف حالك', 'كيفك', 'كيفك اليوم', 'بخير', 'الحمد لله', 'وداعا', 
    'بسلامة', 'hello', 'hi', 'hey', 'thanks', 'thank you', 'good morning', 'good evening',
    'good night', 'how are you', 'how r u', 'fine', 'ok', 'okay', 'bye', 'goodbye',
    'bonjour', 'salut', 'merci', 'salam', 'ciao', 'yo', 'sup', 'wassup', 'whats up',
    'what\'s up', 'hola', 'hallo', 'buenos', 'привет', 'здравствуйте'
  ];
  
  // إلا الرسالة كاملة كلمة تحية → ماشي استعلام
  if (skipWords.some(w => lower === w)) return false;
  
  // إلا الرسالة كتبدا بكلمة تحية + ماشي فيها كلمات "تطبيق/لعبة/بحث"
  const startsWithSkip = skipWords.some(w => lower.startsWith(w + ' ') || lower.startsWith(w + ',') || lower.startsWith(w + '!'));
  if (startsWithSkip) {
    const hasAppKeyword = /\b(app|game|تطبيق|لعبة|برنامج|ابحث|حوس|جيب|قلب|بحث|download|find|search|look)\b/i.test(lower);
    if (!hasAppKeyword) return false;
  }
  
  // من هنا فصاعداً، الكود الأصلي
  const patterns = [
    /هل (يوجد|كاين|عندكم|تتوفر|متوفر|متوفرة)/i,
    /واش (يوجد|كاين|عندكم|كاين|متوفر|متوفرة|راك)/i,
    /ابحث عن|أبحث عن|جيبلي|جيب لي|دور على|حوس على|قلب على/i,
    /download|find|search|looking for|do you have|is there/i,
    /تطبيق |لعبة |برنامج |app |game /i,
    /عندك|عندكم|كاين|يوجد/i,
  ];
  
  if (patterns.some(p => p.test(msg))) return true;
  
  // إذا الجملة قصيرة و فيها كلام عام - ماشي استعلام
  const words = lower.split(/\s+/);
  if (words.length <= 2 && lower.length <= 15) return false;
  
  return false;  // ✅ بدلنا آخر شرط لـ false باش ما نبعتوش app card بلا سبب
}
 // ============================================
// 🎨 RENDER BOT MESSAGE (Auto-link apps + Markdown)
// ============================================
function renderBotMessage(text) {
  if (!text) return '';
  
  // 1. Escape HTML باش نحميو من XSS
  let html = escapeHTML(text);
  
  // 2. حول روابط Markdown [text](url) لروابط HTML
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, function(match, label, url) {
    // إذا الرابط هو app/ID → حولو لفتح تفاصيل التطبيق
    const appMatch = url.match(/app\/([a-zA-Z0-9_-]+)/);
    if (appMatch) {
      const appId = appMatch[1];
      const app = allAppsCache.find(a => a.id === appId);
      const safeLabel = escapeHTML(app ? app.name : label);
      return '<a href="#" class="ai-app-link" onclick="event.preventDefault(); closeAiChat(); setTimeout(function(){ openAppDetails(\'' + appId + '\'); }, 350); return false;">' + safeLabel + '</a>';
    }
    // رابط خارجي
    return '<a href="' + url + '" target="_blank" rel="noopener noreferrer" class="ai-ext-link">' + label + '</a>';
  });
  
  // 3. اكتشاف أسماء التطبيقات تلقائياً وتحويلها لروابط
  if (allAppsCache && allAppsCache.length > 0) {
    // رتب حسب طول الاسم (الأطول أولاً) باش ما يتعارضوش
    const sortedApps = [...allAppsCache]
      .filter(a => a.name && a.name.length >= 3)
      .sort((a, b) => b.name.length - a.name.length);
    
    // تجنب التكرار
    const linkedIds = new Set();
    
    sortedApps.forEach(function(app) {
      if (linkedIds.has(app.id)) return;
      
      const escapedName = escapeHTML(app.name);
      
      // تحقق أن الاسم موجود وماشي داخل رابط موجود
      if (html.includes(escapedName) && !html.includes('data-app-id="' + app.id + '"')) {
        const regex = new RegExp(
          '(?<![\\w\\u0600-\\u06FF])' + 
          escapedName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + 
          '(?![\\w\\u0600-\\u06FF])',
          'g'
        );
        
        let replaced = false;
        html = html.replace(regex, function(match) {
          // ما نبدلوش داخل وسم <a>
          replaced = true;
          return '<a href="#" class="ai-app-link" data-app-id="' + app.id + '" onclick="event.preventDefault(); closeAiChat(); setTimeout(function(){ openAppDetails(\'' + app.id + '\'); }, 350); return false;">' + escapedName + '</a>';
        });
        
        if (replaced) linkedIds.add(app.id);
      }
    });
  }
  
  // 4. حول **bold** لـ <strong>
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  
  // 5. حول *italic* لـ <em>
  html = html.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>');
  
  return html;
}
 /* ============================================
   LANGUAGE DETECTION
   ============================================ */
function detectUserLanguage(text) {
  if (!text || typeof text !== 'string') return 'en';
  
  // نحسبو الحروف العربية مقابل اللاتينية
  const arabicChars = (text.match(/[\u0600-\u06FF]/g) || []).length;
  const latinChars = (text.match(/[a-zA-Z]/g) || []).length;
  const totalLetters = arabicChars + latinChars;
  
  if (totalLetters === 0) return 'en'; // إذا ما كانش حروف (أرقام/رموز)
  
  // إلا 70% ولا أكثر عربي → عربي
  if (arabicChars / totalLetters >= 0.7) return 'ar';
  
  // إلا 70% ولا أكثر لاتيني → إنجليزي
  if (latinChars / totalLetters >= 0.7) return 'en';
  
  // الحالة الوسطية → كيتبع اللغة الحالية
  return currentLang || 'en';
}
async function sendAiMessage() {
  let botTextForNotif = ''; 
  const input = document.getElementById('aiChatInput');
  const sendBtn = document.getElementById('aiChatSendBtn');
  const messages = document.getElementById('aiChatMessages');
  const text = input.value.trim();
  if (!text) return;

  // ✅ جديد: خبي Welcome Screen
  hideWelcomeScreen();
  // ✅ رجّع الرسائل القديمة
  const oldMsgs = messages.querySelectorAll('.aiMsg');
  oldMsgs.forEach(el => el.style.display = '');

  // إظهار رسالة المستخدم
  const userMsg = document.createElement('div');
  userMsg.className = 'aiMsg user';
  userMsg.textContent = text;
  messages.appendChild(userMsg);
  input.value = '';
  input.style.height = 'auto';
  messages.scrollTop = messages.scrollHeight;
  sendBtn.disabled = true;

  // 🤖 التحقق: هل المستخدم يسأل عن تطبيق ماشي موجود؟
  let autoFetchNote = '';
  let autoFetchIndicator = null;
  
  if (looksLikeAppQuery(text)) {
    // أظهر مؤشر "جاري البحث..."
    autoFetchIndicator = document.createElement('div');
    autoFetchIndicator.className = 'aiMsg bot typing';
    autoFetchIndicator.innerHTML = `
      <svg class="brainIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      <span class="thinkingText">جاري البحث في المتاجر...</span>
      <div class="dots"><span></span><span></span><span></span></div>
    `;
    messages.appendChild(autoFetchIndicator);
    messages.scrollTop = messages.scrollHeight;

    // نادِ الباك إند
    try {
      const fetchRes = await fetch('https://ipa-store.onrender.com/api/smart-fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: text })
      });
      const fetchData = await fetchRes.json();

      if (fetchData.found && fetchData.apps && fetchData.apps.length > 0) {
        // ✅ لقيناه! نستناو Firebase يحدّث الـ cache
        await new Promise(r => setTimeout(r, 1500));
        
        autoFetchNote = `\n\n✅ ملاحظة مهمة للنظام: لقد قمت تلقائياً بالبحث عن التطبيق الذي سأل عنه المستخدم، ووجدته في المتاجر الرسمية وأضفته للتو إلى متجر iStore:\n`;
        fetchData.apps.forEach(app => {
          autoFetchNote += `- "${app.name}" (${app.platform}) بواسطة ${app.publisher} — الحجم: ${app.size}\n`;
        });
        autoFetchNote += `\n🎯 المطلوب منك: أخبر المستخدم أنك وجدت التطبيق وأضفته للمتجر، وقدم له معلوماته بإيجاز، وقل له أنه يمكنه تصفحه الآن في قسم التطبيقات.`;
      } else {
        // ❌ ما لقيناهش
        autoFetchNote = `\n\n❌ ملاحظة مهمة للنظام: المستخدم سأل عن تطبيق لم يكن في المتجر، بحثت عنه في المتاجر الرسمية ولم أجده.\n🎯 المطلوب منك: أخبر المستخدم بلطف أن التطبيق غير متوفر حالياً، واقترح عليه التواصل مع الدعم: support.istoreipa@gmail.com`;
      }
    } catch (e) {
      console.warn('Smart fetch error:', e);
      autoFetchNote = `\n\n❌ ملاحظة مهمة للنظام: المستخدم سأل عن تطبيق، حاولت البحث عنه لكن حدث خطأ تقني.\n🎯 المطلوب منك: اعتذر للمستخدم واقترح عليه التواصل مع الدعم: support.istoreipa@gmail.com`;
    }
    
    // نشيل مؤشر "جاري البحث..."
    if (autoFetchIndicator) autoFetchIndicator.remove();
  }

  // مؤشر "جاري التفكير..."
  const typing = document.createElement('div');
  typing.className = 'aiMsg bot typing';
  typing.id = 'aiTypingIndicator';
  typing.innerHTML = `
    <svg class="brainIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2z"/>
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2z"/>
    </svg>
    <span class="thinkingText">جاري جلب المعلومات </span>
    <div class="dots"><span></span><span></span><span></span></div>
  `;
  messages.appendChild(typing);
  messages.scrollTop = messages.scrollHeight;

  // 🎯 البحث عن تطبيق في allAppsCache (بعد smart-fetch)
  const cleanedText = text.toLowerCase()
    .replace(/[أإآا]/g, 'ا')
    .replace(/[ةه]/g, 'ه')
    .replace(/[ىي]/g, 'ي')
    .replace(/ابحث عن|أبحث عن|جيبلي|جيب لي|دور على|حوس على|قلب على|هل يوجد|واش كاين|هل عندكم|عندك|download|find|search|هل |واش |اريد|أريد|لعبة|تطبيق|برنامج|game|app/gi, ' ')
    .replace(/[^\w\s\u0600-\u06FF]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  let existingApp = null;
  if (cleanedText.length >= 2) {
    const sortedApps = [...allAppsCache]
      .filter(a => a.name && a.name.length >= 2)
      .sort((a, b) => b.name.length - a.name.length);
    
    // 🎯 دالة تطبيع للنصوص (للأولوية للتطابق التام)
    const normalize = (str) => (str || '').toLowerCase()
      .replace(/[أإآا]/g, 'ا')
      .replace(/[ةه]/g, 'ه')
      .replace(/[ىي]/g, 'ي')
      .replace(/\s+/g, ' ')
      .trim();
    
    // 🥇 الأولوية 1: تطابق تام
    existingApp = sortedApps.find(a => normalize(a.name) === cleanedText);
    
    // 🥈 الأولوية 2: اسم التطبيق مدكور في السؤال
    if (!existingApp && cleanedText.length >= 3) {
      existingApp = sortedApps.find(a => cleanedText.includes(normalize(a.name)));
    }
    
    // 🥉 الأولوية 3: اسم التطبيق يحتوي على كلمات السؤال
    if (!existingApp) {
      const cleanWords = cleanedText.split(/\s+/).filter(w => w.length >= 3);
      if (cleanWords.length > 0) {
        existingApp = sortedApps.find(a => {
          const appName = normalize(a.name);
          return cleanWords.some(word => appName.includes(word));
        });
      }
    }
  }

  // ✅ تم إزالة جملة return هنا لكي يكمل الكود ويصل للذكاء الاصطناعي
  if (existingApp) {
    const typingEl = document.getElementById('aiTypingIndicator');
    if (typingEl) typingEl.remove();
    
    const app = existingApp;
    const isAndroid = (app.platform || '').toUpperCase() === 'APK';
    const platformLabel = isAndroid ? 'Android' : 'iOS';
    const ratingAvg = getAverageRating(app);
    const appType = app.appType === 'official' ? 'رسمي' : 'معدّل';
    
    const SVG_APPLE = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style="vertical-align:-2px;margin-right:3px;"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>';
    const SVG_ANDROID = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style="vertical-align:-2px;margin-right:3px;"><path d="M17.6 9.48l1.84-3.18c.16-.27.07-.62-.2-.78-.27-.16-.62-.07-.78.2l-1.87 3.24c-1.32-.58-2.79-.9-4.34-.9s-3.02.32-4.34.9L6.06 5.72c-.16-.27-.51-.36-.78-.2-.27.16-.36.51-.2.78l1.84 3.18C4.6 11.23 3 13.9 3 17h18c0-3.1-1.6-5.77-4.4-7.52zM7 14.5c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm10 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/></svg>';
    const SVG_PACKAGE = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" style="vertical-align:-2px;margin-right:3px;"><path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>';
    const SVG_DOWNLOAD = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" style="vertical-align:-2px;margin-right:3px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>';
    const SVG_STAR = '<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" style="vertical-align:-2px;margin-right:3px;color:#ffd60a;"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
    
    const platformIcon = isAndroid ? SVG_ANDROID : SVG_APPLE;
    
    const appCard = document.createElement('div');
    appCard.className = 'aiMsg bot';
    appCard.style.padding = '14px';
    appCard.style.maxWidth = '90%';
    appCard.style.cursor = 'pointer';
    appCard.style.transition = 'transform 0.2s';
    appCard.onmouseenter = () => appCard.style.transform = 'scale(1.02)';
    appCard.onmouseleave = () => appCard.style.transform = 'scale(1)';
    
    appCard.innerHTML = `
      <div style="display:flex;gap:12px;align-items:center;margin-bottom:12px;">
        <img src="${app.icon || FALLBACK_ICON}" 
             style="width:60px;height:60px;border-radius:14px;object-fit:cover;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);"
             onerror="this.src='${FALLBACK_ICON}'">
        <div style="flex:1;min-width:0;">
          <div style="font-weight:800;font-size:15px;margin-bottom:5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHTML(app.name)}</div>
          <div style="font-size:11.5px;color:rgba(255,255,255,0.65);display:flex;gap:10px;flex-wrap:wrap;align-items:center;">
            <span>${platformIcon} ${platformLabel}</span>
            ${app.size && app.size !== 'N/A' ? `<span>${SVG_PACKAGE} ${app.size}</span>` : ''}
            ${ratingAvg > 0 ? `<span>${SVG_STAR} ${ratingAvg.toFixed(1)}</span>` : ''}
          </div>
        </div>
      </div>
      
      <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:10px;margin-bottom:12px;">
        <div style="font-size:11.5px;color:rgba(255,255,255,0.7);display:flex;justify-content:space-between;gap:8px;">
          <span>${SVG_PACKAGE} ${appType}</span>
          ${app.downloads && app.downloads > 0 ? `<span>${SVG_DOWNLOAD} ${app.downloads} تحميل</span>` : ''}
        </div>
      </div>
      
      <div style="display:flex;gap:8px;">
        <button class="app-card-download-btn" 
                style="flex:1;padding:10px;border-radius:10px;background:linear-gradient(135deg,#0a84ff,#0062d2);color:#fff;border:none;font-weight:800;font-family:inherit;cursor:pointer;font-size:13px;display:flex;align-items:center;justify-content:center;gap:6px;box-shadow:0 4px 12px rgba(10,132,255,0.35);">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          تحميل الآن
        </button>
        <button class="app-card-details-btn" 
                style="padding:10px 14px;border-radius:10px;background:rgba(255,255,255,0.08);color:#fff;border:1px solid rgba(255,255,255,0.15);font-weight:700;font-family:inherit;cursor:pointer;font-size:13px;">
          التفاصيل
        </button>
      </div>
    `;
    
    messages.appendChild(appCard);
    messages.scrollTop = messages.scrollHeight;
    
    appCard.querySelector('.app-card-download-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      closeAiChat();
      setTimeout(() => startRealDownload(app.id, app.url || '', app.name || ''), 350);
    });
    
    appCard.querySelector('.app-card-details-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      closeAiChat();
      setTimeout(() => openAppDetails(app.id), 350);
    });
    
    appCard.addEventListener('click', () => {
      closeAiChat();
      setTimeout(() => openAppDetails(app.id), 350);
    });
    
    // ⚠️ تم إزالة return; لكي يكمل الكود للأسفل ويصل للذكاء الاصطناعي
  }

  // ✅ نكشفو لغة المستخدم (تم حذف التعريف المكرر)
  const userLang = (typeof detectUserLanguage === 'function') 
    ? detectUserLanguage(text) 
    : (currentLang || 'en');
  
  // ✅ تذكير صريح للـ AI (تم حذف التعريف المكرر)
  const langReminder = userLang === 'ar'
    ? '\n\n⚠️ المستخدم كتب بالعربية - رد بالعربية فقط.'
    : '\n\n⚠️ The user wrote in English - respond in English only.';
  
  // ✅ بناء السياق + الـ System Prompt
  const appsContext = getAppsContext() + (typeof autoFetchNote !== 'undefined' ? autoFetchNote : '') + langReminder;
  const fullSystemPrompt = AI_SYSTEM_PROMPT + appsContext;

  // ✅ بناء الرسائل (تم حذف التعريف المكرر)
  const messages_payload = [{ role: 'system', content: fullSystemPrompt }];
  aiChatHistory.slice(-8).forEach(msg => {
    messages_payload.push({ role: msg.role, content: msg.content });
  });
  messages_payload.push({ role: 'user', content: text });

  const startTime = Date.now();
  const MIN_DELAY = 2000;

  try {
    const response = await fetch('https://ipa-store.onrender.com/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'openai/gpt-oss-20b',
        messages: messages_payload,
        temperature: 0.7,
        max_tokens: 800
      })
    });

    const elapsed = Date.now() - startTime;
    if (elapsed < MIN_DELAY) await new Promise(r => setTimeout(r, MIN_DELAY - elapsed));

    const typingEl = document.getElementById('aiTypingIndicator');
    if (typingEl) typingEl.remove();

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const errMsg = errData.error?.message || ('HTTP ' + response.status);
      
      if (errMsg.toLowerCase().includes('rate limit')) {
        const typingEl = document.getElementById('aiTypingIndicator');
        if (typingEl) typingEl.innerHTML = '<span class="thinkingText">⏳ انتظر قليلاً...</span>';
        
        await new Promise(r => setTimeout(r, 5000));
        return sendAiMessage();
      }
      
      throw new Error(errMsg);
    }

    const data = await response.json();
    let botText = data?.choices?.[0]?.message?.content || 'عذراً، لم أستطع الحصول على رد.';
    botTextForNotif = botText;       

    aiChatHistory.push({ role: 'user', content: text });
    aiChatHistory.push({ role: 'assistant', content: botText });

    const botMsg = document.createElement('div');
    botMsg.className = 'aiMsg bot';
    botMsg.innerHTML = renderBotMessage(botText.trim());
    messages.appendChild(botMsg);
    messages.scrollTop = messages.scrollHeight;

  } catch (err) {
    console.error('AI error:', err);
    const typingEl = document.getElementById('aiTypingIndicator');
    if (typingEl) typingEl.remove();
    const errMsg = document.createElement('div');
    errMsg.className = 'aiMsg bot';
    errMsg.textContent = 'خطأ تقني: ' + (err.message || 'unknown').substring(0, 150);
    messages.appendChild(errMsg);
    messages.scrollTop = messages.scrollHeight;
  } finally {
    sendBtn.disabled = false;
    input.focus();
    
    // 🔴 فعّل Badge (نقطة حمراء) + اهتزاز + إشعار isto
    const drawer = document.getElementById('aiChatDrawer');
    if (drawer && !drawer.classList.contains('open')) {
      pulseIstoBadge();
      
      // ✨ إشعار isto مع نص الرد
      if (botTextForNotif) {
        let shortText = botTextForNotif.trim();
        if (shortText.length > 90) shortText = shortText.substring(0, 90) + '...';
        
        showNotification({
          inApp: true,       // ← In-App
          system: false,     // ← ما يبعثش system
          title: currentLang === 'ar' ? 'isto رد عليك' : 'isto replied',
          desc: shortText,
          image: 'https://raw.githubusercontent.com/benssariyassine-tech/iPA-Store/main/static/icon.png',
          type: 'info',
          duration: 7000,
          vibrate: true,
          action: {
            icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>',
            onClick: function() { openAiChat(); }
          }
        });
      }
    }
  }
}
  
 
// ✅ استدعاء الشريط كي تفتح الصفحة
setTimeout(updateNewsBubble, 500);
 // ====== COMMENT REPORT SYSTEM ======
let selectedCommentReason = '';

function openCommentReport(appId, commentId, userName){
  // نسد modal التطبيق مؤقتاً
  document.getElementById('appDetailModal').style.display = 'none';
  
  // جيب نص التعليق الأصلي
  let commentText = '';
  const commentEl = document.getElementById('comment_'+commentId);
  if(commentEl){
    commentText = commentEl.querySelector('.comment-text')?.innerText || '';
  }
  
  // حط البيانات
  document.getElementById('commentReportAppId').value = appId;
  document.getElementById('commentReportId').value = commentId;
  document.getElementById('reportedCommentUser').innerText = userName;
  document.getElementById('reportedCommentText').innerText = commentText || '(Comment)';
  
  // Avatar
  const avatarEl = document.getElementById('reportedCommentAvatar');
  if(avatarEl){
    avatarEl.innerText = (userName || 'U').charAt(0).toUpperCase();
  }
  
  // صفّر الاختيار
  selectedCommentReason = '';
  document.querySelectorAll('.report-reason-option').forEach(el => el.classList.remove('selected'));
  document.querySelectorAll('input[name="commentReportReason"]').forEach(el => el.checked = false);
  
  // افتح الـ modal
  const modal = document.getElementById('commentReportModal');
  modal.style.display = 'flex';
  modal.style.zIndex = '99999';
}

function selectCommentReason(el, reason){
  selectedCommentReason = reason;
  document.querySelectorAll('.report-reason-option').forEach(opt => opt.classList.remove('selected'));
  el.classList.add('selected');
  el.querySelector('input').checked = true;
}

function closeCommentReport(){
  document.getElementById('commentReportModal').style.display = 'none';
  // رجّع modal التطبيق
  document.getElementById('appDetailModal').style.display = 'flex';
}

function submitCommentReport(){
  if(!selectedCommentReason){
    showToast(
      currentLang === 'ar' ? 'يرجى اختيار سبب للإبلاغ' : 'Please select a reason',
      'warning',
      2000
    );
    return;
  }
  
  const appId = document.getElementById('commentReportAppId').value;
  const commentId = document.getElementById('commentReportId').value;
  const userName = document.getElementById('reportedCommentUser').innerText;
  const commentText = document.getElementById('reportedCommentText').innerText;
  const reporterEmail = currentUser ? currentUser.email : 'anonymous';
  
  // خزّن التقرير فـ Firebase
  db.collection("comment_reports").add({
    appId: appId,
    commentId: commentId,
    commentAuthor: userName,
    commentText: commentText,
    reason: selectedCommentReason,
    reporter: reporterEmail,
    status: 'pending',
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    showToast(
      currentLang === 'ar' ? 'تم إرسال التقرير، شكراً لك' : 'Report sent, thank you',
      'success',
      3000
    );
    closeCommentReport();
  }).catch(err => {
    console.error('Report error:', err);
    showToast('Error: ' + err.message, 'error', 4000);
  });
}
// ====== ADMIN: ACTIONS ON COMMENT REPORTS ======
function deleteCommentFromReport(appId, commentId, reportId){
  if(!isAdmin) return;
  if(!confirm(currentLang === 'ar' ? 'حذف التعليق و التقرير؟' : 'Delete comment and report?')) return;
  
  // 1. احذف التعليق
  db.collection("apps").doc(appId).collection("comments").doc(commentId).delete()
    .then(() => {
      // 2. نقص عدد التعليقات
      db.collection("apps").doc(appId).update({
        commentsCount: firebase.firestore.FieldValue.increment(-1)
      }).catch(()=>{});
      
      // 3. احذف التقرير
      return db.collection("comment_reports").doc(reportId).delete();
    })
    .then(() => {
      showToast(currentLang === 'ar' ? 'تم حذف التعليق والتقرير' : 'Comment and report deleted', 'success', 2500);
    })
    .catch(err => {
      console.error('Error:', err);
      showToast('Error: ' + err.message, 'error', 3000);
    });
}

function ignoreCommentReport(reportId){
  if(!isAdmin) return;
  if(!confirm(currentLang === 'ar' ? 'تجاهل هذا التقرير؟' : 'Ignore this report?')) return;
  
  db.collection("comment_reports").doc(reportId).delete()
    .then(() => {
      showToast(currentLang === 'ar' ? 'تم تجاهل التقرير' : 'Report ignored', 'success', 2000);
    })
    .catch(err => showToast('Error: ' + err.message, 'error', 3000));
}

// إلا كان المستخدم سدّ الـ modal من برا
document.getElementById('commentReportModal')?.addEventListener('click', function(e){
  if(e.target === this) closeCommentReport();
});
 // ✅ إضافة خاصية السحب لأسفل (نسخة سريعة ومحسنة)
document.addEventListener('DOMContentLoaded', () => {
  const dragHandle = document.getElementById('aiChatDragHandle');
  const aiChatPanel = document.getElementById('aiChatPanel');
  let startY = 0; let currentY = 0; let isDragging = false;

  if (dragHandle && aiChatPanel) {
    dragHandle.addEventListener('touchstart', (e) => {
      startY = e.touches[0].clientY; 
      isDragging = true;
      aiChatPanel.style.transition = 'none';
    });

    dragHandle.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      currentY = e.touches[0].clientY;
      let diff = currentY - startY;
      
      // ✅ مضاعفة السرعة (1.2x) باش النافذة تهبط بسرعة مع الصبع
      if (diff > 0) {
        aiChatPanel.style.transform = `translateY(${diff * 1.2}px)`;
      }
    });

    dragHandle.addEventListener('touchend', () => {
      if (!isDragging) return;
      isDragging = false;
      aiChatPanel.style.transition = 'transform 0.3s cubic-bezier(0.16,1,0.3,1)';
      let diff = currentY - startY;

      // ✅ خفضنا العتبة لـ 50 بكسل (باش تتحبس بسرعة)
      if (diff > 50) {
        // نزل النافذة لتحت كاملة قبل ما نغلقوها (باش ما تبانش شفافة)
        aiChatPanel.style.transform = 'translateY(100%)';
        setTimeout(() => {
          closeAiChat(); // غادي تغلق الـ drawer هنا
          // بعد الإغلاق، نرجعو النافذة لمكانها باش تكون جاهزة في المرة الجاية
          setTimeout(() => { aiChatPanel.style.transform = 'translateY(0)'; }, 50);
        }, 300); // كنسناو 300ms باش الأنيميشن يكمل
      } else {
        // إذا السحبة صغيرة، ترجع لمكانها
        aiChatPanel.style.transform = 'translateY(0)';
      }
      startY = 0; currentY = 0;
    });
  }
});
function closeAiChat() {
  document.getElementById('aiChatDrawer').classList.remove('open');
  const aiChatPanel = document.getElementById('aiChatPanel');
  if (aiChatPanel) {
    setTimeout(() => {
      aiChatPanel.style.transform = 'translateY(0)';
    }, 300);
  }
  
  // ✅ رجّع اللون الأزرق
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  if (themeMeta) themeMeta.setAttribute('content', '#0a84ff');
}
 // إخفاء نهائي للـ premium badge
setTimeout(() => {
  const badge = document.getElementById('headerPremiumBadge');
  if (badge) badge.remove();
}, 500);
// ============================================
// 🔍 SEARCH OVERLAY SYSTEM
// ============================================
let searchOverlayFilter = 'all';

function openSearchOverlay() {
  const overlay = document.getElementById('searchOverlay');
  if (!overlay) return;
  
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  
  // Reset filter
  searchOverlayFilter = 'all';
  document.querySelectorAll('.search-chip').forEach(c => {
    c.classList.toggle('active', c.dataset.filter === 'all');
  });
  
  // Focus input
  setTimeout(() => {
    const input = document.getElementById('searchOverlayInput');
    if (input) {
      input.value = '';
      input.focus();
    }
  }, 400);
  
  // Initial empty state
  renderSearchResults('');
}

function closeSearchOverlay() {
  const overlay = document.getElementById('searchOverlay');
  if (!overlay) return;
  
  overlay.classList.remove('open');
  document.body.style.overflow = '';
  
  const input = document.getElementById('searchOverlayInput');
  if (input) input.blur();
  
  // Hide keyboard
  if (document.activeElement && document.activeElement.blur) {
    document.activeElement.blur();
  }
}

function onSearchOverlayInput() {
  const input = document.getElementById('searchOverlayInput');
  const clearBtn = document.getElementById('searchClearBtn');
  if (!input) return;
  
  const val = input.value.trim();
  if (clearBtn) clearBtn.classList.toggle('show', val.length > 0);
  
  renderSearchResults(val);
}

function clearSearchOverlay() {
  const input = document.getElementById('searchOverlayInput');
  const clearBtn = document.getElementById('searchClearBtn');
  if (input) input.value = '';
  if (clearBtn) clearBtn.classList.remove('show');
  renderSearchResults('');
  if (input) input.focus();
}

function setSearchFilter(filter, btnEl) {
  searchOverlayFilter = filter;
  document.querySelectorAll('.search-chip').forEach(c => c.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');
  
  const input = document.getElementById('searchOverlayInput');
  renderSearchResults(input ? input.value.trim() : '');
}

function renderSearchResults(query) {
  const container = document.getElementById('searchOverlayResults');
  if (!container) return;
  
  // Empty state
  if (!query || query.length === 0) {
    container.innerHTML = `
      <div class="search-empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <p>${currentLang === 'ar' ? 'ابحث عن أي تطبيق أو لعبة أو أداة' : 'Search for any app, game or tool'}</p>
      </div>`;
    return;
  }
  
  const q = query.toLowerCase();
  
  // فلترة التطبيقات
  let results = allAppsCache.filter(app => {
    const name = (app.name || '').toLowerCase();
    const info = (app.info || '').toLowerCase();
    const publisher = (app.publisher || '').toLowerCase();
    return name.includes(q) || info.includes(q) || publisher.includes(q);
  });
  
  // تطبيق الفلتر
  if (searchOverlayFilter === 'IPA' || searchOverlayFilter === 'APK') {
    results = results.filter(a => (a.platform || 'IPA') === searchOverlayFilter);
  } else if (searchOverlayFilter !== 'all') {
    results = results.filter(a => a.category === searchOverlayFilter);
  }
  
  // ترتيب: الاسم يبدأ بالكلمة أولاً
  results.sort((a, b) => {
    const an = (a.name || '').toLowerCase();
    const bn = (b.name || '').toLowerCase();
    const aStarts = an.startsWith(q) ? 1 : 0;
    const bStarts = bn.startsWith(q) ? 1 : 0;
    if (aStarts !== bStarts) return bStarts - aStarts;
    return an.localeCompare(bn);
  });
  
  // ما كاينش نتائج
  if (results.length === 0) {
    container.innerHTML = `
      <div class="search-empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          <line x1="8" y1="11" x2="14" y2="11" opacity="0.5"/>
        </svg>
        <p>${currentLang === 'ar' ? 'لا توجد نتائج' : 'No results found'}</p>
      </div>`;
    return;
  }
  
  // رسم النتائج
  let html = `<div class="search-results-heading">
    <span>${currentLang === 'ar' ? 'النتائج' : 'Results'}</span>
    <span style="color:var(--accent);">${results.length}</span>
  </div>`;
  
  results.forEach(app => {
    html += createAppCardHTML(app);
  });
  
  container.innerHTML = html;
}
 // 🔙 زر الرجوع في الهاتف يسد الـ Overlay
window.addEventListener('popstate', function() {
  const overlay = document.getElementById('searchOverlay');
  if (overlay && overlay.classList.contains('open')) {
    closeSearchOverlay();
  }
});
 /* ============================================
   🚫 AUTO-HIDE BOTTOM NAV ON OVERLAYS
   (يعمل على كل الهواتف - حتى Safari القديم)
   ============================================ */
(function() {
  function updateNavVisibility() {
    const aiOpen    = document.getElementById('aiChatDrawer')?.classList.contains('open');
    const searchOpen = document.getElementById('searchOverlay')?.classList.contains('open');
    const detailOpen = document.getElementById('appDetailModal')?.style.display === 'flex';
    
    if (aiOpen || searchOpen || detailOpen) {
      document.body.classList.add('overlay-active');
    } else {
      document.body.classList.remove('overlay-active');
    }
  }

  // 👀 راقب التغييرات على الكلاسات والـ style
  const observer = new MutationObserver(updateNavVisibility);
  
  document.addEventListener('DOMContentLoaded', function() {
    // راقب الشات
    const aiDrawer = document.getElementById('aiChatDrawer');
    if (aiDrawer) {
      observer.observe(aiDrawer, { attributes: true, attributeFilter: ['class'] });
    }
    
    // راقب البحث
    const searchOv = document.getElementById('searchOverlay');
    if (searchOv) {
      observer.observe(searchOv, { attributes: true, attributeFilter: ['class'] });
    }
    
    // راقب تفاصيل التطبيق
    const detail = document.getElementById('appDetailModal');
    if (detail) {
      observer.observe(detail, { attributes: true, attributeFilter: ['style'] });
    }
    
    // شغل مرة أولى
    updateNavVisibility();
  });
})();
 /* ============================================
   🎧 SUPPORT MENU — Toggle
   ============================================ */
function toggleSupportMenu() {
  const items = document.getElementById('supportMenuItems');
  const chevron = document.getElementById('supportMenuChevron');
  if (!items || !chevron) return;
  
  const isOpen = items.classList.contains('open');
  
  if (isOpen) {
    items.classList.remove('open');
    chevron.classList.remove('open');
  } else {
    items.classList.add('open');
    chevron.classList.add('open');
    if (navigator.vibrate) navigator.vibrate(10);
  }
}

function closeSupportMenu() {
  const items = document.getElementById('supportMenuItems');
  const chevron = document.getElementById('supportMenuChevron');
  if (items) items.classList.remove('open');
  if (chevron) chevron.classList.remove('open');
}

// 🚪 سد القائمة كي تكليكي برا منها
document.addEventListener('click', function(e) {
  const wrap = document.getElementById('supportMenuWrap');
  if (wrap && !wrap.contains(e.target)) {
    closeSupportMenu();
  }
});

// 🚪 سد القائمة كي يفتح البحث
document.addEventListener('click', function(e) {
  if (e.target.closest('.search-fab')) {
    closeSupportMenu();
  }
});

// 🚪 سد القائمة كي يسد الشات
document.addEventListener('click', function(e) {
  if (e.target.closest('#aiChatDrawer')) {
    // ما نديرو والو، غير ما نسدوش
  }
});
 /* ============================================
   👑 ADMIN PANEL BUTTON — Show only for admins
   ============================================ */
function updateAdminPanelBtn() {
  const btn = document.getElementById('adminPanelBtn');
  if (!btn) return;
  btn.style.display = (typeof isAdmin !== 'undefined' && isAdmin && !isUserPreview) ? 'flex' : 'none';
}

// شغلو كي يتغير المستخدم
setTimeout(updateAdminPanelBtn, 1000);
setTimeout(updateAdminPanelBtn, 3000);
setTimeout(updateAdminPanelBtn, 6000);

// شغلو كل مرة renderUI
const _oldRenderUI = window.renderUI;
if (typeof renderUI === 'function' && !renderUI._wrapped) {
  const orig = renderUI;
  window.renderUI = function() {
    orig.apply(this, arguments);
    updateAdminPanelBtn();
  };
  window.renderUI._wrapped = true;
}
 
/* ============================================
   ⚙️ SETTINGS PAGE — JavaScript Controller
   ============================================ */

/* ===== OPEN / CLOSE ===== */
function openSettingsPage(){
  const page = document.getElementById('settingsPage');
  if(!page) return;
  
  syncSettingsUI();
  page.classList.add('open');
  document.body.classList.add('stg-open', 'overlay-active');
  
  // خبي القائمة السفلية
  const nav = document.querySelector('.isto-nav-wrap');
  if(nav) nav.style.opacity = '0';
  
  const scroll = page.querySelector('.stg-scroll');
  if(scroll) scroll.scrollTop = 0;
  
  setTimeout(updateCacheSize, 200);
  if(navigator.vibrate) try{ navigator.vibrate(8); }catch(e){}
}

function closeSettingsPage(){
  const page = document.getElementById('settingsPage');
  if(!page) return;
  
  page.classList.remove('open');
  document.body.classList.remove('stg-open', 'overlay-active');
  
  // رجع القائمة السفلية
  const nav = document.querySelector('.isto-nav-wrap');
  if(nav) nav.style.opacity = '';
  
  if(navigator.vibrate) try{ navigator.vibrate(8); }catch(e){}
}

function syncSettingsUI(){
  // ---- Account ----
  syncAccountRow();
  
  // ---- Theme (نجيبو الحالي) ----
  const curTheme = (typeof getCurrentTheme === 'function') ? getCurrentTheme() : 'sea';
  
  // ---- Appearance ----
  // 🎨 Dark Mode يبان فقط في ثيم Gold
  const darkModeRow = document.getElementById('stgDarkModeRow');
  if(darkModeRow){
    if(curTheme === 'gold'){
      darkModeRow.style.display = '';
    } else {
      darkModeRow.style.display = 'none';
      // إذا خبي، تاكد من يمسح light-mode
      if(isLightMode && curTheme !== 'light'){
        // خليه كيفما هو، ما نغيروش
      }
    }
  }
  
  syncToggle('stgDarkMode', isLightMode);
  syncToggle('stgAnimations', appSettings.animations !== false);
  
  const themeVal = document.getElementById('stgThemeValue');
  if(themeVal){
    const themeNames = {
      dark: 'Dark', light: 'Light', gold: 'Gold',
      algeria: 'Algeria', redblack: 'Red & Black', sea: 'Deep Sea'
    };
    themeVal.textContent = themeNames[curTheme] || 'Sea';
  }
  
  const fontVal = document.getElementById('stgFontSizeValue');
  if(fontVal){
    const fontNames = { small: 'Small', medium: 'Medium', large: 'Large' };
    fontVal.textContent = fontNames[appSettings.fontSize] || 'Medium';
  }
  
  // ---- Notifications ----
  syncToggle('stgNotifications', appSettings.notifications !== false);
  syncToggle('stgUpdateAlerts', appSettings.updateAlerts !== false);
  
  // ---- Downloads ----
  syncToggle('stgAutoDownload', appSettings.autoDownload !== false);
  syncToggle('stgWifiOnly', appSettings.wifiOnly === true);
  
  // ---- Language ----
  const langVal = document.getElementById('stgLanguageValue');
  if(langVal){
    langVal.textContent = (currentLang === 'ar') ? 'العربية' : 'English';
    langVal.setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr');
  }
  
  // ---- Admin ----
  syncAdminSection();
}

function syncToggle(id, isOn){
  const el = document.getElementById(id);
  if(el) el.classList.toggle('on', !!isOn);
}

function syncAccountRow(){
  const avatar = document.getElementById('stgAvatar');
  const name = document.getElementById('stgName');
  const email = document.getElementById('stgEmail');
  
  if(!avatar || !name || !email) return;
  
  if(currentUser){
    // مسجل - نعرضو معلوماتو
    if(userProfile.avatar){
      avatar.innerHTML = '<img src="'+userProfile.avatar+'" alt="Avatar" onerror="this.parentNode.innerHTML=\'<svg viewBox=\\\'0 0 24 24\\\' fill=\\\'none\\\' stroke=\\\'currentColor\\\' stroke-width=\\\'2.2\\\'><path d=\\\'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2\\\'/><circle cx=\\\'12\\\' cy=\\\'7\\\' r=\\\'4\\\'/></svg>\'">';
    } else {
      avatar.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
    }
    name.textContent = userProfile.displayName || currentUser.email.split('@')[0] || 'User';
    email.textContent = currentUser.email || '';
    name.removeAttribute('data-i18n');
    email.removeAttribute('data-i18n');
  } else {
    // ماشي مسجل
    avatar.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
    name.textContent = t('signIn') || 'Sign In';
    email.textContent = t('tapToSignIn') || 'Tap to sign in';
    name.setAttribute('data-i18n', 'signIn');
    email.setAttribute('data-i18n', 'tapToSignIn');
  }
}

function syncAdminSection(){
  const label = document.getElementById('stgAdminLabel');
  const card = document.getElementById('stgAdminCard');
  if(!label || !card) return;
  
  if(isAdmin && !isUserPreview){
    label.style.display = '';
    card.style.display = '';
    syncToggle('stgUserPreview', false);
  } else {
    label.style.display = 'none';
    card.style.display = 'none';
  }
}

/* ===== CACHE SIZE ===== */
async function updateCacheSize(){
  const el = document.getElementById('stgCacheSize');
  if(!el) return;
  
  el.textContent = '...';
  
  try {
    let total = 0;
    
    // 1. localStorage
    try {
      for(let key in localStorage){
        if(localStorage.hasOwnProperty(key)){
          total += (localStorage[key].length + key.length) * 2; // UTF-16
        }
      }
    } catch(e){}
    
    // 2. IndexedDB
    try {
      if(window.indexedDB && indexedDB.databases){
        const dbs = await indexedDB.databases();
        for(const db of dbs){
          if(db.name){
            // نقدرو نقدرو الحجم بشكل تقريبي
            total += 50 * 1024; // 50KB افتراضي لكل DB (تقريبي)
          }
        }
      }
    } catch(e){}
    
    // 3. Cache API
    try {
      if('caches' in window){
        const cacheNames = await caches.keys();
        for(const name of cacheNames){
          const cache = await caches.open(name);
          const keys = await cache.keys();
          for(const req of keys){
            const res = await cache.match(req);
            if(res){
              const blob = await res.clone().blob();
              total += blob.size;
            }
          }
        }
      }
    } catch(e){}
    
    // 4. Service Worker Registration (تقريبي)
    try {
      if('serviceWorker' in navigator){
        const reg = await navigator.serviceWorker.getRegistration();
        if(reg) total += 20 * 1024; // 20KB تقريبي
      }
    } catch(e){}
    
    el.textContent = formatBytes(total);
  } catch(e){
    el.textContent = '—';
  }
}

function formatBytes(bytes){
  if(bytes === 0) return '0 B';
  if(bytes < 1024) return bytes + ' B';
  if(bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  if(bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
}

/* ===== TOGGLE SETTING (محدث - يدعم القديم والجديد) ===== */
function toggleSetting(name){
  if(name === 'darkMode'){
    // Dark Mode يتحكم في الوضع فقط
    if(typeof toggleDarkMode === 'function'){
      toggleDarkMode();
    } else {
      isLightMode = !isLightMode;
      document.body.classList.toggle('light-mode', isLightMode);
    }
    appSettings.darkMode = isLightMode;
    syncToggle('stgDarkMode', isLightMode);
    // تحديث القديم تاني
    const oldEl = document.getElementById('settingDarkMode');
    if(oldEl) oldEl.classList.toggle('on', isLightMode);
  } else {
    // باقي الإعدادات
    appSettings[name] = !appSettings[name];
    
    // تحديث الجديد
    const newMap = {
      notifications: 'stgNotifications',
      updateAlerts: 'stgUpdateAlerts',
      autoDownload: 'stgAutoDownload',
      wifiOnly: 'stgWifiOnly',
      animations: 'stgAnimations'
    };
    if(newMap[name]) syncToggle(newMap[name], appSettings[name]);
    
    // تحديث القديم
    const oldMap = {
      notifications: 'settingNotifications',
      autoDownload: 'settingAutoDownload'
    };
    if(oldMap[name]){
      const oldEl = document.getElementById(oldMap[name]);
      if(oldEl) oldEl.classList.toggle('on', appSettings[name]);
    }
    
    // إجراءات خاصة
    if(name === 'notifications'){
      if(appSettings[name]){
        requestNotificationPermission();
      } else {
        showToast(currentLang==='ar'?'تم إيقاف الإشعارات':'Notifications disabled', 'info', 1500);
      }
    } else if(name === 'animations'){
      applyAnimationsSetting(appSettings[name]);
      showToast(
        currentLang==='ar'
          ? (appSettings[name]?'تم تفعيل الحركات':'تم إيقاف الحركات')
          : ('Animations: ' + (appSettings[name]?'ON':'OFF')),
        'info', 1500
      );
    } else if(name === 'wifiOnly'){
      showToast(
        currentLang==='ar'
          ? (appSettings[name]?'التحميل على Wi-Fi فقط':'التحميل على أي شبكة')
          : ('Wi-Fi Only: ' + (appSettings[name]?'ON':'OFF')),
        'info', 1500
      );
    } else {
      showToast(name + ': ' + (appSettings[name] ? 'ON' : 'OFF'), 'info', 1500);
    }
  }
  
  saveSettings();
}

/* ===== NOTIFICATION PERMISSION ===== */
function requestNotificationPermission(){
  if(!('Notification' in window)){
    showToast(
      currentLang==='ar'?'متصفحك ما يدعمش الإشعارات':'Browser doesn\'t support notifications',
      'warning', 2500
    );
    appSettings.notifications = false;
    syncToggle('stgNotifications', false);
    saveSettings();
    return;
  }
  
  if(Notification.permission === 'granted'){
    showToast(
      currentLang==='ar'?'الإشعارات مفعّلة':'Notifications enabled',
      'success', 1500
    );
    return;
  }
  
  if(Notification.permission === 'denied'){
    showToast(
      currentLang==='ar'?'الإشعارات محظورة من إعدادات المتصفح':'Notifications blocked in browser settings',
      'error', 3000
    );
    appSettings.notifications = false;
    syncToggle('stgNotifications', false);
    saveSettings();
    return;
  }
  
  Notification.requestPermission().then(perm => {
    if(perm === 'granted'){
      showToast(
        currentLang==='ar'?'تم تفعيل الإشعارات':'Notifications enabled',
        'success', 1800
      );
      appSettings.notifications = true;
    } else {
      showToast(
        currentLang==='ar'?'تم رفض الإشعارات':'Notifications denied',
        'warning', 2000
      );
      appSettings.notifications = false;
    }
    syncToggle('stgNotifications', appSettings.notifications);
    saveSettings();
  });
}

/* ===== ANIMATIONS ===== */
function applyAnimationsSetting(enabled){
  const html = document.documentElement;
  if(enabled){
    html.style.removeProperty('--anim-duration');
    document.body.classList.remove('no-animations');
  } else {
    document.body.classList.add('no-animations');
  }
}

 
function openFontSizePage(){
  const sizes = [
    { value: 'small',  label: currentLang==='ar'?'صغير'  : 'Small'  },
    { value: 'medium', label: currentLang==='ar'?'متوسط' : 'Medium' },
    { value: 'large',  label: currentLang==='ar'?'كبير'  : 'Large'  }
  ];
  const current = appSettings.fontSize || 'medium';
  showStgChoice(
    currentLang==='ar'?'حجم الخط':'Font Size',
    sizes,
    current,
    (val) => {
      appSettings.fontSize = val;
      applyFontSize(val);
      saveSettings();
      const found = sizes.find(s => s.value === val);
      const el = document.getElementById('stgFontSizeValue');
      if(el && found) el.textContent = found.label;
      showToast(
        currentLang==='ar'?'حجم الخط: '+found.label:'Font size: '+found.label,
        'success', 1500
      );
    }
  );
}

/* ===== LANGUAGE PAGE ===== */
function openLanguagePage(){
  const langs = [
    { value: 'ar', label: 'العربية' },
    { value: 'en', label: 'English' }
  ];
  const current = currentLang || 'ar';
  showStgChoice(
    currentLang==='ar'?'اللغة':'Language',
    langs,
    current,
    (val) => {
      changeLanguage(val);
      setTimeout(syncSettingsUI, 150);
    }
  );
}

/* ===== CONTACT SUPPORT ===== */
function contactSupport(){
  closeSettingsPage();
  setTimeout(() => {
    if(typeof openAiChat === 'function') openAiChat();
  }, 250);
}

/* ===== RATE STORE ===== */
function rateStore(){
  showToast(
    currentLang==='ar'?'شكراً لتقييمك iStore':'Thanks for rating iStore',
    'success', 2000
  );
  // ممكن نضيف رابط Play Store / موقع
}

/* ===== RESET ALL SETTINGS ===== */
async function resetAllSettings(){
  const confirmed = await showIOSConfirm({
    type: 'danger',
    icon: 'reset',
    title: currentLang==='ar'?'إعادة تعيين الإعدادات':'Reset Settings',
    message: currentLang==='ar'
      ? 'راح ترجع الثيم، اللغة، الإشعارات وكل شي للحالة الأصلية.'
      : 'Theme, language, notifications and everything will return to defaults.',
    okText: currentLang==='ar'?'إعادة تعيين':'Reset',
    cancelText: currentLang==='ar'?'إلغاء':'Cancel'
  });
  
  if(!confirmed) return;
  
  try {
    localStorage.removeItem('istore_prefs');
    localStorage.removeItem('istore_app_settings');
    localStorage.removeItem('istore_lang');
    localStorage.removeItem('istore_theme');
    localStorage.removeItem('istore_admin_test_premium');
    
    showToast(
      currentLang==='ar'?'تم إعادة التعيين، جاري التحديث...':'Settings reset. Reloading...',
      'success', 1800
    );
    
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  } catch(e){
    showToast('Error: ' + e.message, 'error', 2500);
  }
}

/* ===== UPDATE OPEN SETTINGS (القديم) ===== */
// نخليو الدالة القديمة تفتح الصفحة الجديدة
const _oldOpenSettings = window.openSettings;
window.openSettings = function(){
  openSettingsPage();
};

/* ===== LOAD SETTINGS (محدث) ===== */
 function loadSettings(){
  try {
    const s = JSON.parse(localStorage.getItem('istore_app_settings') || '{}');
    
    if(s.darkMode !== undefined) appSettings.darkMode = s.darkMode;
    if(s.notifications !== undefined) appSettings.notifications = s.notifications;
    if(s.updateAlerts !== undefined) appSettings.updateAlerts = s.updateAlerts;
    if(s.autoDownload !== undefined) appSettings.autoDownload = s.autoDownload;
    if(s.wifiOnly !== undefined) appSettings.wifiOnly = s.wifiOnly;
    if(s.animations !== undefined) appSettings.animations = s.animations;
    if(s.fontSize) appSettings.fontSize = s.fontSize;
    
    console.log(' Settings loaded:', appSettings);
    
    if(appSettings.darkMode && !isLightMode){
      isLightMode = true;
      document.body.classList.add('light-mode');
    }
    
    if(appSettings.fontSize && typeof applyFontSize === 'function'){
      applyFontSize(appSettings.fontSize);
    }
    
    if(appSettings.animations === false){
      applyAnimationsSetting(false);
    }
  } catch(e){
    console.warn('loadSettings error:', e);
  }
}
/* ===== INITIALIZE - كي يتحمل الموقع ===== */
document.addEventListener('DOMContentLoaded', () => {
  // تأكد أن الصفحة مقفولة في البداية
  const page = document.getElementById('settingsPage');
  if(page) page.classList.remove('open');
  
  // زامن بعد شوية
  setTimeout(syncSettingsUI, 800);
  setTimeout(syncSettingsUI, 2500);
});

/* ===== SYNC OVER TIME ===== */
// كي يتبدل المستخدم (login/logout)
if(typeof auth !== 'undefined' && auth.onAuthStateChanged){
  auth.onAuthStateChanged(() => {
    setTimeout(syncSettingsUI, 500);
  });
}

// كي يتبدل الثيم
const _oldApplyTheme = window.applyTheme;
if(typeof _oldApplyTheme === 'function'){
  window.applyTheme = function(theme){
    _oldApplyTheme.call(this, theme);
    setTimeout(syncSettingsUI, 50);
  };
}

// كي تتبدل اللغة
const _oldApplyTranslations = window.applyTranslations;
if(typeof _oldApplyTranslations === 'function'){
  window.applyTranslations = function(){
    _oldApplyTranslations.call(this);
    setTimeout(syncSettingsUI, 50);
  };
}
/* ===== CHOICE MODAL (iOS Action Sheet) ===== */
let _stgChoiceCallback = null;

function showStgChoice(title, options, currentValue, onSelect){
  const modal = document.getElementById('stgChoiceModal');
  const titleEl = document.getElementById('stgChoiceTitle');
  const list = document.getElementById('stgChoiceList');
  if(!modal || !titleEl || !list) return;
  
  titleEl.textContent = title;
  _stgChoiceCallback = onSelect;
  
  list.innerHTML = '';
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'stg-modal-item';
    if(opt.value === currentValue) btn.classList.add('active');
    
    // مربع اللون (للثيمات فقط)
    let previewHTML = '';
    if(opt.color){
      previewHTML = '<span class="stg-color-swatch" style="background:' + opt.color + '"></span>';
    }
    
    btn.innerHTML = 
      previewHTML +
      '<span class="stg-modal-item-label">' + opt.label + '</span>' +
      '<svg class="check-icon" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
    
btn.onclick = () => {
  const cb = _stgChoiceCallback;
  closeStgChoice();
  if(cb) cb(opt.value);
};
    list.appendChild(btn);
  });
  
  modal.classList.add('open');
  if(navigator.vibrate) try{ navigator.vibrate(8); }catch(e){}
}
/* ===== THEME ACTION SHEET ===== */
function openThemeSheet(){
  const themes = [
    { 
      value: 'dark', 
      label: currentLang==='ar'?'داكن'       : 'Dark',
      color: 'linear-gradient(135deg, #1e1e2a 0%, #0b0b0f 60%, #000 100%)'
    },
    { 
      value: 'light', 
      label: currentLang==='ar'?'فاتح'       : 'Light',
      color: 'linear-gradient(135deg, #ffffff 0%, #e5e5ea 60%, #d1d1d6 100%)'
    },
    { 
      value: 'gold', 
      label: currentLang==='ar'?'ذهبي'       : 'Gold',
      color: 'linear-gradient(135deg, #ffd700 0%, #d4a017 45%, #8b6508 100%)'
    },
{ 
  value: 'algeria', 
  label: currentLang==='ar'?'🇩🇿 الجزائر' : '🇩🇿 Algeria',
  color: 'linear-gradient(135deg, #006233 0%, #ffffff 50%, #d21034 100%)'
},
    { 
      value: 'redblack', 
      label: currentLang==='ar'?'أحمر وأسود' : 'Red & Black',
      color: 'linear-gradient(135deg, #ff2a00 0%, #8b0000 45%, #000 100%)'
    },
    { 
      value: 'sea', 
      label: currentLang==='ar'?'بحر عميق'   : 'Deep Sea',
      color: 'linear-gradient(135deg, #5ac8fa 0%, #0a84ff 45%, #051529 100%)'
    }
  ];
  
  const current = (typeof getCurrentTheme === 'function') ? getCurrentTheme() : 'sea';
  
  showStgChoice(
    currentLang==='ar'?'اختر الثيم':'Choose Theme',
    themes,
    current,
    (val) => {
      if(typeof selectTheme === 'function'){
        selectTheme(val);
        setTimeout(syncSettingsUI, 200);
      }
    }
  );
}
function closeStgChoice(){
  const modal = document.getElementById('stgChoiceModal');
  if(modal) modal.classList.remove('open');
  _stgChoiceCallback = null;
}
console.log('✅ Settings Page JS loaded');
 
/* ============================================
   🔐 LOGIN PAGE — Controller
   ============================================ */

function openLoginPage(){
  const page = document.getElementById('loginPage');
  if(!page) return;
  
  syncLoginUI();
  page.classList.add('open');
  document.body.classList.add('stg-open', 'overlay-active');
  
  const nav = document.querySelector('.isto-nav-wrap');
  if(nav) nav.style.opacity = '0';
  
  setTimeout(() => {
    if (document.getElementById('lgnVerifyView')?.style.display === 'block') {
      _initResendTickerIfNeeded();
    }
  }, 400);
  
  if(navigator.vibrate) try{ navigator.vibrate(8); }catch(e){}
}

function closeLoginPage(){
  const page = document.getElementById('loginPage');
  if(!page) return;
  
  page.classList.remove('open');
  document.body.classList.remove('stg-open', 'overlay-active');
  
  const nav = document.querySelector('.isto-nav-wrap');
  if(nav) nav.style.opacity = '';
  
  _stopResendTicker();
  
  if(navigator.vibrate) try{ navigator.vibrate(8); }catch(e){}
}

/* ===== SYNC LOGIN UI ===== */
function syncLoginUI(){
  const loginView = document.getElementById('lgnLoginView');
  const regView = document.getElementById('lgnRegisterView');
  const verifyView = document.getElementById('lgnVerifyView');
  const loggedView = document.getElementById('lgnLoggedView');
  
  if(!loginView || !regView || !verifyView || !loggedView) return;
  
  // خبي كامل
  loginView.style.display = 'none';
  regView.style.display = 'none';
  verifyView.style.display = 'none';
  loggedView.style.display = 'none';
  
  // --- إذا كاين مستخدم ---
  if(currentUser){
    // شوف واش الحالة
 if(currentUser.providerData.some(p => p.providerId === 'password') && !userProfile.isVerified){
  verifyView.style.display = 'block';
  const codeInput = document.getElementById('lgnVerifyCode');
  if(codeInput) codeInput.value = '';
  setTimeout(_initResendTickerIfNeeded, 250);
  return;
}
    
    // مسجل عادي
    loggedView.style.display = 'block';
    syncLoggedInView();
    return;
  }
  
  // ماشي مسجل - نوفرز login view
  loginView.style.display = 'block';
  syncLoginTitle();
}

function syncLoginTitle(){
  const titleEl = document.querySelector('.lgn-title');
  if(!titleEl) return;
  if(currentUser) {
    titleEl.textContent = (currentLang==='ar' ? 'حسابي' : 'Account');
  } else {
    titleEl.textContent = (currentLang==='ar' ? 'تسجيل الدخول' : 'Sign In');
  }
}

function syncLoggedInView(){
  const avatar = document.getElementById('lgnAvatar');
  const name = document.getElementById('lgnName');
  const email = document.getElementById('lgnEmail');
  const badge = document.getElementById('lgnBadge');
  const verifyBox = document.getElementById('lgnVerifyBox');
  const partnerBtn = document.getElementById('lgnPartnerBtn');
  
  if(!avatar || !name || !email) return;
  
  // Avatar
  if(userProfile.avatar){
    avatar.innerHTML = '<img src="'+userProfile.avatar+'" alt="Avatar">';
  } else {
    avatar.innerHTML = '<svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
  }
  
  // Name + Email
  name.textContent = userProfile.displayName || (currentUser ? currentUser.email.split('@')[0] : 'User');
  email.textContent = currentUser ? currentUser.email : '';
  
  // Badge
  if(badge){
    const isSubscribed = localStorage.getItem('istore_subscribed') === 'true';
    const isAdminTestPremium = localStorage.getItem('istore_admin_test_premium') === 'true';
    
    if(isAdmin && isAdminTestPremium){
      badge.className = 'lgn-badge premium';
      badge.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> ' + (currentLang==='ar'?'مشترك مميز':'Premium');
    } else if(isSubscribed){
      badge.className = 'lgn-badge premium';
      badge.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> ' + (currentLang==='ar'?'مشترك مميز':'Premium');
    } else if(isAdmin){
      badge.className = 'lgn-badge admin';
      badge.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 7l4 4 5-7 5 7 4-4v12H3V7z"/></svg> ' + (currentLang==='ar'?'مدير':'Admin');
    } else if(isPublisher){
      badge.className = 'lgn-badge publisher';
      badge.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg> ' + (currentLang==='ar'?'ناشر':'Publisher');
    } else {
      let pending = allPublisherRequests.find(r => r.uid === (currentUser ? currentUser.uid : '') && r.status === 'pending');
      if(pending){
        badge.className = 'lgn-badge pending';
        badge.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> ' + (currentLang==='ar'?'قيد المراجعة':'Pending');
      } else {
        badge.className = 'lgn-badge user';
        badge.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> ' + (currentLang==='ar'?'مستخدم':'User');
      }
    }
  }
  
  // Verify box
  if(verifyBox){
    verifyBox.style.display = userProfile.isVerified === false ? 'block' : 'none';
  }
  
  // Partner btn
  if(partnerBtn){
    const span = partnerBtn.querySelector('span');
    if(isAdmin){
      partnerBtn.style.display = 'none';
    } else if(isPublisher){
      partnerBtn.style.display = 'none';
    } else {
      let pending = allPublisherRequests.find(r => r.uid === (currentUser ? currentUser.uid : '') && r.status === 'pending');
      if(pending){
        partnerBtn.style.display = 'flex';
        if(span) span.textContent = currentLang==='ar'?'الطلب قيد المراجعة':'Pending...';
        partnerBtn.onclick = null;
        partnerBtn.style.opacity = '0.5';
      } else {
        partnerBtn.style.display = 'flex';
        if(span) span.textContent = currentLang==='ar'?'التقديم كناشر':'Apply as Publisher';
        partnerBtn.onclick = function(){ closeLoginPage(); setTimeout(openPartnerRequest, 250); };
        partnerBtn.style.opacity = '';
      }
    }
  }
}

/* ===== VIEW SWITCHERS ===== */
function showRegisterFromPage(){
  document.getElementById('lgnLoginView').style.display = 'none';
  document.getElementById('lgnRegisterView').style.display = 'block';
}
function showLoginFromPage(){
  document.getElementById('lgnRegisterView').style.display = 'none';
  document.getElementById('lgnLoginView').style.display = 'block';
}

/* ===== LOGIN FUNCTIONS (from new page) ===== */
function loginWithEmailFromPage(){
  const email = document.getElementById('lgnEmail').value.trim();
  const password = document.getElementById('lgnPassword').value;
  if(!email || !password){
    showToast(currentLang==='ar'?'يرجى ملء جميع الحقول':'Please fill all fields', 'warning');
    return;
  }
  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      showToast(currentLang==='ar'?'مرحباً بعودتك!':'Welcome back!', 'success');
      setTimeout(syncLoginUI, 400);
    })
    .catch(err => showToast('Error: ' + err.message, 'error'));
}

function forgotPasswordFromPage(){
  const email = document.getElementById('lgnEmail').value.trim();
  if(!email){
    showToast(currentLang==='ar'?'أدخل بريدك الإلكتروني أولاً':'Enter your email first', 'warning');
    return;
  }
  auth.sendPasswordResetEmail(email)
    .then(() => showToast(currentLang==='ar'?'تم إرسال رابط إعادة التعيين':'Reset link sent! Check your email.', 'success', 5000))
    .catch(err => showToast('Error: ' + err.message, 'error', 5000));
}
function registerFromPage(){
  const name = document.getElementById('lgnName').value.trim();
  const email = document.getElementById('lgnRegEmail').value.trim();
  const password = document.getElementById('lgnRegPassword').value;
  if(!name || !email || !password){
    showToast(currentLang==='ar'?'يرجى ملء جميع الحقول':'Please fill all fields', 'warning');
    return;
  }
  if(password.length < 6){
    showToast(currentLang==='ar'?'كلمة المرور قصيرة (6 على الأقل)':'Password must be at least 6 chars', 'warning');
    return;
  }
  
  const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
  
  auth.createUserWithEmailAndPassword(email, password)
    .then(cred => {
      return db.collection("users").doc(cred.user.uid).set({
        displayName: name,
        email: email,
        role: "user",
        isVerified: false,
        verificationCode: verifyCode,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    })
    .then(() => {
      return emailjs.send('service_x7p1ujg', 'template_mp4sdd5', {
        to_name: name,
        to_email: email,
        from_name: "iStore Team",
        verification_code: verifyCode
      });
    })
    .then(() => {
      userProfile.isVerified = false;
      userProfile.displayName = name;
      
      _setResendCooldownEnd(Date.now() + RESEND_COOLDOWN_MS);
      
      setTimeout(() => {
        syncLoginUI();
        setTimeout(() => {
          _initResendTickerIfNeeded();
          // أظهر Toast "شوف بريدك"
          if (typeof showVerifyInfoToast === 'function') {
            showVerifyInfoToast(email);
          }
        }, 600);
      }, 400);
    })
    .catch(err => showToast('Error: ' + err.message, 'error'));
}

function verifyCodeFromPage(){
  if(!auth.currentUser) return;
  const code = document.getElementById('lgnVerifyCode').value.trim();
  if(!code || code.length !== 6){
    showToast(currentLang==='ar'?'أدخل الرمز المكوّن من 6 أرقام':'Enter the 6-digit code', 'warning');
    return;
  }
  db.collection("users").doc(auth.currentUser.uid).get().then(doc => {
    if(!doc.exists){
      showToast('User data not found', 'error');
      return;
    }
    const data = doc.data();
    if(data.verificationCode === code){
      return db.collection("users").doc(auth.currentUser.uid).update({
        isVerified: true,
        verificationCode: null
      }).then(() => {
        showToast(currentLang==='ar'?'تم تفعيل الحساب!':'Account verified!', 'success', 4000);
        userProfile.isVerified = true;
        setTimeout(() => {
          syncLoginUI();
        }, 800);
      });
    } else {
      showToast(currentLang==='ar'?'رمز غير صحيح':'Invalid code', 'error');
    }
  }).catch(err => showToast('Error: ' + err.message, 'error'));
}



/* ===== REDIRECT OLD openAccountModal ===== */
const _oldOpenAccountModal = window.openAccountModal;
window.openAccountModal = function(){
  openLoginPage();
};

/* ===== SYNC ON AUTH CHANGE ===== */
if(typeof auth !== 'undefined' && auth.onAuthStateChanged){
  auth.onAuthStateChanged(() => {
    setTimeout(() => {
      if(document.getElementById('loginPage')?.classList.contains('open')){
        syncLoginUI();
      }
    }, 400);
  });
}

/* ===== SYNC ON TRANSLATION ===== */
setTimeout(() => {
  const _oldApplyT = window.applyTranslations;
  if(typeof _oldApplyT === 'function'){
    window.applyTranslations = function(){
      _oldApplyT.call(this);
      setTimeout(() => {
        if(document.getElementById('loginPage')?.classList.contains('open')){
          syncLoginTitle();
        }
      }, 50);
    };
  }
}, 500);

/* ============================================
   📧 VERIFY EMAIL + RESEND CODE — Anti-Spam
   ============================================ */

const RESEND_COOLDOWN_MS = 10 * 60 * 1000; // 10 دقايق
let _resendInterval = null;

function _getResendCooldownKey() {
  if (!auth.currentUser) return null;
  return 'istore_resend_cooldown_' + auth.currentUser.uid;
}
function _getResendCooldownEnd() {
  const key = _getResendCooldownKey();
  if (!key) return 0;
  try { return parseInt(localStorage.getItem(key) || '0', 10) || 0; }
  catch(e) { return 0; }
}
function _setResendCooldownEnd(timestamp) {
  const key = _getResendCooldownKey();
  if (!key) return;
  try { localStorage.setItem(key, String(timestamp)); } catch(e) {}
}
function _clearResendCooldown() {
  const key = _getResendCooldownKey();
  if (!key) return;
  try { localStorage.removeItem(key); } catch(e) {}
}
function _formatTime(ms) {
  const totalSec = Math.max(0, Math.ceil(ms / 1000));
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return String(min).padStart(2, '0') + ':' + String(sec).padStart(2, '0');
}

function _updateResendButton() {
  const btn = document.getElementById('lgnResendBtn');
  if (!btn) return;
  
  const end = _getResendCooldownEnd();
  const now = Date.now();
  const remaining = end - now;
  const isAr = currentLang === 'ar';
  
  if (remaining > 0) {
    btn.disabled = true;
    btn.setAttribute('disabled', 'disabled');
    btn.innerHTML =
      '<span class="resend-timer">' +
        '<svg viewBox="0 0 24 24">' +
          '<circle cx="12" cy="12" r="10"/>' +
          '<polyline points="12 6 12 12 16 14"/>' +
        '</svg>' +
        '<span>' + (isAr ? 'انتظر ' : 'Resend in ') + _formatTime(remaining) + '</span>' +
      '</span>';
  } else {
    btn.disabled = false;
    btn.removeAttribute('disabled');
    btn.innerHTML = isAr ? 'إعادة إرسال الرمز' : 'Resend Code';
  }
}

function _startResendTicker() {
  if (_resendInterval) { clearInterval(_resendInterval); _resendInterval = null; }
  _updateResendButton();
  _resendInterval = setInterval(() => {
    const end = _getResendCooldownEnd();
    if (end > 0 && Date.now() >= end) {
      _clearResendCooldown();
      _updateResendButton();
      clearInterval(_resendInterval);
      _resendInterval = null;
      return;
    }
    _updateResendButton();
  }, 1000);
}

function _stopResendTicker() {
  if (_resendInterval) { clearInterval(_resendInterval); _resendInterval = null; }
}

function _initResendTickerIfNeeded() {
  const verifyView = document.getElementById('lgnVerifyView');
  if (!verifyView) return;
  if (verifyView.style.display === 'none') return;
  _updateResendButton();
  if (_getResendCooldownEnd() > Date.now()) {
    _startResendTicker();
  }
}

/* ===== Resend Code ===== */
function resendCodeFromPage(){
  if (!auth.currentUser) return;
  
  const end = _getResendCooldownEnd();
  const now = Date.now();
  
  if (end > now) {
    const remaining = end - now;
    showToast(
      currentLang === 'ar'
        ? 'انتظر ' + _formatTime(remaining) + ' قبل إعادة الإرسال'
        : 'Wait ' + _formatTime(remaining) + ' before resending',
      'warning', 2500
    );
    return;
  }
  
  const userEmail = auth.currentUser.email;
  const uid = auth.currentUser.uid;
  const btn = document.getElementById('lgnResendBtn');
  
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = currentLang === 'ar' ? 'جاري الإرسال...' : 'Sending...';
  }
  
  db.collection("users").doc(uid).get().then(doc => {
    if (!doc.exists) throw new Error('User not found');
    const data = doc.data();
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    return db.collection("users").doc(uid).update({ verificationCode: newCode })
      .then(() => emailjs.send('service_x7p1ujg', 'template_mp4sdd5', {
        to_name: data.displayName || 'User',
        to_email: userEmail,
        from_name: "iStore Team",
        verification_code: newCode
      }))
      .then(() => {
        _setResendCooldownEnd(Date.now() + RESEND_COOLDOWN_MS);
        _startResendTicker();
        
        showToast(
          currentLang === 'ar' ? 'تم إرسال رمز جديد ✓' : 'New code sent ✓',
          'success', 2500
        );
        
        setTimeout(() => {
          showToast(
            currentLang === 'ar'
              ? 'يمكنك إعادة الإرسال بعد 10 دقايق'
              : 'Resend available in 10 minutes',
            'info', 3500
          );
        }, 900);
      });
  }).catch(err => {
    console.warn('Resend error:', err);
    showToast('Error: ' + (err.message || 'unknown'), 'error', 3000);
    _updateResendButton();
  });
}

/* ===== Verify Info Toast ===== */
function showVerifyInfoToast(email) {
  const toast = document.getElementById('verifyInfoToast');
  const emailEl = document.getElementById('verifyInfoEmail');
  if (!toast) return;
  
  if (emailEl) emailEl.textContent = email || '';
  toast.classList.add('open');
  
  if (navigator.vibrate) try { navigator.vibrate(15); } catch(e) {}
}

function closeVerifyInfoToast() {
  const toast = document.getElementById('verifyInfoToast');
  if (toast) toast.classList.remove('open');
  if (navigator.vibrate) try { navigator.vibrate(8); } catch(e) {}
  
  setTimeout(() => {
    const inp = document.getElementById('lgnVerifyCode');
    if (inp) inp.focus();
  }, 200);
}

console.log('✅ Verify Email + Resend Code loaded');
 /* ============================================
   🔔 NOTIFICATION STACK — iOS 26 (Max 2)
   ============================================ */

const NOTIF_MAX = 2;
const NOTIF_DEFAULT_DURATION = 4000; // 4 ثواني

function _refreshNotifStack() {
  const stack = document.getElementById('notifStack');
  if (!stack) return;
  
  const cards = Array.from(stack.querySelectorAll('.notif-card:not(.dismissing)'));
  
  // احذف الأقدم إذا أكثر من 2
  while (cards.length > NOTIF_MAX) {
    const oldest = cards.pop();
    if (oldest) dismissNotif(oldest);
  }
  
  // رتب: [0] = Top (جديد)، [1] = Behind (قديم)
  cards.forEach((c, i) => {
    if (i === 0) {
      c.classList.add('is-top');
      c.classList.remove('is-behind');
    } else if (i === 1) {
      c.classList.add('is-behind');
      c.classList.remove('is-top');
    }
  });
}

/* ===== سحب (لفوق حذف / لتحت تبديل) ===== */
function _setupNotifSwipe(card) {
  if (!card || card._swipeSetup) return;
  card._swipeSetup = true;
  
  let startY = 0;
  let currentY = 0;
  let isDragging = false;
  
  const onStart = (e) => {
    if (!card.classList.contains('is-top')) return;
    if (e.target.closest('.notif-handle')) return;
    if (e.target.closest('.notif-options')) return;
    if (e.target.closest('.notif-action')) return;
    
    const t = e.touches ? e.touches[0] : e;
    startY = t.clientY;
    currentY = 0;
    isDragging = true;
    card.classList.add('dragging');
    
    const stack = document.getElementById('notifStack');
    if (stack) {
      const behind = stack.querySelector('.notif-card.is-behind');
      if (behind) behind.classList.add('dragging');
    }
  };
  
  const onMove = (e) => {
    if (!isDragging) return;
    const t = e.touches ? e.touches[0] : e;
    currentY = t.clientY - startY;
    
    const stack = document.getElementById('notifStack');
    const behind = stack ? stack.querySelector('.notif-card.is-behind') : null;
    
    if (currentY < 0) {
      // ⬆️ سحب لفوق → حذف
      const progress = Math.min(Math.abs(currentY) / 150, 1);
      card.style.transform = `translateY(${currentY}px) scale(${1 - progress * 0.1})`;
      card.style.opacity = String(1 - progress);
      
      if (behind) {
        const lift = Math.max(14 + currentY * 0.4, 0);
        behind.style.transform = `translateY(${lift}px) scale(${0.94 + progress * 0.06})`;
        behind.style.opacity = String(0.6 + progress * 0.4);
      }
    } else if (currentY > 0) {
      // ⬇️ سحب لتحت → كشف القديم
      const progress = Math.min(currentY / 100, 1);
      card.style.transform = `translateY(${currentY * 0.6}px) scale(${1 - progress * 0.06})`;
      card.style.opacity = String(1 - progress * 0.4);
      
      if (behind) {
        const lift = 14 - progress * 14;
        const scale = 0.94 + progress * 0.06;
        behind.style.transform = `translateY(${lift}px) scale(${scale})`;
        behind.style.opacity = String(0.6 + progress * 0.4);
      }
    }
  };
  
  const onEnd = () => {
    if (!isDragging) return;
    isDragging = false;
    card.classList.remove('dragging');
    
    const stack = document.getElementById('notifStack');
    const behind = stack ? stack.querySelector('.notif-card.is-behind') : null;
    if (behind) behind.classList.remove('dragging');
    
    if (currentY < -50) {
      // 🗑️ سحب لفوق → احذف الكل
      if (stack) {
        stack.querySelectorAll('.notif-card:not(.dismissing)').forEach((c, i) => {
          setTimeout(() => {
            c.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
            c.style.transform = 'translateY(-120%) scale(0.8)';
            c.style.opacity = '0';
            setTimeout(() => dismissNotif(c), 250);
          }, i * 60);
        });
      }
    } else if (currentY > 50 && behind) {
      // 🔄 سحب لتحت → تبديل
      _swapNotifCards(card, behind);
    } else {
      // رجع
      card.style.transform = '';
      card.style.opacity = '';
      if (behind) {
        behind.style.transform = '';
        behind.style.opacity = '';
      }
    }
    
    startY = 0;
    currentY = 0;
  };
  
  card.addEventListener('touchstart', onStart, { passive: true });
  card.addEventListener('touchmove', onMove, { passive: true });
  card.addEventListener('touchend', onEnd);
  card.addEventListener('mousedown', onStart);
  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', onEnd);
}

/* ===== تبديل الكارتين ===== */
function _swapNotifCards(topCard, behindCard) {
  if (!topCard || !behindCard) return;
  
  topCard.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease';
  behindCard.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease';
  
  topCard.style.transform = 'translateY(14px) scale(0.94)';
  topCard.style.opacity = '0.6';
  behindCard.style.transform = 'translateY(0) scale(1)';
  behindCard.style.opacity = '1';
  
  setTimeout(() => {
    topCard.classList.remove('is-top');
    topCard.classList.add('is-behind');
    behindCard.classList.add('is-top');
    behindCard.classList.remove('is-behind');
    
    topCard.style.transform = '';
    topCard.style.opacity = '';
    topCard.style.transition = '';
    behindCard.style.transform = '';
    behindCard.style.opacity = '';
    behindCard.style.transition = '';
  }, 400);
}

/* ============================================
   🔔 NOTIFICATION ROUTER — Auto-Switch
   ============================================ */
(function() {
  if (typeof window.showNotification !== 'function') return;
  if (window.showNotification._router) return;
  
  const _orig = window.showNotification;
  
  // 🔍 تحقق: هل المستخدم داخل الموقع؟
  function _isUserInside() {
    return document.visibilityState === 'visible';
  }
  
  window.showNotification = function(opts) {
    const o = Object.assign({}, opts || {});
    
    // مدة افتراضية
    if (o.duration === undefined) o.duration = 4000;
    
    // 🎯 هل النظام يسمح بالإشعارات؟
    const systemAllowed = appSettings.notifications 
                       && Notification.permission === 'granted'
                       && _notificationsSupported();
    
    // 🎯 هل المستخدم داخل الموقع؟
    const userInside = _isUserInside();
    
    let card = null;
    
    if (userInside) {
      // 🟢 داخل الموقع → In-App فقط
      const stack = document.getElementById('notifStack');
      if (stack) {
        const existing = stack.querySelectorAll('.notif-card:not(.dismissing)');
        if (existing.length >= NOTIF_MAX) {
          dismissNotif(existing[existing.length - 1]);
        }
      }
      
      card = _orig.call(this, o);
      
      if (card) {
        setTimeout(() => _setupNotifSwipe(card), 50);
      }
      setTimeout(_refreshNotifStack, 30);
      
    } else {
      // 🔴 خارج الموقع → System فقط
      if (systemAllowed && o.title) {
        // فئات الإشعارات المهمة (اللي تستحق system)
        const importantTypes = ['success', 'error', 'warning'];
        const isImportant = importantTypes.includes(o.type) || o.system === true;
        
        if (isImportant) {
          _sendSystemNotification(
            o.title,
            o.desc || '',
            {
              tag: o.tag || 'istore-sys-' + Date.now(),
              data: o.data || null
            }
          );
        }
      }
    }
    
    return card;
  };
  
  window.showNotification._router = true;
})();

console.log('✅ Notification Router (Auto-Switch) loaded');

/* ===== تحديث الترتيب عند الحذف ===== */
(function() {
  if (typeof window.dismissNotif !== 'function') return;
  if (window.dismissNotif._stackWrapped) return;
  
  const _orig = window.dismissNotif;
  
  window.dismissNotif = function(card) {
    if (card) _orig.call(this, card);
    setTimeout(_refreshNotifStack, 400);
  };
  
  window.dismissNotif._stackWrapped = true;
})();

console.log('✅ Notification Stack loaded (max 2)');
/* ============================================
   🎨 IOS CONFIRM DIALOG — Controller
   ============================================ */
let _iosConfirmResolve = null;

const CONFIRM_ICONS = {
info:    '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
  warning: '<svg viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  danger:  '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
  trash:   '<svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  wifi:    '<svg viewBox="0 0 24 24"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>',
  reset:   '<svg viewBox="0 0 24 24"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>',
  check:   '<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>'
};

function showIOSConfirm(options) {
  return new Promise((resolve) => {
    const o = options || {};
    const modal = document.getElementById('iosConfirmModal');
    const iconEl = document.getElementById('iosConfirmIcon');
    const titleEl = document.getElementById('iosConfirmTitle');
    const msgEl = document.getElementById('iosConfirmMessage');
    const cancelBtn = document.getElementById('iosConfirmCancel');
    const okBtn = document.getElementById('iosConfirmOk');
    
    if (!modal) { resolve(false); return; }
    
    const type = o.type || 'info';
    const iconKey = o.icon || type;
    
    iconEl.innerHTML = CONFIRM_ICONS[iconKey] || CONFIRM_ICONS.info;
    iconEl.className = 'ios-confirm-icon' + (type !== 'info' ? ' ' + type : '');
    
    titleEl.textContent = o.title || (currentLang === 'ar' ? 'تأكيد' : 'Confirm');
    msgEl.textContent = o.message || '';
    
    cancelBtn.querySelector('span').textContent = o.cancelText || (currentLang === 'ar' ? 'إلغاء' : 'Cancel');
    okBtn.querySelector('span').textContent = o.okText || (currentLang === 'ar' ? 'موافق' : 'Confirm');
    
    okBtn.className = 'ios-confirm-btn ios-confirm-ok' + (type !== 'info' ? ' ' + type : '');
    
    _iosConfirmResolve = resolve;
    
    modal.classList.add('open');
    if (navigator.vibrate) try { navigator.vibrate(8); } catch(e) {}
  });
}

function closeIOSConfirm(result) {
  const modal = document.getElementById('iosConfirmModal');
  if (modal) modal.classList.remove('open');
  
  const resolve = _iosConfirmResolve;
  _iosConfirmResolve = null;
  
  if (resolve) resolve(result);
}

console.log('✅ IOS Confirm Dialog loaded');
 
/* ============================================
   🔔 NOTIFICATIONS — Real System Notifications
   ============================================ */

/* التحقق من دعم الإشعارات */
function _notificationsSupported() {
  return 'Notification' in window;
}

/* إرسال إشعار نظام حقيقي */
function _sendSystemNotification(title, body, options) {
  // تحقق: المستخدم مفعّل الإشعارات + المتصفح يدعم
  if (!appSettings.notifications) return false;
  if (!_notificationsSupported()) return false;
  if (Notification.permission !== 'granted') return false;
  
  try {
    const opts = Object.assign({
      body: body || '',
      icon: 'https://raw.githubusercontent.com/benssariyassine-tech/iPA-Store/main/static/icon.png',
      badge: 'https://raw.githubusercontent.com/benssariyassine-tech/iPA-Store/main/static/icon.png',
      tag: 'istore-notif-' + Date.now(),
      requireInteraction: false,
      silent: false
    }, options || {});
    
    const notif = new Notification(title, opts);
    
    // كي يضغط على الإشعار → يفتح الموقع
    notif.onclick = function() {
      window.focus();
      if (opts.data && opts.data.url) {
        window.location.href = opts.data.url;
      }
      notif.close();
    };
    
    // سد تلقائي بعد 8 ثواني
    setTimeout(() => { try { notif.close(); } catch(e) {} }, 8000);
    
    return true;
  } catch(e) {
    console.warn('System notif error:', e);
    return false;
  }
}

/* ============================================
   🔄 UPDATE ALERTS — Check for New Apps
   ============================================ */

/* مفتاح آخر فحص */
function _getLastUpdateCheckKey() {
  return 'istore_last_update_check';
}

/* جيب آخر فحص */
function _getLastUpdateCheck() {
  try {
    return parseInt(localStorage.getItem(_getLastUpdateCheckKey()) || '0', 10) || 0;
  } catch(e) { return 0; }
}

/* احفظ آخر فحص */
function _setLastUpdateCheck(timestamp) {
  try {
    localStorage.setItem(_getLastUpdateCheckKey(), String(timestamp));
  } catch(e) {}
}

/* تحقق من التحديثات الجديدة */
 function _checkForUpdates() {
  if (!appSettings.updateAlerts) return;
  if (!appSettings.notifications) return;
  if (Notification.permission !== 'granted') return;
  
  const lastCheck = _getLastUpdateCheck();
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;
  
  // إذا فحصنا في آخر 24 ساعة → ما نعاودوش
  if (now - lastCheck < oneDay) return;
  
  // جيب التطبيقات الجديدة (في آخر 7 أيام)
  const newApps = allAppsCache.filter(app => {
    if (!app.createdAt || !app.createdAt.seconds) return false;
    const appTime = app.createdAt.seconds * 1000;
    return appTime > lastCheck && appTime > (now - 7 * oneDay);
  });
  
  if (newApps.length > 0) {
    const appNames = newApps.slice(0, 3).map(a => a.name).join(', ');
    const count = newApps.length;
    
    const title = currentLang === 'ar' 
      ? `🆕 ${count} تطبيق جديد` 
      : `🆕 ${count} new ${count > 1 ? 'apps' : 'app'}`;
    
    const desc = currentLang === 'ar'
      ? `تم إضافة: ${appNames}${count > 3 ? ' والمزيد...' : ''}`
      : `Added: ${appNames}${count > 3 ? ' and more...' : ''}`;
    
    // 🎯 استعمل showNotification — الـ Router كيقرر (in-app ولا system)
    if (typeof showNotification === 'function') {
      showNotification({
        title: title,
        desc: desc,
        type: 'success',
        duration: 10000,
        vibrate: true,
        data: { url: '/' }
      });
    }
  }
  
  _setLastUpdateCheck(now);
}

/* ============================================
   🚀 INITIALIZATION — شغل Check Updates بعد ما تحمل
   ============================================ */
setTimeout(() => {
  // استنى 3 ثواني حتى تجي البيانات من Firebase
  _checkForUpdates();
}, 3000);

console.log('✅ System Notifications + Update Alerts loaded');
 
/* ============================================
   👤 ACCOUNT HEADER — Dynamic Avatar
   ============================================ */
function updateHeaderAccountBtn() {
  const btn = document.getElementById('accountHeaderBtn');
  if (!btn) return;
  
  // ✅ الحالة 1: ماشي مسجل
  if (!currentUser) {
    btn.classList.remove('has-avatar', 'has-initial');
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
    return;
  }
  
  // ✅ الحالة 2: مسجل + عندو صورة
  if (userProfile.avatar && userProfile.avatar.startsWith('data:') || (userProfile.avatar && userProfile.avatar.startsWith('http'))) {
    btn.classList.remove('has-initial');
    btn.classList.add('has-avatar');
    btn.innerHTML = '<img src="' + userProfile.avatar + '" alt="Avatar" onerror="this.parentNode.classList.remove(\'has-avatar\'); this.parentNode.classList.add(\'has-initial\'); this.parentNode.innerHTML=\'<span class=&quot;account-header-initial&quot;>' + ((userProfile.displayName || 'U').charAt(0).toUpperCase()) + '</span>\';">';
    return;
  }
  
  // ✅ الحالة 3: مسجل بلا صورة → أول حرف
  const initial = (userProfile.displayName || (currentUser && currentUser.email) || 'U').charAt(0).toUpperCase();
  btn.classList.remove('has-avatar');
  btn.classList.add('has-initial');
  btn.innerHTML = '<span class="account-header-initial">' + initial + '</span>';
}

console.log('✅ Account Header loaded');
 
/* ============================================
   📦 ISTORE VERSION CHECK
   ============================================ */

const ISTORE_VERSION = '3.1'; // 🔄 بدّل هذا كي تصدر نسخة جديدة
const ISTORE_VERSION_CHECK_KEY = 'istore_last_version_check';

function _getLastVersionCheck() {
  try {
    return parseInt(localStorage.getItem(ISTORE_VERSION_CHECK_KEY) || '0', 10) || 0;
  } catch(e) { return 0; }
}

function _setLastVersionCheck(timestamp) {
  try {
    localStorage.setItem(ISTORE_VERSION_CHECK_KEY, String(timestamp));
  } catch(e) {}
}

function _getStoredVersion() {
  try {
    return localStorage.getItem('istore_app_version') || '';
  } catch(e) { return ''; }
}

function _setStoredVersion(version) {
  try {
    localStorage.setItem('istore_app_version', version);
  } catch(e) {}
}

function _checkAppVersion() {
  const storedVersion = _getStoredVersion();
  const now = Date.now();
  const lastCheck = _getLastVersionCheck();
  const oneDay = 24 * 60 * 60 * 1000;
  
  // 🆕 إذا تغيرت النسخة → أظهر إشعار
  if (storedVersion && storedVersion !== ISTORE_VERSION) {
    // نسخة جديدة!
    _setStoredVersion(ISTORE_VERSION);
    
    const title = currentLang === 'ar' 
      ? `🎉 iStore محدّث — v${ISTORE_VERSION}` 
      : `🎉 iStore updated — v${ISTORE_VERSION}`;
    
    const body = currentLang === 'ar'
      ? 'تم إضافة ميزات جديدة! افتح الإعدادات لاستكشافها.'
      : 'New features added! Open settings to explore.';
    
    // إذا المستخدم داخل → In-App
    // إذا خارج → System
    if (typeof showNotification === 'function') {
      showNotification({
        title: title,
        desc: body,
        type: 'success',
        duration: 8000,
        vibrate: true,
        data: { url: '/' }
      });
    }
    
    // ما نعاودوش الفحص اليوم
    _setLastVersionCheck(now);
    return;
  }
  
  // أول مرة → احفظ النسخة
  if (!storedVersion) {
    _setStoredVersion(ISTORE_VERSION);
    _setLastVersionCheck(now);
    return;
  }
  
  // فحص عادي (كل 24 ساعة) — ممكن نضيفو منطق مستقبلاً
  if (now - lastCheck > oneDay) {
    _setLastVersionCheck(now);
  }
}

// شغلها بعد ما يتحمل الموقع
setTimeout(_checkAppVersion, 2000);

console.log('✅ iStore Version Check loaded');
 
/* ============================================
   🎯 ONBOARDING TOUR — Spotlight Controller
   ============================================ */

const TOUR_STORAGE_KEY = 'istore_tour_v3_done';

// ⚙️ إعدادات الجولة — عدّل النصوص هنا
const TOUR_STEPS = [
  {
    selector: 'body',
    icon: '<svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>',
    title: { ar: 'مرحباً بك في iStore', en: 'Welcome to iStore' },
    message: { 
      ar: 'منصّتك الشاملة لتحميل تطبيقات وألعاب iOS و Android. جولة سريعة ستعرّفك على أهم الميزات.',
      en: 'Your hub for iOS & Android apps. A quick tour will introduce you to the key features.'
    },
    padding: 0,
    position: 'center'
  },
  {
    selector: '.search-box',
    icon: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
    title: { ar: 'البحث الذكي', en: 'Smart Search' },
    message: { 
      ar: 'ابحث عن أي تطبيق أو لعبة بسرعة. نتائج فورية مع فلاتر ذكية.',
      en: 'Find any app or game instantly. Instant results with smart filters.'
    },
    padding: 6,
    position: 'bottom'
  },
  {
    selector: '.header-icons',
    icon: '<svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    title: { ar: 'حسابك الشخصي', en: 'Your Account' },
    message: { 
      ar: 'سجّل دخولك للإعجاب بالتطبيقات، كتابة التعليقات، وتخصيص تجربتك.',
      en: 'Sign in to like apps, post comments, and personalize your experience.'
    },
    padding: 8,
    position: 'bottom'
  },
  {
    selector: '.floating-nav',
    icon: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
    title: { ar: 'التنقّل السريع', en: 'Quick Navigation' },
    message: { 
      ar: 'تنقّل بين الفئات: اليوم، الألعاب، التطبيقات، والأدوات.',
      en: 'Switch between categories: Today, Games, Apps, and Tools.'
    },
    padding: 8,
    position: 'top'
  },
  {
    selector: '.support-menu-wrap',
    icon: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
    title: { ar: 'الإعدادات والدعم', en: 'Settings & Support' },
    message: { 
      ar: 'خصّص تجربتك (الثيم، اللغة، الإشعارات) وتواصل مع الدعم الفني من هنا.',
      en: 'Customize your experience (theme, language, notifications) and contact support.'
    },
    padding: 8,
    position: 'top'
  },
  {
    selector: 'body',
    icon: '<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>',
    title: { ar: 'أنت جاهز!', en: 'You\'re ready!' },
    message: { 
      ar: 'استمتع بتجربة iStore الجديدة. لا تتردد في استكشاف كل الميزات بنفسك.',
      en: 'Enjoy the new iStore experience. Feel free to explore all the features yourself.'
    },
    padding: 0,
    position: 'center'
  }
];

let _tourIndex = 0;
let _tourActive = false;

/* ===== بدء الجولة ===== */
function startTour() {
  const welcome = document.getElementById('tourWelcome');
  if (welcome) welcome.classList.remove('open');
  
  _tourIndex = 0;
  _tourActive = true;
  
  const overlay = document.getElementById('tourOverlay');
  if (overlay) overlay.classList.add('open');
  
  setTimeout(() => showTourStep(0), 300);
}

/* ===== عرض خطوة ===== */
function showTourStep(index) {
  if (index < 0 || index >= TOUR_STEPS.length) return;
  
  _tourIndex = index;
  const step = TOUR_STEPS[index];
  const lang = (typeof currentLang !== 'undefined') ? currentLang : 'ar';
  
  // حدّث النصوص
  document.getElementById('tourTitleText').textContent = step.title[lang] || step.title.ar;
  document.getElementById('tourMessageText').textContent = step.message[lang] || step.message.ar;
  document.getElementById('tourTitleIcon').innerHTML = step.icon;
  document.getElementById('tourProgressText').textContent = (index + 1) + ' / ' + TOUR_STEPS.length;
  document.getElementById('tourProgressFill').style.width = ((index + 1) / TOUR_STEPS.length * 100) + '%';
  
  // آخر خطوة → بدّل النص
  if (index === TOUR_STEPS.length - 1) {
    document.getElementById('tourNextText').textContent = lang === 'ar' ? 'إنهاء' : 'Finish';
    document.getElementById('tourSkipBtn').style.display = 'none';
  } else {
    document.getElementById('tourNextText').textContent = lang === 'ar' ? 'التالي' : 'Next';
    document.getElementById('tourSkipBtn').style.display = '';
  }
  
  // حدد العنصر
  const el = step.selector === 'body' ? document.body : document.querySelector(step.selector);
  if (!el || step.position === 'center') {
    // شاشة وسطية (welcome / finish)
    document.getElementById('tourSpotlight').classList.remove('active');
    
    const tooltip = document.getElementById('tourTooltip');
    tooltip.style.top = '50%';
    tooltip.style.left = '50%';
    tooltip.style.transform = 'translate(-50%, -50%)';
    return;
  }
  
  // سكرول للعنصر
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  
  setTimeout(() => {
    const rect = el.getBoundingClientRect();
    const pad = step.padding || 8;
    
    // Spotlight
    const spotlight = document.getElementById('tourSpotlight');
    spotlight.style.top = (rect.top - pad) + 'px';
    spotlight.style.left = (rect.left - pad) + 'px';
    spotlight.style.width = (rect.width + pad * 2) + 'px';
    spotlight.style.height = (rect.height + pad * 2) + 'px';
    spotlight.classList.add('active');
    
    // Tooltip — positioning
    const tooltip = document.getElementById('tourTooltip');
    tooltip.style.transform = 'none';
    
    const tooltipWidth = 320;
    const tooltipHeight = 220;
    const margin = 16;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    
    let top, left;
    
    if (step.position === 'bottom') {
      top = rect.bottom + pad + 16;
      left = rect.left + rect.width / 2 - tooltipWidth / 2;
    } else if (step.position === 'top') {
      top = rect.top - pad - tooltipHeight - 16;
      left = rect.left + rect.width / 2 - tooltipWidth / 2;
    } else {
      top = rect.bottom + pad + 16;
      left = rect.left;
    }
    
    // clamp داخل الشاشة
    if (left < 12) left = 12;
    if (left + tooltipWidth > vw - 12) left = vw - tooltipWidth - 12;
    if (top < 12) top = rect.bottom + pad + 16;
    if (top + tooltipHeight > vh - 12) top = rect.top - pad - tooltipHeight - 16;
    if (top < 12) top = 12;
    
    tooltip.style.top = top + 'px';
    tooltip.style.left = left + 'px';
  }, 450);
}

/* ===== الخطوة التالية ===== */
function nextTourStep() {
  if (_tourIndex >= TOUR_STEPS.length - 1) {
    endTour();
    return;
  }
  showTourStep(_tourIndex + 1);
  if (navigator.vibrate) try { navigator.vibrate(8); } catch(e) {}
}

/* ===== نهاية الجولة ===== */
function endTour() {
  _tourActive = false;
  
  const overlay = document.getElementById('tourOverlay');
  if (overlay) overlay.classList.remove('open');
  
  try { localStorage.setItem(TOUR_STORAGE_KEY, 'true'); } catch(e) {}
  
  if (navigator.vibrate) try { navigator.vibrate([10, 30, 10]); } catch(e) {}
}

/* ===== تخطّي ===== */
function skipTour() {
  endTour();
  try { localStorage.setItem(TOUR_STORAGE_KEY, 'true'); } catch(e) {}
}

/* ===== فحص إذا لازم نعرضو الجولة ===== */
function checkTourStatus() {
  try {
    const done = localStorage.getItem(TOUR_STORAGE_KEY);
    if (done === 'true') return;
  } catch(e) {}
  
  // أول زيارة → عرض Welcome
  setTimeout(() => {
    const welcome = document.getElementById('tourWelcome');
    if (welcome) welcome.classList.add('open');
  }, 4500); // بعد ما يكمل splash
}

/* ===== إغلاق بالضغط على الـ backdrop ===== */
document.getElementById('tourOverlay')?.addEventListener('click', function(e) {
  if (e.target === this || e.target.classList.contains('tour-backdrop')) {
    // ما نسدوش بالضغط — باش ما يخسرش المستخدم الجولة
  }
});

/* ===== إعادة الجولة يدوياً (للاستعمال في Settings) ===== */
function restartTour() {
  try { localStorage.removeItem(TOUR_STORAGE_KEY); } catch(e) {}
  const welcome = document.getElementById('tourWelcome');
  if (welcome) welcome.classList.add('open');
}

// شغّل الفحص بعد ما يتحمل الموقع
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', checkTourStatus);
} else {
  checkTourStatus();
}

console.log('✅ Onboarding Tour loaded');
console.log('✅ Login Page JS loaded');
const ACT_T = {
  en: {
    title: 'Your Activity',
    settingsBtnSub: 'Devices connected to your account',
    currentSection: 'THIS DEVICE',
    currentBadge: 'Current Device',
    othersSection: 'OTHER DEVICES',
    logoutAll: 'Sign out from all devices',
    logoutAllSub: 'This will end every session including this one',
    changePass: 'Change Password',
    changePassSub: 'Update your account password',
    chgTitle: 'Change Password',
    chgCurrent: 'CURRENT PASSWORD',
    chgCurrentPh: 'Enter current password',
    chgNew: 'NEW PASSWORD',
    chgNewPh: 'At least 6 characters',
    chgNewPh2: 'Repeat new password',
    chgNote: 'For security, you must enter your current password. If you forgot it, sign out and use Forgot password or sign in with Google.',
    chgBtn: 'Update Password',
    loading: 'Loading...',
    noOthers: 'No other devices',
    noOthersSub: 'Your account is only signed in on this device',
    failedLoad: 'Failed to load devices',
    failedRemove: 'Failed to sign out device',
    removed: 'Device signed out',
    removedAll: 'Signed out from {n} device(s)',
    logout: 'Sign Out',
    isThisYou: 'Is this you?',
    removedTitle: 'Device signed out',
    removedMsg: 'Are you sure you want to sign out {name}?',
    okRemove: 'Sign Out',
    cancel: 'Cancel',
    secTitle: 'Security Alert',
    secMsg: 'The device was signed out. We recommend changing your password now to protect your account.',
    secOk: 'Change Password',
    secLater: 'Later',
    allTitle: 'Sign out from all devices',
    allMsg: 'You will be signed out from every device, including this one. Continue?',
    allOk: 'Sign Out All',
    confirmTitle: 'Is this your device?',
    confirmMsg: 'A sign-in was detected from: {name} . If this was not you, we will sign out this device and ask you to change your password.',
    yesMine: 'Yes, this is me',
    noNotMine: 'No, not me',
    trusted: 'Device marked as trusted',
    momentsAgo: 'moments ago',
    minsAgo: 'min ago',
    hoursAgo: 'h ago',
    daysAgo: 'd ago'
  },
  ar: {
    title: 'أنشطتك',
    settingsBtnSub: 'الأجهزة المتصلة بحسابك',
    currentSection: 'هذا الجهاز',
    currentBadge: 'الجهاز الحالي',
    othersSection: 'أجهزة أخرى',
    logoutAll: 'تسجيل الخروج من جميع الأجهزة',
    logoutAllSub: 'سيتم إنهاء كل الجلسات بما فيها هذا الجهاز',
    changePass: 'تغيير كلمة المرور',
    changePassSub: 'حدّث كلمة السر الخاصة بحسابك',
    chgTitle: 'تغيير كلمة المرور',
    chgCurrent: 'كلمة المرور الحالية',
    chgCurrentPh: 'أدخل كلمة السر الحالية',
    chgNew: 'كلمة المرور الجديدة',
    chgNewPh: '6 أحرف على الأقل',
    chgNewPh2: 'أعد كتابة كلمة السر الجديدة',
    chgNote: 'للحماية، خاصك تدخل كلمة السر القديمة. إذا نسيتها، خرج من الحساب واستعمل نسيت كلمة المرور أو دخل بحساب Google.',
    chgBtn: 'تحديث كلمة المرور',
    loading: 'جاري التحميل',
    noOthers: 'ما كاينش أجهزة أخرى',
    noOthersSub: 'حسابك مسجل غير في هذا الجهاز',
    failedLoad: 'تعذر تحميل الأجهزة',
    failedRemove: 'تعذر الإخراج',
    removed: 'تم إخراج الجهاز',
    removedAll: 'تم إخراج {n} جهاز',
    logout: 'إخراج',
    isThisYou: 'هل هذا نتا',
    removedTitle: 'إخراج الجهاز',
    removedMsg: 'تأكيد إخراج {name} من حسابك',
    okRemove: 'إخراج',
    cancel: 'إلغاء',
    secTitle: 'تنبيه أمني',
    secMsg: 'الجهاز تم إخراجه. ننصحك تبدل كلمة السر فوراً باش تحمي حسابك.',
    secOk: 'نعم، بدل كلمة السر',
    secLater: 'بعدين',
    allTitle: 'إخراج كل الأجهزة',
    allMsg: 'راح تخرج من كل الأجهزة، بما فيها هذا الجهاز. متأكد',
    allOk: 'إخراج الكل',
    confirmTitle: 'هل هذا جهازك',
    confirmMsg: 'سجل هذا الجهاز دخول من: {name} . إذا ما كنتش نتا، راح نخرجه ونطلب منك تبدل كلمة السر.',
    yesMine: 'نعم، هذا أنا',
    noNotMine: 'لا، ماشي أنا',
    trusted: 'تم تسجيل الجهاز كموثوق',
    momentsAgo: 'قبل لحظات',
    minsAgo: 'دقيقة',
    hoursAgo: 'ساعة',
    daysAgo: 'يوم'
  }
};

function actT(key, vars) {
  const lang = (typeof currentLang !== 'undefined' && currentLang === 'ar') ? 'ar' : 'en';
  let str = (ACT_T[lang] && ACT_T[lang][key]) || (ACT_T.en[key]) || key;
  if (vars) {
    Object.keys(vars).forEach(k => { str = str.replace('{' + k + '}', vars[k]); });
  }
  return str;
}

function applyActivitiesTranslations() {
  document.querySelectorAll('[data-act]').forEach(el => {
    const key = el.getAttribute('data-act');
    if (key) el.textContent = actT(key);
  });
  document.querySelectorAll('[data-act-ph]').forEach(el => {
    const key = el.getAttribute('data-act-ph');
    if (key) el.placeholder = actT(key);
  });
}

/* ============================================
   📱 DEVICE FINGERPRINT — بصمة ثابتة للجهاز
   (كي تكون نفس الشي في Safari و PWA)
   ============================================ */
function getDeviceFingerprint() {
  const ua = navigator.userAgent || '';
  const screenInfo = window.screen ? (window.screen.width + 'x' + window.screen.height + 'x' + window.screen.colorDepth) : '';
  const tz = (typeof Intl !== 'undefined' && Intl.DateTimeFormat) 
    ? (Intl.DateTimeFormat().resolvedOptions().timeZone || '') 
    : '';
  const lang = navigator.language || '';
  const platform = navigator.platform || '';
  
  // 🧹 ننقيو الـ UA: نحيدو "Standalone" و PWA markers باش يكون نفس الشي
  const cleanUA = ua
    .replace(/\s*\(KHTML, like Gecko\)/g, '')
    .replace(/\s*Standalone/gi, '')
    .replace(/\s*PWA/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
  
  // 🔗 نجمعو كل شي في string
  const raw = cleanUA + '|' + screenInfo + '|' + tz + '|' + lang + '|' + platform;
  
  // 🔢 Hash (FNV-1a) باش نوليدو ID قصير وثابت
  let hash = 0x811c9dc5;
  for (let i = 0; i < raw.length; i++) {
    hash ^= raw.charCodeAt(i);
    hash = (hash * 0x01000193) >>> 0;
  }
  
  return 'dev_' + hash.toString(36);
}

function getDeviceId() {
  // ✅ نستعملو fingerprint ثابت بدل localStorage
  // هكا Safari و PWA كيشوفو نفس الجهاز
  return getDeviceFingerprint();
}

function getDeviceInfo() {
  const ua = navigator.userAgent || '';
  let deviceName = 'Unknown Device';
  let deviceType = 'desktop';
  let os = 'Unknown';
  let browser = 'Unknown';
  let osIcon = 'monitor';

  if (/iPhone/i.test(ua)) { os = 'iPhone'; deviceType = 'mobile'; deviceName = 'iPhone'; osIcon = 'smartphone'; }
  else if (/iPad/i.test(ua)) { os = 'iPad'; deviceType = 'tablet'; deviceName = 'iPad'; osIcon = 'tablet'; }
  else if (/Android/i.test(ua)) {
    os = 'Android';
    deviceType = /Mobile/i.test(ua) ? 'mobile' : 'tablet';
    const m = ua.match(/Android[^;]*;\s*([^)]+?)(?:\s+Build|\))/);
    deviceName = m ? m[1].trim() : (deviceType === 'mobile' ? 'Android Phone' : 'Android Tablet');
    osIcon = deviceType === 'mobile' ? 'smartphone' : 'tablet';
  }
  else if (/Macintosh|Mac OS X/i.test(ua)) { os = 'macOS'; deviceName = 'Mac'; osIcon = 'laptop'; }
  else if (/Windows/i.test(ua)) { os = 'Windows'; deviceName = 'Windows PC'; osIcon = 'monitor'; }
  else if (/Linux/i.test(ua)) { os = 'Linux'; deviceName = 'Linux'; osIcon = 'monitor'; }

  if (/Edg\//i.test(ua)) { browser = 'Edge'; }
  else if (/OPR\/|Opera/i.test(ua)) { browser = 'Opera'; }
  else if (/Chrome\//i.test(ua)) { browser = 'Chrome'; }
  else if (/Safari\//i.test(ua)) { browser = 'Safari'; }
  else if (/Firefox\//i.test(ua)) { browser = 'Firefox'; }

  const isPWA = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  if (isPWA) browser += ' (PWA)';

  return { deviceName: deviceName, os: os, browser: browser, deviceType: deviceType, userAgent: ua.substring(0, 200), osIcon: osIcon, isPWA: isPWA };
}

async function saveDeviceSession() {
  if (!currentUser) return;
  const deviceId = getDeviceId();
  const info = getDeviceInfo();
  const sessionRef = db.collection('users').doc(currentUser.uid).collection('sessions').doc(deviceId);

  try {
    const doc = await sessionRef.get();
    const payload = {
      deviceName: info.deviceName,
      os: info.os,
      browser: info.browser,
      deviceType: info.deviceType,
      osIcon: info.osIcon,
      isPWA: info.isPWA,
      userAgent: info.userAgent,
      lastActive: firebase.firestore.FieldValue.serverTimestamp()
    };
    if (doc.exists) {
      await sessionRef.update(payload);
    } else {
      payload.createdAt = firebase.firestore.FieldValue.serverTimestamp();
      payload.userEmail = currentUser.email || '';
      await sessionRef.set(payload);
    }
    console.log('[Session] Saved:', deviceId, info.deviceName);
  } catch (e) {
    console.warn('[Session] Save failed:', e);
  }
}

setInterval(function() { if (currentUser) saveDeviceSession(); }, 5 * 60 * 1000);

function openActivitiesPage() {
  if (!currentUser) {
    showToast(currentLang === 'ar' ? 'سجّل الدخول أولاً' : 'Please sign in first', 'warning', 2000);
    return;
  }
  const page = document.getElementById('activitiesPage');
  if (!page) return;

  applyActivitiesTranslations();
  page.classList.add('open');
  document.body.classList.add('stg-open', 'overlay-active');

  const nav = document.querySelector('.isto-nav-wrap');
  if (nav) nav.style.opacity = '0';

  saveDeviceSession().then(function() { loadSessions(); });
  if (navigator.vibrate) try { navigator.vibrate(8); } catch(e) {}
}

function closeActivitiesPage() {
  const page = document.getElementById('activitiesPage');
  if (!page) return;
  page.classList.remove('open');
  document.body.classList.remove('stg-open', 'overlay-active');
  const nav = document.querySelector('.isto-nav-wrap');
  if (nav) nav.style.opacity = '';
  if (navigator.vibrate) try { navigator.vibrate(8); } catch(e) {}
}

function timeAgo(date) {
  if (!date) return actT('momentsAgo');
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  const lang = (typeof currentLang !== 'undefined' && currentLang === 'ar') ? 'ar' : 'en';
  if (diff < 60) return actT('momentsAgo');
  if (diff < 3600) return Math.floor(diff / 60) + ' ' + actT('minsAgo');
  if (diff < 86400) return Math.floor(diff / 3600) + ' ' + actT('hoursAgo');
  if (diff < 2592000) return Math.floor(diff / 86400) + ' ' + actT('daysAgo');
  return date.toLocaleDateString(lang);
}

function getDeviceSvg(icon) {
  if (icon === 'smartphone') return '<rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>';
  if (icon === 'tablet') return '<rect x="4" y="2" width="16" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>';
  if (icon === 'laptop') return '<path d="M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v11H4z"/><line x1="2" y1="19" x2="22" y2="19"/>';
  return '<rect x="3" y="4" width="18" height="13" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>';
}

async function loadSessions() {
  if (!currentUser) return;
  const myDeviceId = getDeviceId();

  try {
    const snap = await db.collection('users').doc(currentUser.uid)
                      .collection('sessions')
                      .orderBy('lastActive', 'desc')
                      .get();

    const all = [];
    snap.forEach(function(doc) { all.push(Object.assign({ id: doc.id }, doc.data())); });

    console.log('[Session] Loaded', all.length, 'sessions');

    const mine = all.find(function(s) { return s.id === myDeviceId; }) || Object.assign(getDeviceInfo(), { createdAt: null, lastActive: null });
    const others = all.filter(function(s) { return s.id !== myDeviceId; });

    document.getElementById('curDevName').textContent = mine.deviceName || 'Unknown';
    document.getElementById('curDevInfo').textContent = (mine.os || 'Unknown') + ' \u2022 ' + (mine.browser || 'Unknown');

    const othersCard = document.getElementById('otherSessionsCard');
    const countEl = document.getElementById('otherDevicesCount');

    if (others.length === 0) {
      countEl.textContent = '';
      othersCard.innerHTML = '<div style="padding:32px 16px;text-align:center;">' +
        '<svg style="width:56px;height:56px;margin:0 auto 12px;stroke:var(--border-color);fill:none;stroke-width:1.5;" viewBox="0 0 24 24">' +
        '<rect x="5" y="2" width="14" height="20" rx="2"/>' +
        '<line x1="12" y1="18" x2="12.01" y2="18"/></svg>' +
        '<div style="color:var(--text-color);font-weight:700;font-size:14px;margin-bottom:4px;">' + actT('noOthers') + '</div>' +
        '<div style="color:var(--subtext-color);font-size:12px;">' + actT('noOthersSub') + '</div>' +
        '</div>';
      return;
    }

    countEl.textContent = others.length;

    let html = '';
    others.forEach(function(s) {
      const lastDate = s.lastActive && s.lastActive.toDate ? s.lastActive.toDate() : null;
      const when = timeAgo(lastDate);
      const devNameEsc = escapeHTML(s.deviceName || 'Device');
      const osEsc = escapeHTML(s.os || '');
      const brEsc = escapeHTML(s.browser || '');
      const devNameSafe = devNameEsc.replace(/'/g, '');
      html += '<div class="stg-row" style="align-items:flex-start;padding:16px;border-bottom:1px solid var(--border-color);" id="session_' + s.id + '">' +
        '<div class="stg-icon" style="background:linear-gradient(135deg,rgba(255,159,10,0.18),rgba(255,159,10,0.06));color:var(--warning);">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        getDeviceSvg(s.osIcon) + '</svg></div>' +
        '<div class="stg-info" style="flex:1;min-width:0;">' +
        '<div class="stg-name">' + devNameEsc + '</div>' +
        '<div class="stg-sub">' + osEsc + ' \u2022 ' + brEsc + '</div>' +
        '<div style="font-size:11px;color:var(--warning);font-weight:700;margin-top:6px;display:flex;align-items:center;gap:5px;">' +
        '<svg style="width:11px;height:11px;stroke:currentColor;fill:none;stroke-width:2.5;" viewBox="0 0 24 24">' +
        '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' +
        when + '</div></div>' +
        '<div style="display:flex;flex-direction:column;gap:6px;">' +
   '<button onclick="confirmRemoveSession(\'' + s.id + '\', \'' + devNameSafe + '\')" ' +
'style="background:rgba(255,69,58,0.12);color:var(--danger);border:1px solid rgba(255,69,58,0.25);padding:7px 12px;border-radius:10px;font-weight:800;font-size:11px;cursor:pointer;font-family:inherit;white-space:nowrap;">' +
actT('logout') + '</button>' +
((s.trusted === true) ? 
  '<span style="display:inline-flex;align-items:center;gap:4px;background:rgba(50,215,75,0.12);color:var(--success);border:1px solid rgba(50,215,75,0.25);padding:6px 10px;border-radius:10px;font-weight:800;font-size:10px;white-space:nowrap;">' +
    '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' +
    (currentLang === 'ar' ? 'موثوق' : 'Trusted') +
  '</span>'
  :
  '<button onclick="askIsThisYou(\'' + s.id + '\', \'' + devNameSafe + '\')" ' +
  'style="background:var(--input-bg);color:var(--text-color);border:1px solid var(--border-color);padding:7px 12px;border-radius:10px;font-weight:700;font-size:11px;cursor:pointer;font-family:inherit;white-space:nowrap;">' +
  actT('isThisYou') + '</button>'
) +
'</div></div>';
    });

    othersCard.innerHTML = html;

  } catch (e) {
    console.warn('[Session] Load failed:', e);
    document.getElementById('otherSessionsCard').innerHTML =
      '<div style="padding:24px;text-align:center;color:var(--danger);font-size:13px;">' + actT('failedLoad') + '</div>';
  }
}

async function askIsThisYou(sessionId, deviceName) {
  const isNotMe = await showIOSConfirm({
    type: 'info',
    icon: 'info',
    title: actT('confirmTitle'),
    message: actT('confirmMsg', { name: deviceName }),
    okText: actT('noNotMine'),
    cancelText: actT('yesMine')
  });

  if (isNotMe) {
    // المستخدم قال "لا، ماشي أنا" → نخرجو الجهاز
    await removeSession(sessionId, true);
  } else {
    // المستخدم قال "نعم، هذا أنا" → نسجلو الجهاز كـ trusted
    try {
      await db.collection('users').doc(currentUser.uid)
              .collection('sessions').doc(sessionId).update({
                trusted: true,
                trustedAt: firebase.firestore.FieldValue.serverTimestamp()
              });
      
      // نسدو الـ modal بلا Toast
      loadSessions();
    } catch (e) {
      console.warn('[Trust] Save failed:', e);
    }
  }
}
async function confirmRemoveSession(sessionId, deviceName) {
  const ok = await showIOSConfirm({
    type: 'danger',
    icon: 'trash',
    title: actT('removedTitle'),
    message: actT('removedMsg', { name: deviceName }),
    okText: actT('okRemove'),
    cancelText: actT('cancel')
  });
  if (ok) await removeSession(sessionId, false);
}

async function removeSession(sessionId, securityMode) {
  if (!currentUser) return;
  try {
    // ✅ 1. نسجلو flag "forceLogout" باش الجهاز الآخر يخرج
    await db.collection('users').doc(currentUser.uid)
            .collection('sessions').doc(sessionId).update({
              forceLogout: true,
              forceLogoutAt: firebase.firestore.FieldValue.serverTimestamp()
            });

    // ✅ 2. بعد ثانيتين، نحذفو الجلسة نهائياً
    setTimeout(async () => {
      try {
        await db.collection('users').doc(currentUser.uid)
                .collection('sessions').doc(sessionId).delete();
      } catch(e) {}
    }, 2000);

    const el = document.getElementById('session_' + sessionId);
    if (el) {
      el.style.transition = 'all 0.4s ease';
      el.style.opacity = '0';
      el.style.transform = 'translateX(60px)';
      setTimeout(function() { el.remove(); loadSessions(); }, 400);
    }

    if (securityMode) {
      const changeNow = await showIOSConfirm({
        type: 'warning',
        icon: 'warning',
        title: actT('secTitle'),
        message: actT('secMsg'),
        okText: actT('secOk'),
        cancelText: actT('secLater')
      });
      if (changeNow) {
        closeActivitiesPage();
        setTimeout(openChangePasswordPage, 300);
      }
    } else {
      showToast(actT('removed'), 'success', 2000);
    }
  } catch (e) {
    console.warn('[Session] Remove failed:', e);
    showToast(actT('failedRemove'), 'error', 2000);
  }
}

async function logoutAllDevices() {
  if (!currentUser) return;
  const ok = await showIOSConfirm({
    type: 'danger',
    icon: 'warning',
    title: actT('allTitle'),
    message: actT('allMsg'),
    okText: actT('allOk'),
    cancelText: actT('cancel')
  });
  if (!ok) return;

  try {
    const snap = await db.collection('users').doc(currentUser.uid).collection('sessions').get();
    const batch = db.batch();
    let count = 0;
    snap.forEach(function(doc) {
      batch.delete(doc.ref);
      count++;
    });
    await batch.commit();

    try { localStorage.removeItem('istore_device_id'); } catch(e) {}

    closeActivitiesPage();
    showToast(actT('removedAll', { n: count }), 'success', 2500);

    setTimeout(function() {
      auth.signOut().then(function() {
        showToast(currentLang === 'ar' ? 'تم تسجيل الخروج' : 'Signed out', 'info', 2000);
      });
    }, 800);

  } catch (e) {
    console.warn('[Session] Logout all failed:', e);
    showToast(actT('failedRemove'), 'error', 2500);
  }
}

function openChangePasswordPage() {
  if (!currentUser) {
    showToast(currentLang === 'ar' ? 'سجّل الدخول أولاً' : 'Please sign in first', 'warning', 2000);
    return;
  }
  const isEmailProvider = currentUser.providerData.some(function(p) { return p.providerId === 'password'; });
  if (!isEmailProvider) {
    showToast(
      currentLang === 'ar'
        ? 'حسابك ماشي بالإيميل، ما تقدرش تبدل كلمة السر'
        : 'Your account uses Google, cannot change password',
      'info', 3000
    );
    return;
  }

  document.getElementById('chgCurrentPass').value = '';
  document.getElementById('chgNewPass').value = '';
  document.getElementById('chgNewPass2').value = '';
  applyActivitiesTranslations();

  const page = document.getElementById('changePasswordPage');
  page.classList.add('open');
  document.body.classList.add('stg-open', 'overlay-active');
  const nav = document.querySelector('.isto-nav-wrap');
  if (nav) nav.style.opacity = '0';
}

function closeChangePasswordPage() {
  const page = document.getElementById('changePasswordPage');
  if (!page) return;
  page.classList.remove('open');
  document.body.classList.remove('stg-open', 'overlay-active');
  const nav = document.querySelector('.isto-nav-wrap');
  if (nav) nav.style.opacity = '';
}

async function submitChangePassword() {
  if (!currentUser) return;
  const currentPass = document.getElementById('chgCurrentPass').value;
  const newPass = document.getElementById('chgNewPass').value;
  const newPass2 = document.getElementById('chgNewPass2').value;

  const isAr = currentLang === 'ar';

  if (!currentPass || !newPass || !newPass2) {
    showToast(isAr ? 'عمّر كل الحقول' : 'Fill all fields', 'warning', 2000);
    return;
  }
  if (newPass.length < 6) {
    showToast(isAr ? 'كلمة السر قصيرة (6 على الأقل)' : 'Password too short (min 6)', 'warning', 2500);
    return;
  }
  if (newPass !== newPass2) {
    showToast(isAr ? 'كلمتين السر ماشي كيفكيف' : 'Passwords do not match', 'warning', 2500);
    return;
  }
  if (newPass === currentPass) {
    showToast(isAr ? 'كلمة السر الجديدة كيف القديمة' : 'New password same as old', 'warning', 2500);
    return;
  }

  try {
    const cred = firebase.auth.EmailAuthProvider.credential(currentUser.email, currentPass);
    await currentUser.reauthenticateWithCredential(cred);
    await currentUser.updatePassword(newPass);

    showToast(isAr ? 'تم تحديث كلمة المرور بنجاح' : 'Password updated successfully', 'success', 3000);
    closeChangePasswordPage();

    try {
      await db.collection('users').doc(currentUser.uid).update({
        passwordChangedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    } catch(e) {}

  } catch (e) {
    console.warn('[Password] Change failed:', e);
    let msg = isAr ? 'تعذر تحديث كلمة المرور' : 'Failed to update password';
    if (e.code === 'auth/wrong-password') msg = isAr ? 'كلمة السر الحالية غلط' : 'Current password is wrong';
    else if (e.code === 'auth/too-many-requests') msg = isAr ? 'محاولات كثيرة، انتظر شوية' : 'Too many attempts, try later';
    else if (e.code === 'auth/requires-recent-login') msg = isAr ? 'خاصك تدخل من جديد' : 'Please sign in again';
    showToast(msg, 'error', 3500);
  }
}

if (typeof auth !== 'undefined' && auth.onAuthStateChanged) {
  auth.onAuthStateChanged(function(u) {
    if (u) setTimeout(saveDeviceSession, 1500);
  });
}
setTimeout(function() { if (currentUser) saveDeviceSession(); }, 3000);

const _oldApplyTrans = window.applyTranslations;
if (typeof _oldApplyTrans === 'function' && !_oldApplyTrans._actWrapped) {
  window.applyTranslations = function() {
    _oldApplyTrans.call(this);
    if (document.getElementById('activitiesPage') && document.getElementById('activitiesPage').classList.contains('open') ||
        document.getElementById('changePasswordPage') && document.getElementById('changePasswordPage').classList.contains('open')) {
      applyActivitiesTranslations();
      loadSessions();
    }
  };
  window.applyTranslations._actWrapped = true;
}
/* ============================================
   FORCE LOGOUT LISTENER
   كل جهاز كيسمع للإشعارات في الوقت الحقيقي
   ============================================ */
let _forceLogoutUnsub = null;

function listenForForceLogout() {
  if (_forceLogoutUnsub) _forceLogoutUnsub();
  if (!currentUser) return;
  
  const myDeviceId = getDeviceId();
  
  _forceLogoutUnsub = db.collection('users').doc(currentUser.uid)
    .collection('sessions').doc(myDeviceId)
    .onSnapshot((doc) => {
      if (!doc.exists) {
        // الجلسة انحذفت - نسجلو خروج
        console.log('[ForceLogout] Session deleted, signing out...');
        showToast(
          currentLang === 'ar' 
            ? 'تم تسجيل خروجك من هذا الجهاز' 
            : 'You have been signed out from this device',
          'warning', 5000
        );
        setTimeout(() => auth.signOut(), 800);
        return;
      }
      
      const data = doc.data();
      if (data && data.forceLogout === true) {
        // طلب خروج بالقوة
        console.log('[ForceLogout] Forced logout requested');
        showToast(
          currentLang === 'ar' 
            ? 'تم إنهاء جلستك من جهاز آخر' 
            : 'Your session was ended from another device',
          'warning', 5000
        );
        
        // نحذفو الجلسة تاعنا
        doc.ref.delete().catch(() => {});
        
        // نسجلو خروج
        setTimeout(() => auth.signOut(), 800);
      }
    }, (err) => {
      console.warn('[ForceLogout] Listener error:', err);
    });
}

// نبدأ الاستماع ملي يسجل المستخدم دخول
if (typeof auth !== 'undefined' && auth.onAuthStateChanged) {
  auth.onAuthStateChanged((u) => {
    if (u) {
      setTimeout(listenForForceLogout, 2000);
    } else {
      if (_forceLogoutUnsub) { _forceLogoutUnsub(); _forceLogoutUnsub = null; }
    }
  });
}
 /* ============================================
   AI WELCOME SCREEN ANIMATION
   ============================================ */
function playWelcomeAnimation() {
  const welcomeScreen = document.getElementById('aiWelcomeScreen');
  const welcomeAr = document.getElementById('aiWelcomeAr');
  const welcomeEn = document.getElementById('aiWelcomeEn');
  const quickActions = document.getElementById('aiQuickActions');
  const glow = document.getElementById('aiWelcomeGlow');
  const messages = document.getElementById('aiChatMessages');
  
  if (!welcomeScreen || !welcomeAr || !welcomeEn) return;
  
  // ✅ نخبيو الرسائل القديمة
  const oldMsgs = messages.querySelectorAll('.aiMsg');
  oldMsgs.forEach(el => el.style.display = 'none');
  
  // ✅ نبدلو النص التحتي حسب اللغة
  const subEl = document.getElementById('aiWelcomeSub');
  if (subEl && typeof currentLang !== 'undefined') {
    subEl.textContent = currentLang === 'ar' 
      ? 'كيفاش نقدر نعاونك اليوم؟' 
      : 'How can I help you today?';
  }
  
  // Reset الأنيميشن
  welcomeAr.classList.remove('wiping-in', 'wiping-out');
  welcomeEn.classList.remove('wiping-in', 'wiping-out');
  
  // 1. النص العربي يبان (fade + scale)
  setTimeout(() => {
    welcomeAr.classList.add('wiping-in');
  }, 300);
  
  // 2. الـ Glow يبان
  setTimeout(() => {
    if (glow) glow.classList.add('active');
  }, 800);
  
  // 3. النص العربي يختفي + الإنجليزي يبان
  setTimeout(() => {
    welcomeAr.classList.remove('wiping-in');
    welcomeAr.classList.add('wiping-out');
    
    setTimeout(() => {
      welcomeEn.classList.add('wiping-in');
      
      // ✅ نبدلو النص التحتي للإنجليزي
      if (subEl) {
        subEl.textContent = 'How can I help you today?';
      }
    }, 250);
  }, 2600);
  
  // 4. Quick Actions
  setTimeout(() => {
    if (quickActions) quickActions.classList.add('show');
  }, 3600);
}

function hideWelcomeScreen() {
  const welcomeScreen = document.getElementById('aiWelcomeScreen');
  const messages = document.getElementById('aiChatMessages');
  
  if (welcomeScreen) welcomeScreen.classList.add('hide');
  if (messages) messages.style.opacity = '1';
}

function sendQuickAction(type) {
  const input = document.getElementById('aiChatInput');
  if (!input) return;
  
  const messages = {
    app: currentLang === 'ar' ? 'ابحث عن تطبيق' : 'Find an app',
    help: currentLang === 'ar' ? 'كيفاش نحمل تطبيق؟' : 'How do I download an app?',
    publisher: currentLang === 'ar' ? 'كيفاش نصير ناشر؟' : 'How to become a publisher?'
  };
  
  input.value = messages[type] || '';
  sendAiMessage();
}

// ⚙️ ربط الأنيميشن ملي يفتح الشات
const _origOpenAiChat = window.openAiChat;
window.openAiChat = function() {
  _origOpenAiChat.call(this);
  
  const messages = document.getElementById('aiChatMessages');
  const hasHistory = messages && messages.querySelectorAll('.aiMsg').length > 1;
  
  if (!_welcomeAnimPlayed && !hasHistory) {
    setTimeout(() => {
      playWelcomeAnimation();
      _welcomeAnimPlayed = true;
    }, 400);
  }
};
console.log('Activities + Password loaded');


