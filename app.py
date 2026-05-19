import os
import numpy as np
import joblib
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Cukup set template_folder saja ke html, biarkan static di-handle oleh Vercel
app = Flask(__name__, template_folder=os.path.join(BASE_DIR, 'html'))
CORS(app)   

model = joblib.load('model.pkl')

# Patch untuk kompatibilitas sklearn lintas versi
if not hasattr(model, 'monotonic_cst'):
    model.monotonic_cst = None

# --- ROUTE UTAMA (Membuka Screening) ---
@app.route('/')
def screening_page():
    return render_template('screening.html')

# --- ROUTE PREDIKSI MACHINE LEARNING ---
@app.route('/predict', methods=['POST'])
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

# --- ROUTE UNTUK HALAMAN HASIL ---
@app.route('/positive')
def positive_page():
    return render_template('positive.html')

@app.route('/negative')
def negative_page():
    return render_template('negative.html')

# --- TAMBAHAN ROUTE UNTUK HALAMAN LAINNYA ---

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

@app.route('/screening.html')
def screening_redirect():
    return render_template('screening.html')


if __name__ == '__main__':
    app.run(debug=True, port=5000)
