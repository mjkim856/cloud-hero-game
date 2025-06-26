"""
클라우드 용사 게임 백엔드 API 서버 (테스트용 - 포트 5001)
"""

from flask import Flask, request, jsonify, session
from flask_cors import CORS
import json
import os
from datetime import datetime
import uuid

app = Flask(__name__)
app.secret_key = 'cloud-hero-secret-key-2024'
CORS(app)

# 게임 데이터 로드
def load_game_data():
    """게임 데이터 JSON 파일 로드"""
    try:
        with open('game_data.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return {"error": "게임 데이터를 찾을 수 없습니다."}

def load_ascii_art():
    """아스키 아트 데이터 로드"""
    try:
        with open('ascii_art.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return {"welcome_screen": ["게임을 시작합니다!"]}

# 게임 세션 관리
game_sessions = {}

@app.route('/')
def home():
    """서버 상태 확인"""
    return jsonify({
        "message": "🎮 클라우드 용사 게임 서버가 실행 중입니다!",
        "status": "running",
        "port": 5001,
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/game/start', methods=['POST'])
def start_game():
    """게임 시작 - 사용자 이름 입력 및 세션 생성"""
    data = request.get_json()
    player_name = data.get('player_name', '용사').strip()
    
    if not player_name:
        player_name = '용사'
    
    # 새 게임 세션 생성
    session_id = str(uuid.uuid4())
    game_sessions[session_id] = {
        'player_name': player_name,
        'current_question': 0,
        'score': 0,
        'correct_answers': 0,
        'start_time': datetime.now().isoformat(),
        'answers': []
    }
    
    # 아스키 아트 로드
    ascii_art = load_ascii_art()
    
    return jsonify({
        "session_id": session_id,
        "player_name": player_name,
        "welcome_message": f"{player_name}는 마을에 입장했다!",
        "ascii_art": ascii_art.get("welcome_screen", []),
        "village_entrance": ascii_art.get("village_entrance", [])
    })

@app.route('/api/game/question/<session_id>')
def get_question(session_id):
    """현재 문제 가져오기"""
    if session_id not in game_sessions:
        return jsonify({"error": "유효하지 않은 세션입니다."}), 400
    
    session_data = game_sessions[session_id]
    current_q_index = session_data['current_question']
    
    game_data = load_game_data()
    questions = game_data.get('questions', [])
    
    if current_q_index >= len(questions):
        # 게임 완료
        return jsonify({
            "game_completed": True,
            "final_score": session_data['score'],
            "correct_answers": session_data['correct_answers'],
            "total_questions": len(questions),
            "ending_message": game_data.get('ending_message', {}).get('success', [])
        })
    
    current_question = questions[current_q_index]
    
    return jsonify({
        "question_id": current_question['id'],
        "question_number": current_q_index + 1,
        "total_questions": len(questions),
        "scenario": current_question['scenario'],
        "ascii_scene": current_question['ascii_scene'],
        "choices": current_question['choices'],
        "player_name": session_data['player_name']
    })

@app.route('/api/game/answer', methods=['POST'])
def submit_answer():
    """답안 제출 및 결과 확인"""
    data = request.get_json()
    session_id = data.get('session_id')
    selected_answer = data.get('selected_answer')
    
    if session_id not in game_sessions:
        return jsonify({"error": "유효하지 않은 세션입니다."}), 400
    
    session_data = game_sessions[session_id]
    current_q_index = session_data['current_question']
    
    game_data = load_game_data()
    questions = game_data.get('questions', [])
    
    if current_q_index >= len(questions):
        return jsonify({"error": "더 이상 문제가 없습니다."}), 400
    
    current_question = questions[current_q_index]
    correct_answer = current_question['correct_answer']
    is_correct = selected_answer == correct_answer
    
    # 답안 기록
    session_data['answers'].append({
        'question_id': current_question['id'],
        'selected': selected_answer,
        'correct': correct_answer,
        'is_correct': is_correct
    })
    
    if is_correct:
        session_data['score'] += 10
        session_data['correct_answers'] += 1
    
    # 다음 문제로 이동
    session_data['current_question'] += 1
    
    return jsonify({
        "is_correct": is_correct,
        "correct_answer": correct_answer,
        "explanation": current_question['explanation'],
        "reference_url": current_question['reference_url'],
        "current_score": session_data['score'],
        "selected_choice": current_question['choices'][selected_answer] if selected_answer < len(current_question['choices']) else "잘못된 선택"
    })

@app.route('/api/debug/sessions')
def debug_sessions():
    """디버그용 - 현재 활성 세션 확인"""
    return jsonify({
        "active_sessions": len(game_sessions),
        "sessions": {k: {
            "player_name": v['player_name'],
            "current_question": v['current_question'],
            "score": v['score'],
            "correct_answers": v['correct_answers'],
            "total_answers": len(v['answers'])
        } for k, v in game_sessions.items()}
    })

if __name__ == '__main__':
    print("🎮 클라우드 용사 게임 서버 시작! (포트 5001)")
    print("📡 테스트 URL: http://localhost:5001")
    app.run(debug=True, host='0.0.0.0', port=5001)
