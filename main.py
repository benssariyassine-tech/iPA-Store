import os
import json
import requests
from flask import Flask, jsonify, render_template, send_from_directory, request
from flask_cors import CORS

# ===== Firebase Admin =====
import firebase_admin
from firebase_admin import credentials, firestore

app = Flask(__name__, template_folder='templates', static_folder='static')
CORS(app)

# ============================================
# 🔥 تهيئة Firebase (باش نجيبو معلومات التطبيقات)
# ============================================
db = None
try:
    firebase_cred_json = os.environ.get('FIREBASE_SERVICE_ACCOUNT', '')
    if firebase_cred_json and not firebase_admin._apps:
        cred_dict = json.loads(firebase_cred_json)
        cred = credentials.Certificate(cred_dict)
        firebase_admin.initialize_app(cred)
        db = firestore.client()
        print("✅ Firebase initialized successfully")
    else:
        print("⚠️ FIREBASE_SERVICE_ACCOUNT not set")
except Exception as e:
    print(f"⚠️ Firebase init error: {e}")
    db = None


# ===== قاعدة بيانات المتجر =====
APPS_DATABASE = [
    {
        "id": 1,
        "title": "Delta Emulator",
        "category": "games",
        "description": "محاكي ألعاب نينتندو الشهير للأيفون، يدعم ألعاب GBA و NDS بجودة عالية.",
        "size": "78 MB",
        "version": "v1.5.2",
        "icon": "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/3d/e8/30/3de8305c-4394-0d72-4d2d-222a27ffb3aa/AppIcon-0-0-1x_U007emarketing-0-7-0-sRGB-85-220.png/512x512bb.jpg",
        "download_url": "https://github.com/rileytestut/Delta/releases/download/v1.5.2/Delta.ipa"
    },
    {
        "id": 2,
        "title": "Minecraft PE",
        "category": "games",
        "description": "لعبة ماين كرافت الشهيرة النسخة الكاملة جاهزة للتثبيت المباشر.",
        "size": "450 MB",
        "version": "v1.20",
        "icon": "https://is1-ssl.mzstatic.com/image/thumb/Purple116/v4/3d/33/c7/3d33c7a1-2d7c-85a2-3f85-1d4e0e5e0321/AppIcon-0-1x_U007emarketing-0-5-0-0-85-220.png/512x512bb.jpg",
        "download_url": "https://t.me/IPA1_KP"
    },
    {
        "id": 3,
        "title": "E-Sign",
        "category": "tools",
        "description": "أداة التوقيع الأقوى على أجهزة iOS لتثبيت الشهواد والتطبيقات الخارجية.",
        "size": "45 MB",
        "version": "v5.0.2",
        "icon": "https://is5-ssl.mzstatic.com/image/thumb/Purple126/v4/09/b6/42/09b642a8-124e-3759-b146-24003d1681a5/AppIcon-0-1x_U007emarketing-0-0-G4-85-220.png/512x512bb.jpg",
        "download_url": "https://esign.yyyp.vip/esign.ipa"
    },
    {
        "id": 4,
        "title": "Scarlet",
        "category": "tools",
        "description": "متجر بديل لتثبيت ملفات الـ IPA بدون كمبيوتر وبكل سهولة.",
        "size": "15 MB",
        "version": "v1.0.2",
        "icon": "https://usescarlet.com/assets/img/scarlet.png",
        "download_url": "https://usescarlet.com/download/Scarlet.ipa"
    },
    {
        "id": 5,
        "title": "YouTube Plus",
        "category": "apps",
        "description": "يوتيوب بلس مع ميزة منع الإعلانات وتشغيل الفيديوهات في الخلفية.",
        "size": "95 MB",
        "version": "v18.4",
        "icon": "https://is2-ssl.mzstatic.com/image/thumb/Purple211/v4/03/5b/c2/035bc297-3f36-3b5a-ef8b-e8537b029272/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-85-220.png/512x512bb.jpg",
        "download_url": "https://t.me/IPA1_KP"
    },
    {
        "id": 6,
        "title": "Spotify Deluxe",
        "category": "music",
        "description": "تطبيق سبوتيفاي للاستماع للغناء والموسيقى بدون إعلانات وبمزايا مدفوعة.",
        "size": "85 MB",
        "version": "v8.8",
        "icon": "https://is3-ssl.mzstatic.com/image/thumb/Purple211/v4/66/1b/38/661b382d-114d-6bc1-ef28-d7f6b986e42b/AppIcon-0-0-1x_U007emarketing-0-0-0-85-220.png/512x512bb.jpg",
        "download_url": "https://t.me/IPA1_KP"
    }
]


# ============================================
# 🏠 الصفحة الرئيسية
# ============================================
@app.route('/')
def home():
    return render_template('index.html')


@app.route('/static/icon.png')
def serve_icon():
    return send_from_directory(os.path.join(app.root_path, 'static'), 'icon.png', mimetype='image/png')


@app.route('/api/apps', methods=['GET'])
def get_apps():
    return jsonify(APPS_DATABASE)


