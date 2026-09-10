import os
import asyncio
from flask import Flask, jsonify, render_template
from flask_cors import CORS
from telethon import TelegramClient

API_ID = 36586724
API_HASH = 'bf8867bfab75aa5533dd036687e287ca'

DOWNLOAD_DIR = 'downloads'
os.makedirs(DOWNLOAD_DIR, exist_ok=True)

app = Flask(__name__, template_folder='templates')
CORS(app)

client = TelegramClient('user_session', API_ID, API_HASH)

# معرف القناة المباشر بناءً على الرابط الذي أرسلته
TARGET_CHANNEL = 'IPA1_KP'

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/apps', methods=['GET'])
def get_channel_apps():
    async def fetch_from_channel():
        apps_list = []
        try:
            await client.connect()
            # جلب آخر الرسائل من القناة المحددة
            async for message in client.iter_messages(TARGET_CHANNEL, limit=30):
                if message.file and message.file.name and message.file.name.endswith('.ipa'):
                    file_size_mb = round(message.file.size / (1024 * 1024), 2) if message.file.size else 0
                    
                    description = message.text if message.text else "تطبيق IPA من قناة دعم المتاجر"
                    
                    apps_list.append({
                        "id": message.id,
                        "title": message.file.name.replace('.ipa', ''),
                        "category": "apps",
                        "description": description,
                        "size": f"{file_size_mb} MB",
                        "version": "Latest",
                        "icon": "https://is5-ssl.mzstatic.com/image/thumb/Purple126/v4/09/b6/42/09b642a8-124e-3759-b146-24003d1681a5/AppIcon-0-1x_U007emarketing-0-0-G4-85-220.png/512x512bb.jpg",
                        "download_url": f"https://t.me/{TARGET_CHANNEL}/{message.id}"
                    })
        except Exception as e:
            print(f"Error reading channel: {e}")
            
        return apps_list

    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    apps = loop.run_until_complete(fetch_from_channel())

    return jsonify(apps)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)

