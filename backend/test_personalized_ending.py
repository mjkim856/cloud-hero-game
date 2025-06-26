#!/usr/bin/env python3
"""
개인화된 엔딩 메시지 테스트
"""

import json

def test_personalized_ending():
    # 게임 데이터 로드
    with open('game_data_final.json', 'r', encoding='utf-8') as f:
        game_data = json.load(f)
    
    # 엔딩 메시지 템플릿
    ending_template = game_data.get('ending_message', {}).get('success', [])
    
    print("🎮 개인화된 엔딩 메시지 테스트")
    print("=" * 50)
    
    # 테스트할 플레이어 이름들
    test_names = ['클라우드마스터', '용사', 'AWS전문가', '개발자']
    
    for player_name in test_names:
        print(f"\n👤 플레이어: {player_name}")
        print("-" * 30)
        
        # 개인화된 엔딩 메시지 생성
        personalized_ending = []
        for line in ending_template:
            personalized_line = line.replace('{player_name}', player_name)
            personalized_ending.append(personalized_line)
        
        # 결과 출력
        for line in personalized_ending:
            print(f"  {line}")
    
    print("\n✅ 테스트 완료!")

if __name__ == '__main__':
    test_personalized_ending()
