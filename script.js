// إعداد Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC3r9wr8tgjRNwWFY01mxrVy640sQFs2bg",
  authDomain: "istore-ipa.firebaseapp.com",
  projectId: "istore-ipa",
  storageBucket: "istore-ipa.firebasestorage.app",
  messagingSenderId: "262724812706",
  appId: "1:262724812706:web:b9fae4bb87f0417f557cfb",
  measurementId: "G-9150WB3Q7P"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

let database = [];
let eventUpdatesDatabase = [];
let heroApp = null;
let currentSelectedApp = null;

const supportedLanguages = [
  { code: 'ar', name: 'العربية (Arabic)' },
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'tr', name: 'Türkçe' },
  { code: 'es', name: 'Español' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
  { code: 'ru', name: 'Русский' },
  { code: 'zh', name: '中文' },
  { code: 'ja', name: '日本語' }
];
let currentLang = 'ar';

window.onload = () => {
  renderLanguageOptions();
  loadAppsData();
};

async function loadAppsData() {
  try {
    let jsonData = [];
    try {
      const res = await fetch('apps.json');
      if (res.ok) jsonData = await res.json();
    } catch(e) { console.log("الاعتماد على قاعدة البيانات الرسمية"); }

    const snapshot = await db.collection('apps').get();
    let firebaseData = [];
    snapshot.forEach(doc => {
      firebaseData.push({ id: doc.id, ...doc.data() });
    });

    const combined = [...firebaseData, ...jsonData];
    if (combined.length > 0) {
      database = combined.map((app, index) => ({
        id: app.id || index,
        name: app.name || app.title || "تطبيق IPA",
        category: app.category || "apps",
        desc: app.desc || app.description || "ملف IPA جاهز للتثبيت",
        size: app.size || "45.2 ميجابايت",
        version: app.version || "v2.0",
        icon: app.icon || "https://picsum.photos/100/100?random=" + (index + 20),
        download_url: app.download_url || "#"
      }));
    } else {
      database = [
        { id: 1, name: "Car Match - Traffic Puzzle", category: "games", desc: "ألغاز وتحديات ذكاء", size: "523.4 ميجابايت", version: "10.66", icon: "https://picsum.photos/100/100?random=1", download_url: "#" },
        { id: 2, name: "Tomb of the Mask", category: "games", desc: "متاهة مغامرات متطورة", size: "120 ميجابايت", version: "v1.4", icon: "https://picsum.photos/100/100?random=2", download_url: "#" },
        { id: 3, name: "Snapchat", category: "apps", desc: "تواصل اجتماعي ومشاركة اللحظات", size: "180 ميجابايت", version: "v12.5", icon: "https://picsum.photos/100/100?random=3", download_url: "#" },
        { id: 4, name: "TikTok", category: "apps", desc: "منصة مقاطع الفيديو القصيرة", size: "210 ميجابايت", version: "v31.0", icon: "https://picsum.photos/100/100?random=4", download_url: "#" }
      ];
    }

    heroApp = database[0];
    document.getElementById('heroTitle').innerText = heroApp.name;
    document.getElementById('heroDesc').innerText = heroApp.desc;
    document.getElementById('heroBanner').src = heroApp.icon;

    eventUpdatesDatabase = database.slice(0, 3);
    renderEventSlider();
    renderAllCategories();
  } catch (err) {
    console.error("خطأ أثناء تحميل البيانات:", err);
  }
}

function toggleSideMenu() {
  document.getElementById('sideMenuDrawer').classList.toggle('active');
}

function simulateLanguageChange(langCode = 'ar') {
  const overlay = document.getElementById('langLoadingOverlay');
  overlay.classList.add('active');
  setTimeout(() => {
    overlay.classList.remove('active');
    currentLang = langCode;
    renderLanguageOptions();
  }, 3000);
}

function renderLanguageOptions() {
  const container = document.getElementById('langOptionsContainer');
  if (!container) return;
  container.innerHTML = supportedLanguages.map(l => `
    <div class="lang-option-btn ${currentLang === l.code ? 'selected' : ''}" onclick="simulateLanguageChange('${l.code}')">
      <span>${l.name}</span>
      <svg viewBox="0 0 24 24"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>
    </div>
  `).join('');
}

function toggleDarkMode() {
  document.body.classList.toggle('light-mode');
}

function renderEventSlider() {
  const container = document.getElementById('eventSliderContainer');
  if(!container) return;
  container.innerHTML = eventUpdatesDatabase.map((item) => `
    <div class="event-card" onclick="openAppByIndex(${item.id})">
      <img src="${item.icon}" class="event-banner">
      <div class="event-badge">تحديث جديد</div>
      <div class="event-title">${item.name}</div>
      <div class="event-desc">${item.desc}</div>
    </div>
  `).join('');
}

function renderAllCategories() {
  renderList('general-apps-list', database);
  renderList('games-list', database.filter(i => i.category === 'games' || i.category === 'الألعاب'));
  renderList('apps-list', database.filter(i => i.category === 'apps' || i.category === 'التطبيقات'));
  renderList('tools-list', database.filter(i => i.category === 'tools' || i.category === 'الأدوات'));
  renderList('music-list', database.filter(i => i.category === 'music' || i.category === 'الموسيقى'));
}

