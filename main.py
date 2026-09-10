import os
from flask import Flask, jsonify, render_template
from flask_cors import CORS

app = Flask(__name__, template_folder='templates')
CORS(app)

# قاعدة بيانات المتجر المنظمة بدقة حسب الأقسام (يمكنك تحديثها أو إضافة تطبيقات قناتك هنا بكل سهولة)
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

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/apps', methods=['GET'])
def get_apps():
    return jsonify(APPS_DATABASE)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
