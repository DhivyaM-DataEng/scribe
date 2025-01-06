import os, requests

from flask import Flask, render_template, jsonify, request
from dotenv import load_dotenv
from flask_cors import CORS
from notes import send_transcription_to_prompty, send_note_to_prompty

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
        return jsonify({"message":"User data received successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

###
# Get the speech token from the Azure Speech Service
###
@app.route('/api/get-speech-token', methods=['GET'])
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
def generate_handout():

    try:
        data = request.json
        print("Received:" + str(data))

        handout = send_note_to_prompty(data['soap_note'],data['language'])
        return jsonify(handout = handout)

    except Exception as e:
        return str(e), 400

if __name__ == '__main__':
   app.run(debug=True, port=8000, host='0.0.0.0')