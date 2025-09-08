from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import json
import os
from datetime import datetime, timezone
import uuid
import logging
from werkzeug.utils import secure_filename
from werkzeug.security import safe_join

application = Flask(__name__)
application.secret_key = os.environ.get('SECRET_KEY', os.urandom(32))
CORS(application)

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

BASE_DIR = os.path.dirname(__file__)
game_sessions = {}

def load_game_data(lang='ko'):
    # Path Traversal 방지: 허용된 언어만 사용
    if lang not in ['ko', 'en']:
        logger.warning(f"Invalid language requested: {lang}")
        lang = 'ko'
    
    # 안전한 경로 구성
    safe_path = safe_join(BASE_DIR, 'backend', lang, 'game_data.json')
    if not safe_path:
        logger.error(f"Invalid path construction for language: {lang}")
        return None
        
    try:
        with open(safe_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        logger.error(f"Game data file not found: {safe_path}")
        return None
    except json.JSONDecodeError:
        logger.error(f"Invalid JSON in game data file: {safe_path}")
        return None

def load_ascii_art(lang='ko'):
    # Path Traversal 방지: 허용된 언어만 사용
    if lang not in ['ko', 'en']:
        logger.warning(f"Invalid language requested: {lang}")
        lang = 'ko'
    
    # 안전한 경로 구성
    safe_path = safe_join(BASE_DIR, 'backend', lang, 'ascii_art.json')
    if not safe_path:
        logger.error(f"Invalid path construction for language: {lang}")
        return {}
        
    try:
        with open(safe_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        logger.error(f"ASCII art file not found: {safe_path}")
        return {}
    except json.JSONDecodeError:
        logger.error(f"Invalid JSON in ASCII art file: {safe_path}")
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
    # Path Traversal 방지
    safe_filename = secure_filename(filename)
    if not safe_filename or safe_filename != filename:
        logger.warning(f"Potentially unsafe filename requested: {filename}")
        return jsonify({'error': 'Invalid filename'}), 400
    return send_from_directory('frontend', safe_filename)

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
            'start_time': datetime.now(timezone.utc).isoformat(),
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

        # 배열 경계 검사
        if current_q >= len(game_data['questions']):
            logger.error(f"Question index out of bounds: {current_q}")
            return jsonify({'error': 'Invalid question index'}), 400
            
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
        # 민감한 정보 제외하고 필요한 정보만 반환
        session_data = game_sessions[session_id]
        return jsonify({
            'player_name': session_data['player_name'],
            'current_question': session_data['current_question'],
            'score': session_data['score'],
            'correct_answers': session_data['correct_answers'],
            'total_questions': session_data['total_questions']
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@application.route('/health')
def health_check():
    return jsonify({'status': 'healthy', 'service': 'cloud-hero-game'})

if __name__ == '__main__':
    # Railway 배포를 위한 설정
    debug_mode = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    host = os.environ.get('FLASK_HOST', '0.0.0.0')
    port = int(os.environ.get('PORT', os.environ.get('FLASK_PORT', 5001)))
    application.run(debug=debug_mode, host=host, port=port)
