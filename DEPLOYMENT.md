# 🚀 배포 가이드

클라우드 용사 게임을 AWS에 배포하는 방법을 안내합니다.

## 배포 옵션

### 1. S3 + CloudFront (정적 웹사이트) - 추천 ⭐

프론트엔드만 배포하고 백엔드는 별도 서버에서 실행하는 방식입니다.

#### 장점
- 비용 효율적
- 빠른 로딩 속도
- 글로벌 CDN 지원

#### 단계
1. **S3 버킷 생성**
   ```bash
   aws s3 mb s3://cloud-hero-game-frontend
   ```

2. **정적 웹사이트 호스팅 설정**
   ```bash
   aws s3 website s3://cloud-hero-game-frontend \
     --index-document index.html \
     --error-document index.html
   ```

3. **파일 업로드**
   ```bash
   cd frontend
   aws s3 sync . s3://cloud-hero-game-frontend --delete
   ```

4. **CloudFront 배포 생성**
   - AWS 콘솔에서 CloudFront 배포 생성
   - Origin: S3 버킷
   - Viewer Protocol Policy: Redirect HTTP to HTTPS

### 2. Elastic Beanstalk (전체 앱)

Flask 백엔드와 프론트엔드를 함께 배포하는 방식입니다.

#### 준비 파일
```bash
# requirements.txt (이미 존재)
Flask==2.3.3
Flask-CORS==4.0.0

# application.py (app.py를 복사)
cp backend/app.py application.py
```

#### 배포 명령
```bash
# EB CLI 설치
pip install awsebcli

# 애플리케이션 초기화
eb init cloud-hero-game

# 환경 생성 및 배포
eb create production
eb deploy
```

### 3. EC2 (직접 관리)

EC2 인스턴스에서 직접 서버를 실행하는 방식입니다.

#### 사용자 데이터 스크립트
```bash
#!/bin/bash
yum update -y
yum install -y python3 python3-pip git

# 프로젝트 클론
git clone <your-repo-url> /home/ec2-user/cloud-hero-game
cd /home/ec2-user/cloud-hero-game

# 백엔드 설정
cd backend
pip3 install -r requirements.txt

# 서비스 시작
python3 app.py &
```

## 환경 변수 설정

### 프로덕션용 설정
```bash
export FLASK_ENV=production
export FLASK_DEBUG=False
export SECRET_KEY=your-secret-key-here
```

### 백엔드 URL 변경
프론트엔드의 `script.js`에서 API URL을 프로덕션 URL로 변경:

```javascript
// 개발용
this.apiBaseUrl = 'http://localhost:5000/api';

// 프로덕션용
this.apiBaseUrl = 'https://your-backend-domain.com/api';
```

## 보안 설정

### CORS 설정
```python
# app.py에서
CORS(app, origins=['https://your-frontend-domain.com'])
```

### HTTPS 강제
```python
# Flask-Talisman 사용
from flask_talisman import Talisman
Talisman(app, force_https=True)
```

## 모니터링

### CloudWatch 로그
- Elastic Beanstalk: 자동 설정
- EC2: CloudWatch Agent 설치 필요

### 헬스 체크
```python
@app.route('/health')
def health_check():
    return jsonify({"status": "healthy", "timestamp": datetime.now().isoformat()})
```

## 비용 최적화

### S3 + CloudFront
- 월 예상 비용: $1-5 (트래픽에 따라)
- 프리 티어 활용 가능

### Elastic Beanstalk
- 월 예상 비용: $10-30 (인스턴스 타입에 따라)
- t3.micro 프리 티어 활용

### EC2
- 월 예상 비용: $8-50 (인스턴스 타입에 따라)
- t2.micro 프리 티어 활용

## 트러블슈팅

### 일반적인 문제
1. **CORS 오류**: 백엔드 CORS 설정 확인
2. **API 연결 실패**: 보안 그룹 포트 설정 확인
3. **정적 파일 404**: S3 버킷 정책 확인

### 로그 확인
```bash
# Elastic Beanstalk
eb logs

# EC2
sudo tail -f /var/log/messages
```

## 자동화 스크립트

### 배포 스크립트 (deploy.sh)
```bash
#!/bin/bash
echo "🚀 클라우드 용사 배포 시작..."

# 프론트엔드 빌드 및 업로드
cd frontend
aws s3 sync . s3://cloud-hero-game-frontend --delete

# CloudFront 캐시 무효화
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"

echo "✅ 배포 완료!"
```

### GitHub Actions (선택사항)
```yaml
name: Deploy to AWS
on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Deploy to S3
      run: |
        aws s3 sync frontend/ s3://cloud-hero-game-frontend --delete
```

---

배포 관련 질문이나 문제가 있으시면 이슈를 생성해주세요! 🤝
