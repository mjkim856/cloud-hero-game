# 클라우드 용사 게임 AWS 배포 가이드

## 🚀 빠른 배포 (프론트엔드만)

### 1. AWS CLI 설치 및 설정
```bash
# AWS CLI 설치 (macOS)
brew install awscli

# AWS 자격 증명 설정
aws configure
```

### 2. 프론트엔드 배포 (S3 정적 웹사이트)
```bash
cd deployment
./deploy.sh
```

## 🏗️ 전체 배포 (프론트엔드 + 백엔드)

### 옵션 1: EC2 배포
1. EC2 인스턴스 생성
2. 백엔드 파일 업로드
3. Docker 설치 및 실행

### 옵션 2: Elastic Beanstalk 배포
1. EB CLI 설치
2. 애플리케이션 생성 및 배포

### 옵션 3: ECS + Fargate 배포
1. ECR에 Docker 이미지 푸시
2. ECS 서비스 생성

## 📁 파일 구조
```
deployment/
├── frontend/           # 프론트엔드 파일
│   ├── index.html
│   ├── script.js
│   └── style.css
├── backend/            # 백엔드 파일
│   ├── app.py
│   ├── game_data.json
│   ├── ascii_art.json
│   ├── requirements.txt
│   └── Dockerfile
├── deploy.sh          # 배포 스크립트
└── README.md          # 이 파일
```

## 🔧 설정 변경 필요 사항

### 프론트엔드 (script.js)
- 배포 후 백엔드 URL을 실제 주소로 변경

### 백엔드 (app.py)
- CORS 설정 확인
- 프로덕션 환경 설정

## 💡 팁
- 먼저 프론트엔드만 배포해서 테스트
- 백엔드는 나중에 추가 배포
- CloudFront 사용하면 더 빠른 로딩 가능
