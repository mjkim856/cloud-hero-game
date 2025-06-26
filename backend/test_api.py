#!/usr/bin/env python3
"""
클라우드 용사 게임 API 테스트 스크립트
서버가 정상적으로 작동하는지 확인하기 위한 테스트
"""

import requests
import json
import time

BASE_URL = "http://localhost:5000"

def test_server_status():
    """서버 상태 확인"""
    try:
        response = requests.get(f"{BASE_URL}/")
        print("✅ 서버 상태:", response.json()['message'])
        return True
    except Exception as e:
        print(f"❌ 서버 연결 실패: {e}")
        return False

def test_game_flow():
    """게임 전체 플로우 테스트"""
    print("\n🎮 게임 플로우 테스트 시작...")
    
    # 1. 게임 시작
    start_data = {"player_name": "테스트용사"}
    response = requests.post(f"{BASE_URL}/api/game/start", json=start_data)
    
    if response.status_code != 200:
        print("❌ 게임 시작 실패")
        return
    
    result = response.json()
    session_id = result['session_id']
    print(f"✅ 게임 시작 성공 - 세션 ID: {session_id[:8]}...")
    print(f"   플레이어: {result['player_name']}")
    
    # 2. 첫 번째 문제 가져오기
    response = requests.get(f"{BASE_URL}/api/game/question/{session_id}")
    
    if response.status_code != 200:
        print("❌ 문제 가져오기 실패")
        return
    
    question = response.json()
    print(f"✅ 문제 가져오기 성공")
    print(f"   문제 {question['question_number']}: {question['scenario'][:50]}...")
    
    # 3. 답안 제출 (첫 번째 선택지로 테스트)
    answer_data = {
        "session_id": session_id,
        "selected_answer": 0
    }
    response = requests.post(f"{BASE_URL}/api/game/answer", json=answer_data)
    
    if response.status_code != 200:
        print("❌ 답안 제출 실패")
        return
    
    result = response.json()
    print(f"✅ 답안 제출 성공")
    print(f"   정답 여부: {'맞음' if result['is_correct'] else '틀림'}")
    print(f"   현재 점수: {result['current_score']}")
    
    # 4. 게임 상태 확인
    response = requests.get(f"{BASE_URL}/api/game/status/{session_id}")
    
    if response.status_code != 200:
        print("❌ 게임 상태 확인 실패")
        return
    
    status = response.json()
    print(f"✅ 게임 상태 확인 성공")
    print(f"   진행률: {status['progress_percentage']}%")
    print(f"   정답 수: {status['correct_answers']}")

def main():
    print("🧪 클라우드 용사 게임 API 테스트")
    print("=" * 50)
    
    # 서버 상태 확인
    if not test_server_status():
        print("\n💡 서버를 먼저 실행해주세요:")
        print("   cd backend && python app.py")
        return
    
    # 게임 플로우 테스트
    test_game_flow()
    
    print("\n🎯 테스트 완료!")
    print("💡 전체 게임을 테스트하려면 프론트엔드를 사용하세요.")

if __name__ == '__main__':
    main()
