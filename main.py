from bs4 import BeautifulSoup
from google_play_scraper import app as gp_app, search as gp_search
import requests
import os
import json
from flask import Flask, jsonify, render_template, send_from_directory, request
from flask_cors import CORS

# ===== Firebase Admin =====
import firebase_admin
from firebase_admin import credentials, firestore

app = Flask(__name__, template_folder='templates', static_folder='static')
CORS(app)

# ============================================
# 🔥 تهيئة Firebase
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


# ============================================
# 🏠 الصفحة الرئيسية والملفات الثابتة
# ============================================
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/static/icon.png')
def serve_icon():
    return send_from_directory(os.path.join(app.root_path, 'static'), 'icon.png', mimetype='image/png')

@app.route('/test123')
def test123():
    return "OK - Server is alive! ✅"

@app.route('/debug/routes')
def debug_routes():
    routes = []
    for rule in app.url_map.iter_rules():
        routes.append({
            'path': str(rule),
            'methods': list(rule.methods - {'HEAD', 'OPTIONS'}),
            'endpoint': rule.endpoint
        })
    return jsonify({
        'total': len(routes),
        'firebase_connected': db is not None,
        'routes': routes
    })


# ============================================
# 🔥 جلب البيانات التلقائي (Auto-Fetch APIs)
# ============================================

