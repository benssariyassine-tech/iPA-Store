import os
import asyncio
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from telethon import TelegramClient

API_ID = 36586724
API_HASH = 'bf8867bfab75aa5533dd036687e287ca'

DOWNLOAD_DIR = 'downloads'
os.makedirs(DOWNLOAD_DIR, exist_ok=True)

app = Flask(__name__)
CORS(app)

client = TelegramClient('user_session', API_ID, API_HASH)

@app.route('/')
def home():
    return "iPA Store Backend Active"

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
    with client:
        app.run(host='0.0.0.0', port=port)
