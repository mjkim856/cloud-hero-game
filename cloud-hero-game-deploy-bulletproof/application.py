"""
클라우드 용사 게임 - Elastic Beanstalk 배포용
프론트엔드 + 백엔드 통합 서버
"""

from flask import Flask, request, jsonify, session, send_from_directory, render_template_string
from flask_cors import CORS
import json
import os
from datetime import datetime
import uuid

# Elastic Beanstalk는 application.py 파일을 찾습니다
application = Flask(__name__)
application.secret_key = 'cloud-hero-secret-key-2024'
CORS(application)

# 게임 데이터 로드
def load_game_data():
    """게임 데이터 JSON 파일 로드"""
    try:
        with open('backend/game_data.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print("❌ game_data.json 파일을 찾을 수 없습니다!")
        return None

def load_ascii_art():
    """ASCII 아트 데이터 로드"""
    try:
        with open('backend/ascii_art.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print("❌ ascii_art.json 파일을 찾을 수 없습니다!")
        return {}

# 전역 변수
game_data = load_game_data()
ascii_art = load_ascii_art()
game_sessions = {}

# 프론트엔드 라우트
@application.route('/')
def index():
    """메인 페이지"""
    try:
        with open('frontend/index.html', 'r', encoding='utf-8') as f:
            return f.read()
    except FileNotFoundError:
        return "게임 파일을 찾을 수 없습니다!", 404

@application.route('/script.js')
def script():
    """JavaScript 파일"""
    try:
        with open('frontend/script.js', 'r', encoding='utf-8') as f:
            content = f.read()
            # API URL을 현재 도메인으로 변경
            content = content.replace(
                'http://localhost:5001/api',
                '/api'
            )
            response = application.response_class(
                content,
                mimetype='application/javascript'
            )
            return response
    except FileNotFoundError:
        return "스크립트 파일을 찾을 수 없습니다!", 404

@application.route('/style.css')
def style():
    """CSS 파일"""
    try:
        with open('frontend/style.css', 'r', encoding='utf-8') as f:
            response = application.response_class(
                f.read(),
                mimetype='text/css'
            )
            return response
    except FileNotFoundError:
        return "스타일 파일을 찾을 수 없습니다!", 404

# API 라우트들
@application.route('/api/game/start', methods=['POST'])
def start_game():
    """게임 시작"""
    try:
        data = request.get_json()
        player_name = data.get('player_name', '용사')
        
        # 세션 ID 생성
        session_id = str(uuid.uuid4())
        
        # 게임 세션 초기화
        game_sessions[session_id] = {
            'player_name': player_name,
            'current_question': 0,
            'score': 0,
            'correct_answers': 0,
            'total_questions': len(game_data['questions']),
            'start_time': datetime.now().isoformat(),
            'answers': []
        }
        
        print(f"🎮 새 게임 시작: {player_name} (세션: {session_id})")
        
        return jsonify({
            'session_id': session_id,
            'player_name': player_name,
            'ascii_art': ascii_art.get('welcome', []),
            'village_entrance': ascii_art.get('village_entrance', []),
            'welcome_message': f"{player_name}는 마을에 입장했다!"
        })
        
    except Exception as e:
        print(f"❌ 게임 시작 오류: {e}")
        return jsonify({'error': str(e)}), 500

@application.route('/api/game/question/<session_id>')
def get_question(session_id):
    """문제 가져오기"""
    try:
        if session_id not in game_sessions:
            return jsonify({'error': '유효하지 않은 세션입니다.'}), 400
        
        session = game_sessions[session_id]
        current_q = session['current_question']
        
        if current_q >= len(game_data['questions']):
            return jsonify({'error': '모든 문제를 완료했습니다.'}), 400
        
        question = game_data['questions'][current_q]
        
        return jsonify({
            'question': question,
            'progress': {
                'current': current_q + 1,
                'total': session['total_questions']
            }
        })
        
    except Exception as e:
        print(f"❌ 문제 로딩 오류: {e}")
        return jsonify({'error': str(e)}), 500

@application.route('/api/game/answer', methods=['POST'])
def submit_answer():
    """답안 제출"""
    try:
        data = request.get_json()
        session_id = data.get('session_id')
        # 두 가지 필드명 모두 지원
        answer = data.get('answer')
        if answer is None:
            answer = data.get('selected_answer')
        
        print(f"📤 답안 제출 요청: session_id={session_id}, answer={answer}, type={type(answer)}")
        print(f"📤 전체 요청 데이터: {data}")
        
        if not session_id:
            return jsonify({'error': 'session_id가 필요합니다.'}), 400
            
        if answer is None:
            return jsonify({'error': 'answer 또는 selected_answer가 필요합니다.'}), 400
        
        if session_id not in game_sessions:
            return jsonify({'error': '유효하지 않은 세션입니다.'}), 400
        
        session = game_sessions[session_id]
        current_q = session['current_question']
        
        if current_q >= len(game_data['questions']):
            return jsonify({'error': '더 이상 문제가 없습니다.'}), 400
            
        question = game_data['questions'][current_q]
        print(f"📋 현재 문제: {question.get('id', 'unknown')}")
        print(f"📋 선택지: {question.get('choices', [])}")
        print(f"📋 정답: {question.get('correct_answer')}")
        
        # 답안을 정수로 변환
        try:
            answer = int(answer)
        except (ValueError, TypeError):
            print(f"❌ 답안을 정수로 변환할 수 없음: {answer}")
            return jsonify({'error': '유효하지 않은 답안 형식입니다.'}), 400
        
        # 정답 확인
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
        
        # 게임 완료 체크
        game_completed = session['current_question'] >= session['total_questions']
        
        # 안전한 선택지 처리
        selected_choice = '알 수 없음'
        choices = question.get('choices', [])
        if isinstance(choices, list) and 0 <= answer < len(choices):
            selected_choice = choices[answer]
        else:
            print(f"⚠️ 잘못된 답안 인덱스: {answer}, 선택지 수: {len(choices)}")
        
        result = {
            'is_correct': is_correct,
            'correct_answer': question.get('correct_answer', -1),
            'selected_choice': selected_choice,
            'explanation': question.get('explanation', '설명이 없습니다.'),
            'reference_url': question.get('reference_url', ''),
            'current_score': session['score'],
            'game_completed': game_completed
        }
        
        if game_completed:
            # 개인화된 엔딩 메시지 생성
            player_name = session['player_name']
            accuracy = (session['correct_answers'] / session['total_questions']) * 100
            
            result.update({
                'final_score': session['score'],
                'correct_answers': session['correct_answers'],
                'total_questions': session['total_questions'],
                'accuracy': accuracy,
                'player_name': player_name,
                'personalized_message': f"축하합니다, {player_name}님! 정답률 {accuracy:.0f}%로 게임을 완료했습니다!"
            })
            
            print(f"🎉 게임 완료: {player_name} - 점수: {session['score']}, 정답률: {accuracy:.1f}%")
        
        print(f"✅ 답안 제출 성공: is_correct={is_correct}, selected_choice={selected_choice}")
        return jsonify(result)
        
    except Exception as e:
        print(f"❌ 답안 제출 오류: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@application.route('/api/game/status/<session_id>')
def get_game_status(session_id):
    """게임 상태 조회"""
    try:
        if session_id not in game_sessions:
            return jsonify({'error': '유효하지 않은 세션입니다.'}), 400
        
        session = game_sessions[session_id]
        return jsonify(session)
        
    except Exception as e:
        print(f"❌ 게임 상태 조회 오류: {e}")
        return jsonify({'error': str(e)}), 500

# 헬스 체크
@application.route('/health')
def health_check():
    return jsonify({'status': 'healthy', 'service': 'cloud-hero-game'})

if __name__ == '__main__':
    print("🎮 클라우드 용사 게임 서버 시작! (Elastic Beanstalk 배포용)")
    print("📡 프론트엔드 + 백엔드 통합 서버")
    print("🚀 서버 실행 중...")
    
    # 로컬 테스트용
    application.run(debug=True, host='0.0.0.0', port=5000)
