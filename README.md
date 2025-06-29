# ⚔️ Cloud Hero Game (클라우드 용사)

AWS 클라우드 서비스에 대한 지식을 재미있는 RPG 게임으로 학습할 수 있는 웹 기반 퀴즈 게임입니다.

## 🎮 게임 소개

클라우드 세계에 이슈가 발생했습니다! 용사의 힘이 필요합니다!

플레이어는 클라우드 용사가 되어 다양한 AWS 서비스 관련 문제를 해결하며 모험을 떠납니다. 각 스테이지마다 실제 AWS 환경에서 발생할 수 있는 상황들을 시나리오로 구성하여, 학습과 재미를 동시에 제공합니다.

## ✨ 게임 특징

- **스토리텔링 기반 학습**: 각 문제마다 흥미로운 시나리오와 ASCII 아트로 몰입감 제공
- **실무 중심 문제**: 실제 AWS 환경에서 발생할 수 있는 상황들을 바탕으로 한 문제 구성
- **즉시 피드백**: 문제 해결 후 상세한 설명과 참고 자료 제공
- **진행률 추적**: 실시간 점수 및 정답률 확인
- **반응형 디자인**: 다양한 디바이스에서 최적화된 게임 경험
- **개인화된 결과**: 플레이어 이름과 함께 개인화된 엔딩 메시지

## 🛠 기술 스택

### Backend
- **Python 3.x**: 메인 서버 언어
- **Flask**: 웹 프레임워크
- **Flask-CORS**: Cross-Origin Resource Sharing 지원

### Frontend
- **HTML5**: 마크업
- **CSS3**: 스타일링 (JetBrains Mono 폰트 사용)
- **Vanilla JavaScript**: 게임 로직 및 API 통신

### 배포
- **AWS Elastic Beanstalk**: 애플리케이션 배포 및 관리
- **통합 서버**: 프론트엔드와 백엔드를 하나의 Flask 애플리케이션으로 통합

## 📁 프로젝트 구조

```
cloud-hero-game/
├── application.py              # Elastic Beanstalk 메인 애플리케이션
├── requirements.txt           # Python 의존성 패키지
├── .gitignore                # Git 무시 파일 설정
├── frontend/                 # 프론트엔드 파일들
│   ├── index.html           # 메인 게임 페이지
│   ├── script.js            # 게임 로직 JavaScript
│   ├── style.css            # 게임 스타일시트
│   ├── languages.js         # 다국어 지원 (개발 중)
│   └── multilingual_final.html # 다국어 버전 (개발 중)
└── backend/                 # 백엔드 데이터 파일들
    ├── game_data.json       # 게임 문제 및 시나리오 데이터
    ├── ascii_art.json       # ASCII 아트 데이터
    ├── app.py              # 백엔드 서버 (개발용)
    └── requirements.txt    # 백엔드 의존성
```

## 🚀 게임 링크

**🎯 [지금 플레이하기!](https://cloud-hero.site/)**

*게임은 AWS Elastic Beanstalk에 배포되어 언제든지 플레이할 수 있습니다.*

## 📚 문제 구성

총 **10개의 스테이지**로 구성되어 있으며, 각 스테이지는 다음과 같은 AWS 서비스들을 다룹니다:

1. **AWS 기본 개념** - 클라우드 컴퓨팅 서비스 이해
2. **EC2 (Elastic Compute Cloud)** - 인스턴스 메모리 관리 및 최적화
3. **S3 (Simple Storage Service)** - 데이터 백업 및 복구 전략
4. **Lambda** - 서버리스 함수 실행 시간 제한
5. **RDS (Relational Database Service)** - 다중 AZ 배포와 고가용성
6. **CloudFront** - CDN 캐시 무효화 및 콘텐츠 배포
7. **IAM (Identity and Access Management)** - 최소 권한 원칙과 보안
8. **Auto Scaling** - 자동 확장 및 스케일링 전략
9. **Security Groups** - 네트워크 보안 및 포트 관리
10. **Amazon Bedrock** - AI/ML 서비스 권한 및 접근 관리

각 문제는 실제 업무 상황을 반영한 시나리오와 함께 제공되며, 정답 해설과 AWS 공식 문서 링크를 통해 심화 학습이 가능합니다.

---

**🎯 목표**: AWS 클라우드 서비스에 대한 실무 지식을 게임을 통해 재미있게 학습하세요!
