from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import json
import os
from datetime import datetime
import uuid

application = Flask(__name__)
application.secret_key = 'cloud-hero-secret-key-2024'
CORS(application)

BASE_DIR = os.path.dirname(__file__)
game_sessions = {}

def load_game_data(lang='ko'):
    path = os.path.join(BASE_DIR, 'backend', lang, 'game_data.json')
    try:
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"❌ {path} 파일을 찾을 수 없습니다!")
        return None

def load_ascii_art(lang='ko'):
    path = os.path.join(BASE_DIR, 'backend', lang, 'ascii_art.json')
    try:
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"❌ {path} 파일을 찾을 수 없습니다!")
        return {}

@application.route('/')
def index():
    lang = request.args.get('lang', 'ko')
    filename = 'index-multi.html' if lang == 'en' else 'index.html'
    return send_from_directory('frontend', filename)

@application.route('/script.js')
def script():
    return send_from_directory('frontend', 'script.js', mimetype='application/javascript')

@application.route('/script-multi.js')
def script_multi():
    return send_from_directory('frontend', 'script-multi.js', mimetype='application/javascript')

@application.route('/style.css')
def style():
    return send_from_directory('frontend', 'style.css', mimetype='text/css')

@application.route('/<path:filename>')
def static_files(filename):
    return send_from_directory('frontend', filename)

@application.route('/api/game/start', methods=['POST'])
def start_game():
    try:
        data = request.get_json()
        player_name = data.get('player_name', '용사')
        lang = data.get('lang', 'ko')

        game_data = load_game_data(lang)
        ascii_art = load_ascii_art(lang)

        session_id = str(uuid.uuid4())

        game_sessions[session_id] = {
            'player_name': player_name,
            'lang': lang,
            'game_data': game_data,
            'ascii_art': ascii_art,
            'current_question': 0,
            'score': 0,
            'correct_answers': 0,
            'total_questions': len(game_data['questions']),
            'start_time': datetime.now().isoformat(),
            'answers': []
        }

        return jsonify({
            'session_id': session_id,
            'player_name': player_name,
            'ascii_art': ascii_art.get('welcome', []),
            'village_entrance': ascii_art.get('village_entrance', []),
            'welcome_message': f"{player_name} has entered the village!"
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@application.route('/api/game/question/<session_id>')
def get_question(session_id):
    try:
        if session_id not in game_sessions:
            return jsonify({'error': 'Invalid session'}), 400

        session = game_sessions[session_id]
        game_data = session['game_data']
        current_q = session['current_question']

        question = game_data['questions'][current_q]

        return jsonify({
            'question': question,
            'progress': {
                'current': current_q + 1,
                'total': session['total_questions']
            }
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@application.route('/api/game/answer', methods=['POST'])
def submit_answer():
    try:
        data = request.get_json()
        session_id = data.get('session_id')
        answer = data.get('answer') or data.get('selected_answer')

        if not session_id or answer is None:
            return jsonify({'error': 'Missing session_id or answer'}), 400

        if session_id not in game_sessions:
            return jsonify({'error': 'Invalid session'}), 400

        session = game_sessions[session_id]
        game_data = session['game_data']
        current_q = session['current_question']
        question = game_data['questions'][current_q]

        try:
            answer = int(answer)
        except:
            return jsonify({'error': 'Answer must be an integer'}), 400

        is_correct = answer == question.get('correct_answer', -1)
        if is_correct:
            session['score'] += 10
            session['correct_answers'] += 1

        session['answers'].append({
            'question_id': current_q,
            'selected_answer': answer,
            'is_correct': is_correct
        })

        session['current_question'] += 1
        game_completed = session['current_question'] >= session['total_questions']

        selected_choice = 'Unknown'
        choices = question.get('choices', [])
        if isinstance(choices, list) and 0 <= answer < len(choices):
            selected_choice = choices[answer]

        result = {
            'is_correct': is_correct,
            'correct_answer': question.get('correct_answer', -1),
            'selected_choice': selected_choice,
            'explanation': question.get('explanation', 'No explanation available.'),
            'reference_url': question.get('reference_url', ''),
            'current_score': session['score'],
            'game_completed': game_completed
        }

        if game_completed:
            accuracy = (session['correct_answers'] / session['total_questions']) * 100
            player_name = session['player_name']
            ending_template = game_data.get('ending_message', {}).get('success', [])
            ending_message = [line.replace('{player_name}', player_name) for line in ending_template]

            result.update({
                'final_score': session['score'],
                'correct_answers': session['correct_answers'],
                'total_questions': session['total_questions'],
                'accuracy': accuracy,
                'player_name': player_name,
                'ending_message': ending_message
            })

        return jsonify(result)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@application.route('/api/game/status/<session_id>')
def get_game_status(session_id):
    try:
        if session_id not in game_sessions:
            return jsonify({'error': 'Invalid session'}), 400
        return jsonify(game_sessions[session_id])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@application.route('/health')
def health_check():
    return jsonify({'status': 'healthy', 'service': 'cloud-hero-game'})

if __name__ == '__main__':
    application.run(debug=True, host='0.0.0.0', port=5001)
