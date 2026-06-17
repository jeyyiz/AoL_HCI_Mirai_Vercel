import os
import numpy as np
import joblib
from flask import Flask, render_template, request, jsonify, send_from_directory
from flask_cors import CORS

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

app = Flask(__name__, template_folder=os.path.join(BASE_DIR, 'html'))
CORS(app)

model = joblib.load(os.path.join(BASE_DIR, 'model.pkl'))

if not hasattr(model, 'monotonic_cst'):
    model.monotonic_cst = None

@app.route('/css/<path:filename>')
def custom_css(filename):
    return send_from_directory(os.path.join(BASE_DIR, 'css'), filename)

@app.route('/java/<path:filename>')
def custom_java(filename):
    return send_from_directory(os.path.join(BASE_DIR, 'java'), filename)

@app.route('/assets/<path:filename>')
def custom_assets(filename):
    return send_from_directory(os.path.join(BASE_DIR, 'assets'), filename)
    
@app.route('/')
@app.route('/screening.html')
def screening_page():
    return render_template('screening.html')

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        answers = data.get('answers')
        gender_encoded = data.get('gender')

        if answers is None or len(answers) != 10 or gender_encoded is None:
            return jsonify({'error': 'Data kuis atau gender tidak lengkap'}), 400

        features = answers + [gender_encoded]
        features_array = np.array([features])

        prediction = model.predict(features_array)
        result = int(prediction[0])

        return jsonify({
            'success': True,
            'prediction': result
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/positive')
@app.route('/positive.html')
def positive_page():
    return render_template('positive.html')

@app.route('/negative')
def negative_page():
    return render_template('negative.html')

@app.route('/home.html')
@app.route('/home')
def home_page():
    return render_template('home.html')

@app.route('/forum.html')
@app.route('/forum')
def forum_page():
    return render_template('forum.html')

@app.route('/information.html')
@app.route('/information')
def information_page():
    return render_template('information.html')

@app.route('/news.html')
@app.route('/news')
def news_page():
    return render_template('news.html')

@app.route('/signin.html')
@app.route('/signin')
def signin_page():
    return render_template('signin.html')

@app.route('/signup.html')
@app.route('/signup')
def signup_page():
    return render_template('signup.html')

@app.route('/therapists.html')
@app.route('/therapists')
def therapists_page():
    return render_template('therapists.html')


if __name__ == '__main__':
    app.run(debug=True, port=5000)
