import os, requests

from flask import Flask, render_template, jsonify, request, session
from dotenv import load_dotenv
from flask_cors import CORS
from notes import send_transcription_to_prompty, send_note_to_prompty
from functools import wraps

# Load environment variables from .env file
load_dotenv(override=True)

app= Flask(__name__)

# Set CORS environment variable
CORS_VAR = os.getenv('CORS','*')
CORS(app, resources={r"/*": {"origins": CORS_VAR}})  # Enable CORS for localhost:5773

###
## Healthcheck endpoint
###
@app.route('/')
@app.route('/api/healthcheck', methods=['GET'])
def status():
    status = [ { 'status': 'healthy' } ]
    return jsonify(status)

@app.route('/api/user-data', methods=['POST'])
def receive_user_data():
    try:
        data = request.json
        email= data.get('email')
        email_verified = data.get('email_verified')

        print(F"Received user data - Email: {email}, Verified: {email_verified}")
        # Store user data in session
        session['user_email'] = email
        session['email_verified'] = email_verified

        return jsonify({"message":"User data received successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if 'user_email' not in session or 'email_verified' not in session:
            return jsonify({"error": "Authentication required"}), 401
        if not session['email_verified']:
            return jsonify({"error": "Email not verified"}), 403
        return f(*args, **kwargs)
    return decorated

###
# Get the speech token from the Azure Speech Service
###
@app.route('/api/get-speech-token', methods=['GET'])
@require_auth
def get_speech_token():
    speech_key = os.getenv('SPEECH_KEY')
    speech_region = os.getenv('SPEECH_REGION')

    if speech_key == '' or speech_region == '':
        return 'You forgot to add your speech key or region to the .env file.', 400

    headers = {
        'Ocp-Apim-Subscription-Key': speech_key,
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    try:
        token_response = requests.post(f'https://{speech_region}.api.cognitive.microsoft.com/sts/v1.0/issueToken', headers=headers)
        #token_response.raise_for_status()
        return jsonify(token=token_response.text, region=speech_region)
    except requests.exceptions.RequestException as e:
        return 'There was an error authorizing your speech key.', 401


###
## Run Prompty OpenAPI: summarize transcription of conversation
###
@app.route('/api/generate-doc', methods=['POST'])
@require_auth
def generate_doc():

    try:
        data = request.json
        print("Received:" + str(data))

        note = send_transcription_to_prompty(data['transcription'],data['language'])
        return jsonify(soap_note = note)

    except Exception as e:
        return str(e), 400

###
## Run Prompty OpenAPI: generate handout from SOAP note
###
@app.route('/api/generate-handout', methods=['POST'])
@require_auth
def generate_handout():

    try:
        data = request.json
        print("Received:" + str(data))

        handout = send_note_to_prompty(data['soap_note'],data['language'])
        return jsonify(handout = handout)

    except Exception as e:
        return str(e), 400

if __name__ == '__main__':
    app.config['SESSION_COOKIE_SECURE'] = True  # For HTTPS
    app.config['SESSION_COOKIE_HTTPONLY'] = True
    app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
    app.run(debug=True, port=8000, host='0.0.0.0')

@app.route('/api/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({"message": "Logged out successfully"}), 200