# 1. جلب بيانات تطبيق iOS من iTunes Search API
@app.route('/api/fetch-ios', methods=['POST'])
def fetch_ios_data():
    data = request.json
    app_name = data.get('name')
    if not app_name:
        return jsonify({'error': 'App name is required'}), 400

    try:
        url = f"https://itunes.apple.com/search?term={requests.utils.quote(app_name)}&entity=software&limit=1"
        response = requests.get(url, timeout=10)
        results = response.json().get('results', [])
        
        if not results:
            return jsonify({'error': 'App not found'}), 404
        
        app_data = results[0]
        
        formatted_data = {
            'name': app_data.get('trackName'),
            'icon': app_data.get('artworkUrl512'),
            'size': f"{int(app_data.get('fileSizeBytes', 0)) / (1024*1024):.2f} MB",
            'info': app_data.get('description'),
            'publisher': app_data.get('artistName'),
            'url': app_data.get('trackViewUrl'),
            'platform': 'IPA',
            'category': 'apps',
            'screenshots': app_data.get('screenshotUrls', []),
            'appType': 'official',
            'likedBy': [],
            'downloadedBy': [],
            'downloads': 0,
            'commentsCount': 0,
            'ratingSum': 0,
            'ratingCount': 0,
            'ratingAvg': 0,
            'userRatings': {}
        }
        
        if db:
            save_data = dict(formatted_data)
            save_data['createdAt'] = firestore.SERVER_TIMESTAMP
            doc_ref = db.collection('apps').document()
            doc_ref.set(save_data)
            return jsonify({'success': True, 'id': doc_ref.id, 'data': formatted_data}), 200
        else:
            return jsonify({'success': True, 'data': formatted_data, 'warning': 'Firebase not connected'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


# 2. جلب بيانات تطبيق Android من Google Play
@app.route('/api/fetch-android', methods=['POST'])
def fetch_android_data():
    data = request.json
    package_name = data.get('package')
    if not package_name:
        return jsonify({'error': 'Package name is required'}), 400

    try:
        result = gp_app(
            package_name,
            lang='en', 
            country='us'
        )
        
        formatted_data = {
            'name': result.get('title'),
            'icon': result.get('icon'),
            'size': f"{(result.get('size') or 0) / (1024*1024):.2f} MB" if result.get('size') else 'N/A',
            'info': (result.get('description') or '')[:2000],
            'publisher': result.get('developer'),
            'url': f"https://play.google.com/store/apps/details?id={package_name}",
            'platform': 'APK',
            'category': 'apps',
            'screenshots': (result.get('screenshots') or [])[:5],
            'appType': 'official',
            'likedBy': [],
            'downloadedBy': [],
            'downloads': 0,
            'commentsCount': 0,
            'ratingSum': 0,
            'ratingCount': 0,
            'ratingAvg': 0,
            'userRatings': {}
        }
        
        if db:
            save_data = dict(formatted_data)
            save_data['createdAt'] = firestore.SERVER_TIMESTAMP
            doc_ref = db.collection('apps').document()
            doc_ref.set(save_data)
            return jsonify({'success': True, 'id': doc_ref.id, 'data': formatted_data}), 200
        else:
            return jsonify({'success': True, 'data': formatted_data, 'warning': 'Firebase not connected'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# 3. جلب بيانات تطبيق معدل (نموذج مبدئي باستخدام BeautifulSoup)
@app.route('/api/fetch-mod', methods=['POST'])
def fetch_mod_data():
    data = request.json
    url_to_scrape = data.get('url')
    if not url_to_scrape:
        return jsonify({'error': 'URL is required'}), 400

    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url_to_scrape, headers=headers, timeout=15)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        title = soup.find('h1').text.strip() if soup.find('h1') else 'Unknown App'
        
        formatted_data = {
            'name': title,
            'url': url_to_scrape,
            'platform': 'APK' if 'apk' in url_to_scrape.lower() else 'IPA',
            'appType': 'mod',
            'info': 'تم الجلب التلقائي من الموقع الخارجي.',
            'publisher': 'Unknown',
            'size': 'N/A'
        }
        
        return jsonify({'success': True, 'data': formatted_data}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


# 4. جلب Top التطبيقات (استعمال يدوي — bulk)
@app.route('/api/fetch-top', methods=['POST'])
def fetch_top_apps():
    """
    يجيب Top تطبيقات من Google Play و iTunes.
    الاستعمال اليدوي: 
      POST /api/fetch-top
      body: {"limit": 20}
    """
    data = request.json or {}
    limit = int(data.get('limit') or 15)
    limit = min(limit, 30)  # حد أقصى 30 لكل مصدر

    all_results = []

    # 1. Google Play Top (search "popular apps")
    try:
        gp_results = gp_search(
            "popular apps",
            lang='en',
            country='us',
            n_hits=limit
        )
        
        for app_info in gp_results[:limit]:
            try:
                package_name = app_info.get('appId')
                if not package_name:
                    continue
                result = gp_app(package_name, lang='en', country='us')
                if result and result.get('title') and result.get('icon'):
                    formatted = {
                        'name': result.get('title'),
                        'icon': result.get('icon'),
                        'size': f"{(result.get('size') or 0) / (1024*1024):.2f} MB" if result.get('size') else 'N/A',
                        'info': (result.get('description') or '')[:1000],
                        'publisher': result.get('developer'),
                        'url': f"https://play.google.com/store/apps/details?id={package_name}",
                        'platform': 'APK',
                        'category': 'apps',
                        'screenshots': (result.get('screenshots') or [])[:3],
                        'appType': 'official',
                        'likedBy': [],
                        'downloadedBy': [],
                        'downloads': 0,
                        'commentsCount': 0,
                        'ratingSum': 0,
                        'ratingCount': 0,
                        'ratingAvg': 0,
                        'userRatings': {}
                    }
                    all_results.append(formatted)
            except Exception as inner_e:
                print(f"GP detail error: {inner_e}")
                continue
        print(f"✅ Google Play: {len(all_results)} apps")
    except Exception as e:
        print(f"❌ Google Play top error: {e}")

    # 2. iTunes Top Free (RSS Feed)
    try:
        itunes_url = f"https://rss.applemarketingtools.com/api/v2/us/apps/top-free/{limit}/apps.json"
        r = requests.get(itunes_url, timeout=10)
        itunes_data = r.json()
        itunes_apps = itunes_data.get('feed', {}).get('results', [])

        for app in itunes_apps[:limit]:
            formatted = {
                'name': app.get('name'),
                'icon': (app.get('artworkUrl100') or '').replace('100x100', '512x512'),
                'size': 'N/A',
                'info': '',
                'publisher': app.get('artistName'),
                'url': app.get('url'),
                'platform': 'IPA',
                'category': 'apps',
                'screenshots': [],
                'appType': 'official',
                'likedBy': [],
                'downloadedBy': [],
                'downloads': 0,
                'commentsCount': 0,
                'ratingSum': 0,
                'ratingCount': 0,
                'ratingAvg': 0,
                'userRatings': {}
            }
            all_results.append(formatted)
        print(f"✅ iTunes: {len(itunes_apps)} apps")
    except Exception as e:
        print(f"❌ iTunes top error: {e}")

    if not all_results:
        return jsonify({'found': False, 'message': 'No apps found'}), 200

    # 3. سجّل الكل في Firebase
    saved_ids = []
    if db:
        for app_data in all_results:
            try:
                save_data = dict(app_data)
                save_data['createdAt'] = firestore.SERVER_TIMESTAMP
                doc_ref = db.collection('apps').document()
                doc_ref.set(save_data)
                saved_ids.append(doc_ref.id)
            except Exception as e:
                print(f"Save error: {e}")
                continue
        print(f"✅ Saved {len(saved_ids)} apps to Firebase")

    return jsonify({
        'found': True,
        'count': len(saved_ids),
        'total': len(all_results),
        'saved_ids': saved_ids
    }), 200


# ============================================
# 🔥 صفحة المشاركة الديناميكية
# ============================================
@app.route('/app/<app_id>')
def share_app(app_id):
    name = "iStore"
    desc = "حمّل التطبيقات والألعاب من iStore مجاناً"
    icon = "https://raw.githubusercontent.com/benssariyassine-tech/iPA-Store/main/static/icon.png"

    if db:
        try:
            doc = db.collection('apps').document(app_id).get()
            if doc.exists:
                d = doc.to_dict()
                name = d.get('name', name)
                info = d.get('info', '') or d.get('desc', '') or desc
                desc = info[:160]
                app_icon = d.get('icon', '')
                if app_icon and not app_icon.startswith('data:'):
                    icon = app_icon
        except Exception as e:
            print(f"⚠️ Error fetching app: {e}")

    html = f'''<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<title>{name} - iStore</title>
<meta property="og:type" content="website">
<meta property="og:title" content="{name} - iStore">
<meta property="og:description" content="{desc}">
<meta property="og:image" content="{icon}">
<meta property="og:image:width" content="512">
<meta property="og:image:height" content="512">
<meta property="og:site_name" content="iStore">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{name} - iStore">
<meta name="twitter:description" content="{desc}">
<meta name="twitter:image" content="{icon}">
<script>
window.location.replace('https://ipa-store.onrender.com/?app={app_id}');
</script>
<style>
  body {{ background:#0b0b0f;color:#fff;text-align:center;padding:60px 20px;font-family:-apple-system,sans-serif; }}
  img {{ width:120px;height:120px;border-radius:28px;margin-bottom:20px; }}
  h1 {{ font-size:20px;margin:10px 0; }}
  p {{ color:#8e8e93;font-size:14px; }}
  .loader {{ display:inline-block;width:24px;height:24px;border:3px solid rgba(255,255,255,0.2);border-top-color:#0a84ff;border-radius:50%;animation:spin 0.8s linear infinite;margin-top:20px; }}
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
# ✅ AI PROXY
# ============================================
@app.route('/api/ai', methods=['POST', 'OPTIONS'])
def ai_proxy():
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
            return jsonify({'error': {'message': 'GROQ_API_KEY not configured on server'}}), 500
        
        response = requests.post(
            'https://api.groq.com/openai/v1/chat/completions',
            headers={'Authorization': f'Bearer {groq_key}', 'Content-Type': 'application/json'},
            json=data,
            timeout=60
        )
        result = jsonify(response.json())
        result.headers['Access-Control-Allow-Origin'] = '*'
        return result, response.status_code
        
    except requests.exceptions.Timeout:
        return jsonify({'error': {'message': 'Request timeout. Try again.'}}), 504
    except Exception as e:
        return jsonify({'error': {'message': str(e)}}), 500


# ====== VirusTotal API ======
@app.route('/api/scan', methods=['POST'])
def scan_file():
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
            harmless = stats['harmless']
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


# ============================================
# 🤖 SMART FETCH — بحث ذكي وجلب أوتوماتيكي
# ============================================
@app.route('/api/smart-fetch', methods=['POST'])
def smart_fetch():
    data = request.json
    query = (data.get('query') or '').strip()
    
    if not query or len(query) < 2:
        return jsonify({'found': False, 'message': 'Query too short'}), 200

    results = []

    # 1️⃣ جرّب iTunes (لـ IPA)
    try:
        url = f"https://itunes.apple.com/search?term={requests.utils.quote(query)}&entity=software&limit=1"
        r = requests.get(url, timeout=8)
        ios_results = r.json().get('results', [])
        if ios_results:
            app_data = ios_results[0]
            formatted = {
                'name': app_data.get('trackName'),
                'icon': app_data.get('artworkUrl512'),
                'size': f"{int(app_data.get('fileSizeBytes', 0)) / (1024*1024):.2f} MB",
                'info': (app_data.get('description') or '')[:500],
                'publisher': app_data.get('artistName'),
                'url': app_data.get('trackViewUrl'),
                'platform': 'IPA',
                'category': 'apps',
                'screenshots': (app_data.get('screenshotUrls') or [])[:3],
                'appType': 'official',
                'likedBy': [],
                'downloadedBy': [],
                'downloads': 0,
                'commentsCount': 0,
                'ratingSum': 0,
                'ratingCount': 0,
                'ratingAvg': 0,
                'userRatings': {}
            }
            results.append(formatted)
            print(f"✅ Found on iTunes: {app_data.get('trackName')}")
    except Exception as e:
        print(f"iTunes search error: {e}")

    # 2️⃣ جرّب Google Play (لـ APK)
    try:
        gp_results = gp_search(query, lang='ar', country='dz', n_hits=1)
        if gp_results:
            package_name = gp_results[0].get('appId')
            if package_name:
                result = gp_app(package_name, lang='ar', country='dz')
                
                if result and result.get('title') and result.get('icon'):
                    formatted = {
                        'name': result.get('title'),
                        'icon': result.get('icon'),
                        'size': f"{(result.get('size') or 0) / (1024*1024):.2f} MB" if result.get('size') else 'N/A',
                        'info': (result.get('description') or '')[:500],
                        'publisher': result.get('developer'),
                        'url': f"https://play.google.com/store/apps/details?id={package_name}",
                        'platform': 'APK',
                        'category': 'apps',
                        'screenshots': (result.get('screenshots') or [])[:3],
                        'appType': 'official',
                        'likedBy': [],
                        'downloadedBy': [],
                        'downloads': 0,
                        'commentsCount': 0,
                        'ratingSum': 0,
                        'ratingCount': 0,
                        'ratingAvg': 0,
                        'userRatings': {}
                    }
                    results.append(formatted)
                    print(f"✅ Found on Google Play: {result.get('title')}")
    except Exception as e:
        print(f"Google Play search error: {e}")

    if not results:
        return jsonify({
            'found': False,
            'message': 'لم يتم العثور على التطبيق في المتاجر الرسمية.'
        }), 200

    # 3️⃣ سجّل التطبيقات في Firebase
    saved_ids = []
    if db:
        try:
            for app_data in results:
                save_data = dict(app_data)
                save_data['createdAt'] = firestore.SERVER_TIMESTAMP
                doc_ref = db.collection('apps').document()
                doc_ref.set(save_data)
                saved_ids.append(doc_ref.id)
            print(f"✅ Auto-saved {len(saved_ids)} apps to Firebase")
        except Exception as e:
            print(f"❌ Firebase save error: {e}")
            return jsonify({
                'found': False,
                'message': f'خطأ في الحفظ: {str(e)}'
            }), 500
    else:
        return jsonify({
            'found': False,
            'message': 'Firebase غير متصل'
        }), 500
    
    if len(saved_ids) == 0:
        return jsonify({
            'found': False,
            'message': 'لم يتم حفظ أي تطبيق'
        }), 200
    
    return jsonify({
        'found': True,
        'count': len(saved_ids),
        'saved_ids': saved_ids,
        'apps': results
    }), 200

# ============================================
# 📱 PWA Routes
# ============================================
@app.route('/static/manifest.json')
def serve_manifest():
    return send_from_directory(
        os.path.join(app.root_path, 'static'),
        'manifest.json',
        mimetype='application/manifest+json'
    )

@app.route('/static/service-worker.js')
def serve_service_worker():
    response = send_from_directory(
        os.path.join(app.root_path, 'static'),
        'service-worker.js',
        mimetype='application/javascript'
    )
    response.headers['Service-Worker-Allowed'] = '/'
    return response
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
