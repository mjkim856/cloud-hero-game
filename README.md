# 🎮 클라우드 용사 (Cloud Hero)

AWS 지식을 테스트하는 사지선다형 웹 게임입니다.

![Game Preview](https://img.shields.io/badge/Game-Cloud%20Hero-brightgreen)
![Python](https://img.shields.io/badge/Python-3.8+-blue)
![Flask](https://img.shields.io/badge/Flask-2.3.3-lightgrey)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)

## 🎯 게임 소개

클라우드 세계에 이슈가 발생했습니다! 용사의 힘이 필요합니다!
AWS 서비스에 대한 지식을 활용해 클라우드 마을을 구해보세요.

### 게임 특징
- 🏰 **스토리 기반**: 클라우드 마을을 구하는 모험
- 📚 **실무 중심**: AWS 공식 문서 기반 문제
- 🎨 **터미널 스타일**: 사이버펑크 느낌의 UI
- 🏆 **리더보드**: 다른 플레이어와 점수 경쟁

## 🛠 기술 스택

### 백엔드
- **Python 3.8+**
- **Flask 2.3.3** - 웹 서버
- **Flask-CORS** - CORS 처리
- **UUID** - 세션 관리

### 프론트엔드
- **HTML5** - 구조
- **CSS3** - 터미널 스타일링
- **JavaScript ES6+** - 게임 로직
- **JetBrains Mono** - 개발자 폰트

## 📁 프로젝트 구조

```
cloud-hero-game/
├── backend/
│   ├── app.py              # Flask 메인 서버
│   ├── game_data.json      # 게임 문제 데이터
│   ├── ascii_art.json      # 아스키 아트 데이터
│   ├── requirements.txt    # Python 의존성
│   ├── run_server.py       # 서버 실행 스크립트
│   └── test_api.py         # API 테스트 스크립트
├── frontend/
│   ├── index.html          # 메인 게임 페이지
│   ├── test.html           # 개발/테스트 페이지
│   ├── style.css           # 터미널 스타일
│   └── script.js           # 게임 로직
├── README.md               # 프로젝트 문서
└── .gitignore             # Git 무시 파일
```

## 🚀 설치 및 실행

### 1. 저장소 클론
```bash
git clone <your-repository-url>
cd cloud-hero-game
```

### 2. 백엔드 설정
```bash
cd backend

# 가상환경 생성 (선택사항)
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 의존성 설치
pip install -r requirements.txt

# 서버 실행
python app.py
# 또는
python run_server.py
```

### 3. 프론트엔드 실행
```bash
cd frontend

# 브라우저에서 열기
open index.html
# 또는 개발/테스트용
open test.html
```

### 4. 게임 접속
- **메인 게임**: http://localhost:3000 (또는 파일 경로)
- **백엔드 API**: http://localhost:5000

## 🎮 게임 플레이 방법

1. **이름 입력**: 용사의 이름을 입력하고 게임 시작
2. **문제 해결**: AWS 서비스 관련 사지선다 문제 풀이
3. **결과 확인**: 정답/오답과 상세 설명 확인
4. **모험 완료**: 10개 문제를 모두 풀고 클라우드 마을 구하기
5. **리더보드**: 다른 플레이어들과 점수 비교

## 📚 문제 구성

총 **10개 문제**로 구성되어 있으며, 모든 문제는 AWS 공식 문서를 기반으로 합니다:

1. **EC2** - 클라우드 컴퓨팅 기본 개념
2. **EC2 트러블슈팅** - 메모리 부족 해결
3. **S3 버전 관리** - 삭제된 데이터 복구
4. **Lambda** - 함수 실행 시간 제한
5. **RDS** - 다중 AZ 고가용성
6. **CloudFront** - 캐시 무효화
7. **IAM** - 최소 권한 원칙
8. **Auto Scaling** - 스케일 아웃 개념
9. **보안 그룹** - 포트 설정
10. **Bedrock** - AI 서비스 트러블슈팅

## 🔧 API 엔드포인트

### 게임 플로우
- `POST /api/game/start` - 게임 시작
- `GET /api/game/question/<session_id>` - 문제 가져오기
- `POST /api/game/answer` - 답안 제출
- `GET /api/game/status/<session_id>` - 게임 상태 확인

### 부가 기능
- `GET /api/game/leaderboard` - 리더보드
- `POST /api/game/reset/<session_id>` - 게임 재시작
- `GET /api/debug/sessions` - 디버그 정보

## 🧪 테스트

### API 테스트
```bash
cd backend
python test_api.py
```

### 프론트엔드 테스트
- `test.html` 페이지에서 디버그 도구 사용
- 서버 연결 상태 확인
- 테스트 데이터 리셋 기능

## 🌐 배포

### AWS 배포 옵션
1. **S3 + CloudFront** (정적 웹사이트)
2. **Elastic Beanstalk** (Flask 앱)
3. **EC2** (직접 서버 관리)

자세한 배포 가이드는 추후 업데이트 예정입니다.

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 문의

프로젝트에 대한 질문이나 제안사항이 있으시면 이슈를 생성해주세요.

---

**🎮 클라우드 용사가 되어 AWS 마스터로 거듭나세요! 🚀**