# ============================================
# 🔥 صفحة المشاركة الديناميكية (جديد!)
# ============================================
@app.route('/app/<app_id>')
def share_app(app_id):
    """
    صفحة خاصة بكل تطبيق — كتوري صورة التطبيق 
    ملي تصيفط الرابط فواتساب/إنستغرام
    """
    # القيم الافتراضية
    name = "iStore"
    desc = "حمّل التطبيقات والألعاب من iStore مجاناً"
    icon = "https://raw.githubusercontent.com/benssariyassine-tech/iPA-Store/main/static/icon.png"

    # إلا كان Firebase شغال، جيبو معلومات التطبيق
    if db:
        try:
            doc = db.collection('apps').document(app_id).get()
            if doc.exists:
                d = doc.to_dict()
                name = d.get('name', name)
                info = d.get('info', '') or d.get('desc', '') or desc
                desc = info[:160]
                app_icon = d.get('icon', '')
                # نتأكدو بلي الصورة رابط حقيقي ماشي data URL
                if app_icon and not app_icon.startswith('data:'):
                    icon = app_icon
                print(f"✅ App found: {name}")
            else:
                print(f"⚠️ App {app_id} not found")
        except Exception as e:
            print(f"⚠️ Error fetching app: {e}")

    # صفحة HTML فيها meta tags للصورة
    html = f'''<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<title>{name} - iStore</title>

<!-- 🔥 Open Graph (Instagram / WhatsApp / Facebook / Telegram) -->
<meta property="og:type" content="website">
<meta property="og:title" content="{name} - iStore">
<meta property="og:description" content="{desc}">
<meta property="og:image" content="{icon}">
<meta property="og:image:width" content="512">
<meta property="og:image:height" content="512">
<meta property="og:site_name" content="iStore">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{name} - iStore">
<meta name="twitter:description" content="{desc}">
<meta name="twitter:image" content="{icon}">

<!-- ✅ التحويل التلقائي للمستخدم للموقع -->
<meta http-equiv="refresh" content="0; url=https://ipa-store.onrender.com/?app={app_id}">
<script>window.location.replace('https://ipa-store.onrender.com/?app={app_id}');</script>

<style>
  body {{
    background:#0b0b0f;color:#fff;text-align:center;
    padding:60px 20px;font-family:-apple-system,sans-serif;
  }}
  img {{ width:120px;height:120px;border-radius:28px;margin-bottom:20px; }}
  h1 {{ font-size:20px;margin:10px 0; }}
  p {{ color:#8e8e93;font-size:14px; }}
  .loader {{
    display:inline-block;width:24px;height:24px;
    border:3px solid rgba(255,255,255,0.2);
    border-top-color:#0a84ff;border-radius:50%;
    animation:spin 0.8s linear infinite;margin-top:20px;
  }}
  @keyframes spin {{ to {{ transform:rotate(360deg); }} }}
</style>
</head>
<body>
  <img src="{icon}" alt="{name}">
  <h1>{name}</h1>
  <p>جاري تحويلك إلى iStore...</p>
  <div class="loader"></div>
</body>
</html>'''

    return html
# ============================================


# ============================================
# ✅ AI PROXY — يحمي مفتاح Groq
# ============================================
@app.route('/api/ai', methods=['POST', 'OPTIONS'])
def ai_proxy():
    """🛡️ وسيط للذكاء الاصطناعي — المفتاح مخبّى هنا فقط"""
    
    if request.method == 'OPTIONS':
        response = jsonify({})
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        return response, 204
    
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': {'message': 'No data provided'}}), 400
        
        groq_key = os.environ.get('GROQ_API_KEY', '')
        
        if not groq_key:
            return jsonify({
                'error': {'message': 'GROQ_API_KEY not configured on server'}
            }), 500
        
        response = requests.post(
            'https://api.groq.com/openai/v1/chat/completions',
            headers={
                'Authorization': f'Bearer {groq_key}',
                'Content-Type': 'application/json'
            },
            json=data,
            timeout=60
        )
        
        result = jsonify(response.json())
        result.headers['Access-Control-Allow-Origin'] = '*'
        return result, response.status_code
        
    except requests.exceptions.Timeout:
        return jsonify({
            'error': {'message': 'Request timeout. Try again.'}
        }), 504
    except Exception as e:
        return jsonify({
            'error': {'message': str(e)}
        }), 500


# ====== stats VirusTotal API ======
@app.route('/api/scan', methods=['POST'])
def scan_file():
    """يفحص ملف بالـ SHA256 hash عبر VirusTotal"""
    data = request.get_json()
    file_hash = data.get('hash') if data else None
    
    if not file_hash:
        return jsonify({"error": "Hash required"}), 400
    
    api_key = os.environ.get("VIRUSTOTAL_API_KEY")
    if not api_key:
        return jsonify({"error": "API key not configured"}), 500
    
    headers = {"x-apikey": api_key}
    url = f"https://www.virustotal.com/api/v3/files/{file_hash}"
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            stats = data['data']['attributes']['last_analysis_stats']
            malicious = stats['malicious']
            suspicious = stats['suspicious']
            harmless =['harmless']
            undetected = stats['undetected']
            total = malicious + suspicious + harmless + undetected
            
            return jsonify({
                "safe": malicious == 0,
                "malicious": malicious,
                "suspicious": suspicious,
                "harmless": harmless,
                "undetected": undetected,
                "total": total,
                "result": f"{malicious}/{total}",
                "hash": file_hash
            })
        elif response.status_code == 404:
            return jsonify({"error": "File not found in VirusTotal"}), 404
        elif response.status_code == 429:
            return jsonify({"error": "Too many requests. Wait a minute."}), 429
        elif response.status_code == 401:
            return jsonify({"error": "Invalid API key"}), 401
        else:
            return jsonify({"error": f"API error: {response.status_code}"}), response.status_code
            
    except requests.exceptions.Timeout:
        return jsonify({"error": "Timeout. Try again."}), 504
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/sitemap.xml')
def sitemap():
    return send_from_directory('templates', 'sitemap.xml', mimetype='application/xml')


@app.route('/robots.txt')
def robots():
    return send_from_directory('templates', 'robots.txt', mimetype='text/plain')


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
