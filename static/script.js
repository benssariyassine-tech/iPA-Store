// تهيئة خدمات Firebase
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

let isSignUpMode = false;

// التبديل بين نماذج الدخول وإنشاء الحساب
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

// إدارة طلبات المصادقة
function handleAuthSubmit(e) {
    e.preventDefault();
    const email = document.getElementById('authEmail').value;
    const password = document.getElementById('authPassword').value;

    if (isSignUpMode) {
        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                alert("تم إنشاء الحساب بنجاح.");
                location.reload();
            })
            .catch((error) => {
                alert("تعذر إنشاء الحساب: " + error.message);
            });
    } else {
        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                alert("تم تسجيل الدخول بنجاح.");
                location.reload();
            })
            .catch((error) => {
                alert("فشل تسجيل الدخول: " + error.message);
            });
    }
}

// حفظ بيانات التطبيقات في قاعدة البيانات
function addNewApp(appData) {
    db.collection("apps").add({
        title: appData.title,
        category: appData.category,
        description: appData.description,
        size: appData.size,
        version: appData.version,
        download_url: appData.download_url,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
        alert("تمت إضافة التطبيق بنجاح.");
        location.reload();
    })
    .catch((error) => {
        alert("حدث خطأ أثناء حفظ البيانات: " + error.message);
    });
}