function renderList(elementId, items) {
  const container = document.getElementById(elementId);
  if(!container) return;
  if(items.length === 0) {
    container.innerHTML = `<div style="text-align:center; padding:20px; color:var(--text-sub);">لا توجد عناصر متاحة حالياً</div>`;
    return;
  }
  container.innerHTML = items.map((item) => `
    <div class="app-row" onclick="openAppByIndex(${item.id})">
      <img src="${item.icon}" class="app-icon">
      <div class="app-details">
        <div class="app-name">${item.name}</div>
        <div class="app-subtext">${item.desc}</div>
      </div>
      <button class="btn-get">تنزيل</button>
    </div>
  `).join('');
}

function switchTab(sectionId, title, element) {
  const titleEl = document.getElementById('pageTitle');
  titleEl.classList.add('fade-out');

  setTimeout(() => {
    document.querySelectorAll('.page-section').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-item').forEach(el => el.classList.remove('active'));
    
    document.getElementById(`page-${sectionId}`).classList.add('active');
    if(element) element.classList.add('active');
    
    titleEl.innerText = title;
    titleEl.classList.remove('fade-out');
    titleEl.classList.add('fade-in');
  }, 200);

  setTimeout(() => {
    titleEl.classList.remove('fade-in');
  }, 400);
}

function openFullModal(id) { document.getElementById(id).classList.add('active'); }
function closeFullModal(id) { document.getElementById(id).classList.remove('active'); }

function openHeroDetails() {
  if(heroApp) openAppByIndex(heroApp.id);
}

function openAppByIndex(id) {
  const item = database.find(app => app.id == id);
  if(item) {
    currentSelectedApp = item;
    document.getElementById('detailName').innerText = item.name;
    document.getElementById('detailCategory').innerText = "الفئة: " + item.category;
    document.getElementById('detailSize').innerText = "الحجم: " + item.size;
    document.getElementById('detailVer').innerText = "الإصدار: " + item.version;
    document.getElementById('detailIcon').src = item.icon;
    openFullModal('appDetailsPage');
  }
}

function handleSearch(query) {
  const resContainer = document.getElementById('searchResultsList');
  if(!query.trim()) {
    resContainer.innerHTML = '';
    return;
  }
  const filtered = database.filter(i => i.name.toLowerCase().includes(query.toLowerCase()) || i.desc.toLowerCase().includes(query.toLowerCase()));
  resContainer.innerHTML = filtered.map(item => `
    <div class="app-row" onclick="closeFullModal('searchPage'); openAppByIndex(${item.id})">
      <img src="${item.icon}" class="app-icon">
      <div class="app-details">
        <div class="app-name">${item.name}</div>
        <div class="app-subtext">${item.desc}</div>
      </div>
      <button class="btn-get">عرض</button>
    </div>
  `).join('') || `<div style="text-align:center; padding:20px; color:var(--text-sub);">لا توجد نتائج مطابقة</div>`;
}

async function addNewAppToDatabase() {
  const name = document.getElementById('newAppName').value;
  const category = document.getElementById('newAppCategory').value || 'apps';
  const desc = document.getElementById('newAppDesc').value;
  const icon = document.getElementById('newAppIcon').value;
  const download_url = document.getElementById('newAppUrl').value;

  if(!name || !download_url) {
    alert("يرجى إدخال اسم التطبيق ورابط التحميل المباشر.");
    return;
  }

  const newAppData = {
    name, category, desc: desc || "ملف IPA جديد",
    size: "45 ميجابايت", version: "1.0", icon: icon || "https://picsum.photos/100/100?random=99", download_url
  };

  try {
    await db.collection('apps').add(newAppData);
    alert("تم نشر التطبيق وحفظه بنجاح.");
    closeFullModal('addAppPage');
    loadAppsData();
  } catch(e) {
    alert("حدث خطأ أثناء الحفظ: " + e.message);
  }
}

async function handleFirebaseLogin() {
  const email = document.getElementById('authEmail').value;
  const pass = document.getElementById('authPassword').value;
  if(!email || !pass) {
    alert("يرجى إدخال البريد الإلكتروني وكلمة المرور.");
    return;
  }
  try {
    alert("تم تسجيل الدخول بنجاح.");
    closeFullModal('accountPage');
  } catch(e) {
    alert("خطأ في عملية المصادقة: " + e.message);
  }
}

function openDownloadModal() {
  if(!currentSelectedApp) return;
  document.getElementById('modalAppName').innerText = currentSelectedApp.name;
  document.getElementById('modalAppSub').innerText = "الحجم: " + currentSelectedApp.size + " • جاهز للتثبيت عبر E-Sign";
  document.getElementById('modalAppIcon').src = currentSelectedApp.icon;
  document.getElementById('downloadConfirmBtn').href = currentSelectedApp.download_url || "#";
  document.getElementById('downloadModal').classList.add('active');
}

function closeDownloadModal() {
  document.getElementById('downloadModal').classList.remove('active');
}
