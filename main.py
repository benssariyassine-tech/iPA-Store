import os
import asyncio
from flask import Flask, jsonify, render_template, send_from_directory
from flask_cors import CORS
from telethon import TelegramClient

API_ID = 36586724
API_HASH = 'bf8867bfab75aa5533dd036687e287ca'

DOWNLOAD_DIR = 'downloads'
os.makedirs(DOWNLOAD_DIR, exist_ok=True)

# تحديد مسار مجلد templates بشكل صحيح ليعمل على Render
app = Flask(__name__, template_folder='templates')
CORS(app)

client = TelegramClient('user_session', API_ID, API_HASH)

@app.route('/')
def home():
    # هنا يتم عرض واجهة الموقع الكاملة التي في مجلد templates
    return render_template('index.html')

@app.route('/api/apps', methods=['GET'])
def get_all_apps():
    # قائمة مبدئية أو يمكنك جلبها من قناة تيليجرام مباشرة
    # هذه التطبيقات ستظهر تلقائياً في واجهة الموقع
    sample_apps = [
        {
            "title": "E-Sign Signer",
            "category": "tools",
            "description": "أداة قوية لتوقيع وتثبيت ملفات الـ IPA مباشرة.",
            "size": "45 MB",
            "version": "v5.0.2",
            "icon": "https://picsum.photos/100/100?random=1",
            "download_url": "#"
        },
        {
            "title": "Delta Emulator",
            "category": "games",
            "description": "محاكي الألعاب الكلاسيكية الشهير للأيفون.",
            "size": "78 MB",
            "version": "v1.5.2",
            "icon": "https://picsum.photos/100/100?random=2",
            "download_url": "#"
        }
    ]
    return jsonify(sample_apps)

@app.route('/api/app/<channel>/<int:msg_id>', methods=['GET'])
def get_app_details(channel, msg_id):
    async def fetch():
        await client.connect()
        message = await client.get_messages(channel, ids=msg_id)
        if not message:
            return None
        
        folder_path = os.path.join(DOWNLOAD_DIR, str(msg_id))
        os.makedirs(folder_path, exist_ok=True)
        
        photo_name = None
        file_name = None
        
        if message.photo:
            photo_path = await message.download_media(file=folder_path)
            photo_name = os.path.basename(photo_path)
            
        if message.file:
            file_path = await message.download_media(file=folder_path)
            file_name = os.path.basename(file_path)
            
        return {
            "text": message.text or "",
            "photo": photo_name,
            "file": file_name,
            "size": round(message.file.size / (1024 * 1024), 2) if message.file else 0
        }

    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    data = loop.run_until_complete(fetch())

    if not data:
        return jsonify({"status": "error"}), 404

    return jsonify({
        "status": "success",
        "description": data["text"],
        "size_mb": data["size"],
        "file_name": data["file"]
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
