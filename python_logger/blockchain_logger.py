from flask import Flask, request, jsonify
from flask_cors import CORS
import json, time, hashlib, os

app = Flask(__name__)
CORS(app)

# Blockchain functions
def load_chain(log_file='log.json'):
    if not os.path.exists(log_file):
        return []
    with open(log_file, 'r') as f:
        try:
            return json.load(f)
        except:
            return []

def save_chain(chain, log_file='log.json'):
    with open(log_file, 'w') as f:
        json.dump(chain, f, indent=2)

def hash_block(block):
    block_str = f"{block['index']}{block['timestamp']}{block['filename']}{block['cid']}{block['uploader']}{block['previous_hash']}"
    return hashlib.sha256(block_str.encode()).hexdigest()

def add_block(filename, cid, uploader, log_file='log.json'):
    chain = load_chain(log_file)
    previous_hash = chain[-1]['hash'] if chain else "0"
    block = {
        "index": len(chain),
        "timestamp": time.time(),
        "filename": filename,
        "cid": cid,
        "uploader": uploader,
        "previous_hash": previous_hash
    }
    block["hash"] = hash_block(block)
    chain.append(block)
    save_chain(chain, log_file)
    print("✅ Block added to log.json!")

# Flask route
@app.route('/log', methods=['POST'])
def log_data():
    data = request.json
    filename = data.get('filename')
    cid = data.get('cid')
    uploader = data.get('uploader')
    
    if not all([filename, cid, uploader]):
        return jsonify({"error": "Missing fields"}), 400
    
    add_block(filename, cid, uploader)
    return jsonify({"message": "Block added!"}), 200

def run_logger_server():
    print("🚀 Logger server running on http://localhost:5001")
    app.run(port=5001)

@app.route('/logs', methods=['GET'])
def get_logs():
    log_file = 'log.json'
    chain = load_chain(log_file)
    return jsonify(chain), 200

# Entry point
if __name__ == "__main__":
    run_logger_server()
