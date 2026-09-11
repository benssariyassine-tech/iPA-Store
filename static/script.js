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

// 2. القائمة الجانبية
function toggleSideMenu() {
    const sideMenu = document.getElementById('sideMenu');
    const overlay = document.getElementById('sideMenuOverlay');
    if (sideMenu) sideMenu.classList.toggle('active');
    if (overlay) overlay.classList.toggle('active');
}

// 3. النوافذ المنبثقة للـ Auth
let isSignUpMode = false;

function openAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) modal.style.display = 'flex';
}

function closeAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) modal.style.display = 'none';
}

window.onclick = function(event) {
    const modal = document.getElementById('authModal');
    if (event.target === modal) closeAuthModal();
};

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

// 4. جلب التطبيقات من Firestore
function loadApps() {
    const appsContainer = document.getElementById('appsContainer');
    if (!appsContainer) return;

    db.collection("apps").get().then((snapshot) => {
        if (snapshot.empty) {
            appsContainer.innerHTML = '<p style="text-align:center; color:#8e8e93; padding: 20px;">لا توجد تطبيقات متاحة حالياً.</p>';
            return;
        }

        let html = '';
        snapshot.forEach((doc) => {
            const app = doc.data();
            html += `
                <div class="app-card" style="background:#1c1c1e; padding:15px; border-radius:12px; margin-bottom:10px; display:flex; align-items:center; justify-content:space-between;">
                    <div style="color:#fff;">
                        <h3 style="margin:0; font-size:16px;">${app.title || 'تطبيق IPA'}</h3>
                        <p style="margin:4px 0 0; color:#8e8e93; font-size:12px;">${app.category || 'عام'}</p>
                    </div>
                    <a href="${app.download_url || '#'}" style="background:#0a84ff; color:#fff; padding:6px 16px; border-radius:20px; text-decoration:none; font-size:13px; font-weight:bold;">تثبيت</a>
                </div>
            `;
        });
        appsContainer.innerHTML = html;
    }).catch((error) => {
        appsContainer.innerHTML = '<p style="text-align:center; color:#ff453a; padding: 20px;">حدث خطأ أثناء تحميل البيانات.</p>';
        console.error("خطأ في التحميل:", error);
    });
}

document.addEventListener('DOMContentLoaded', loadApps);
