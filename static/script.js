// 1. تهيئة خدمات Firebase
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
const auth = firebase.auth();
const db = firebase.firestore();

// 2. القائمة الجانبية للنظام
function toggleSideMenu() {
    const sideMenu = document.getElementById('sideMenu');
    const overlay = document.getElementById('sideMenuOverlay');
    if (sideMenu) {
        sideMenu.classList.toggle('active');
    }
    if (overlay) {
        overlay.classList.toggle('active');
    }
}

// 3. النوافذ المنبثقة للـ Auth
let isSignUpMode = false;

function openAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function toggleAuthMode(e) {
    if (e) e.preventDefault();
    isSignUpMode = !isSignUpMode;
    
    const title = document.getElementById('authTitle');
    const submitBtn = document.getElementById('authSubmitBtn');
    const toggleText = document.getElementById('authToggleText');
    const toggleBtn = document.getElementById('authToggleBtn');

    if (title && submitBtn) {
        if (isSignUpMode) {
            title.innerText = "إنشاء حساب جديد";
            submitBtn.innerText = "إنشاء الحساب";
            toggleText.innerText = "لديك حساب بالفعل؟";
            toggleBtn.innerText = "تسجيل الدخول";
        } else {
            title.innerText = "تسجيل الدخول";
            submitBtn.innerText = "تسجيل الدخول";
            toggleText.innerText = "ليس لديك حساب؟";
            toggleBtn.innerText = "إنشاء حساب جديد";
        }
    }
}

function handleAuthSubmit(e) {
    e.preventDefault();
    const email = document.getElementById('authEmail').value;
    const password = document.getElementById('authPassword').value;

    if (isSignUpMode) {
        auth.createUserWithEmailAndPassword(email, password)
            .then(() => {
                alert("تم إنشاء الحساب بنجاح.");
                closeAuthModal();
                location.reload();
            })
            .catch((error) => {
                alert("تعذر إنشاء الحساب: " + error.message);
            });
    } else {
        auth.signInWithEmailAndPassword(email, password)
            .then(() => {
                alert("تم تسجيل الدخول بنجاح.");
                closeAuthModal();
                location.reload();
            })
            .catch((error) => {
                alert("فشل تسجيل الدخول: " + error.message);
            });
    }
}

// 4. جلب وعرض التطبيقات الحقيقية من Firestore
function loadApps() {
    db.collection("apps").get().then((snapshot) => {
        const appsContainer = document.getElementById('appsContainer');
        if (!appsContainer) return;

        if (snapshot.empty) {
            appsContainer.innerHTML = '<p style="text-align:center; color:#8e8e93; padding: 20px;">لا توجد تطبيقات متاحة حالياً.</p>';
            return;
        }

        let html = '';
        snapshot.forEach((doc) => {
            const app = doc.data();
            html += `
                <div class="app-card">
                    <img src="${app.icon || '/static/default-icon.png'}" alt="${app.title}" class="app-icon">
                    <div class="app-info">
                        <h3>${app.title}</h3>
                        <p>${app.category || 'تطبيق IPA'}</p>
                    </div>
                    <a href="${app.download_url || '#'}" class="btn-download">تثبيت</a>
                </div>
            `;
        });
        appsContainer.innerHTML = html;
    }).catch((error) => {
        console.error("خطأ في تحميل التطبيقات: ", error);
    });
}

// تشغيل جلب التطبيقات عند فتح الصفحة
document.addEventListener('DOMContentLoaded', () => {
    loadApps();
});
