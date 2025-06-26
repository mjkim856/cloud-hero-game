#!/usr/bin/env python3
"""
클라우드 용사 게임 서버 실행 스크립트
개발 환경에서 서버를 쉽게 실행하기 위한 스크립트
"""

import os
import sys

def main():
    print("🎮 클라우드 용사 게임 서버 준비 중...")
    
    # 현재 디렉토리를 backend로 변경
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(backend_dir)
    
    # 필요한 파일들 확인
    required_files = ['app.py', 'game_data.json', 'ascii_art.json']
    missing_files = []
    
    for file in required_files:
        if not os.path.exists(file):
            missing_files.append(file)
    
    if missing_files:
        print(f"❌ 필요한 파일이 없습니다: {', '.join(missing_files)}")
        return
    
    print("✅ 모든 필요한 파일이 준비되었습니다.")
    print("🚀 Flask 서버를 시작합니다...")
    print("📡 서버 주소: http://localhost:5000")
    print("🛑 서버 종료: Ctrl+C")
    print("-" * 50)
    
    # Flask 앱 실행
    try:
        from app import app
        app.run(debug=True, host='0.0.0.0', port=5000)
    except KeyboardInterrupt:
        print("\n🛑 서버가 종료되었습니다.")
    except Exception as e:
        print(f"❌ 서버 실행 중 오류 발생: {e}")

if __name__ == '__main__':
    main()
