# 📤 GitHub 업로드 가이드

클라우드 용사 게임을 GitHub에 업로드하는 단계별 가이드입니다.

## 🔧 사전 준비

### 1. Git 설치 확인
```bash
git --version
```
설치되어 있지 않다면 [Git 공식 사이트](https://git-scm.com/)에서 다운로드하세요.

### 2. GitHub 계정 준비
- GitHub 계정이 없다면 [github.com](https://github.com)에서 회원가입
- 로그인 후 새 저장소 생성 준비

## 📁 1단계: 로컬 Git 저장소 초기화

프로젝트 폴더에서 다음 명령어를 실행하세요:

```bash
cd /Users/mjk/cloud-hero-game

# Git 저장소 초기화
git init

# 모든 파일 추가
git add .

# 첫 번째 커밋
git commit -m "🎮 클라우드 용사 게임 초기 버전

- AWS 지식 테스트 사지선다 게임
- Flask 백엔드 + HTML/CSS/JS 프론트엔드
- 10개 AWS 서비스 문제 (EC2, S3, Lambda 등)
- 터미널 스타일 UI
- 리더보드 및 점수 시스템"
```

## 🌐 2단계: GitHub 저장소 생성

### 웹 브라우저에서:
1. [GitHub](https://github.com)에 로그인
2. 우측 상단 "+" 버튼 클릭 → "New repository"
3. 저장소 설정:
   - **Repository name**: `cloud-hero-game`
   - **Description**: `🎮 AWS 지식을 테스트하는 클라우드 용사 게임`
   - **Public** 선택 (다른 사람들이 볼 수 있도록)
   - **Add a README file**: 체크 해제 (이미 있음)
   - **Add .gitignore**: 체크 해제 (이미 있음)
4. "Create repository" 클릭

## 🔗 3단계: 로컬과 GitHub 연결

GitHub에서 제공하는 명령어를 복사해서 실행하거나, 아래 명령어를 사용하세요:

```bash
# GitHub 저장소와 연결 (YOUR_USERNAME을 실제 사용자명으로 변경)
git remote add origin https://github.com/YOUR_USERNAME/cloud-hero-game.git

# 기본 브랜치를 main으로 설정
git branch -M main

# GitHub에 업로드
git push -u origin main
```

## 🔐 4단계: 인증 설정

### Personal Access Token 사용 (추천)
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. "Generate new token (classic)" 클릭
3. 권한 설정:
   - **repo**: 전체 선택
   - **workflow**: 선택 (GitHub Actions 사용 시)
4. 토큰 생성 후 복사 (한 번만 표시됨!)
5. Git 명령어 실행 시 비밀번호 대신 토큰 사용

### SSH 키 사용 (고급)
```bash
# SSH 키 생성
ssh-keygen -t ed25519 -C "your_email@example.com"

# 공개 키 복사
cat ~/.ssh/id_ed25519.pub

# GitHub → Settings → SSH and GPG keys에 추가
```

## 📋 5단계: 저장소 설정

### 브랜치 보호 규칙 (선택사항)
1. GitHub 저장소 → Settings → Branches
2. "Add rule" 클릭
3. Branch name pattern: `main`
4. 보호 옵션 설정

### 이슈 템플릿 (선택사항)
```bash
mkdir .github/ISSUE_TEMPLATE
```

### GitHub Pages 설정 (선택사항)
1. Settings → Pages
2. Source: Deploy from a branch
3. Branch: main, Folder: /frontend

## 🏷️ 6단계: 릴리스 생성

```bash
# 태그 생성
git tag -a v1.0.0 -m "🎮 클라우드 용사 게임 v1.0.0 릴리스

주요 기능:
- AWS 서비스 10개 문제
- 터미널 스타일 UI
- 실시간 점수 시스템
- 리더보드
- 모바일 반응형 지원"

# 태그 푸시
git push origin v1.0.0
```

GitHub에서 Releases → Create a new release로 정식 릴리스 생성

## 📝 7단계: 추가 파일 업로드

### 라이선스 파일
```bash
# MIT 라이선스 예시
echo "MIT License

Copyright (c) 2024 [Your Name]

Permission is hereby granted, free of charge, to any person obtaining a copy..." > LICENSE
```

### 기여 가이드
```bash
echo "# 기여 가이드

이 프로젝트에 기여해주셔서 감사합니다!

## 개발 환경 설정
1. 저장소 포크
2. 로컬에 클론
3. 개발 브랜치 생성
4. 변경사항 커밋
5. Pull Request 생성" > CONTRIBUTING.md
```

## 🔄 8단계: 지속적인 업데이트

### 일반적인 Git 워크플로우
```bash
# 변경사항 확인
git status

# 파일 추가
git add .

# 커밋
git commit -m "✨ 새로운 기능 추가: 난이도 선택"

# 푸시
git push origin main
```

### 브랜치 전략
```bash
# 새 기능 개발
git checkout -b feature/difficulty-levels
git commit -m "난이도 선택 기능 구현"
git push origin feature/difficulty-levels

# GitHub에서 Pull Request 생성
```

## 🎯 완료 체크리스트

- [ ] Git 저장소 초기화
- [ ] GitHub 저장소 생성
- [ ] 로컬과 GitHub 연결
- [ ] 첫 번째 푸시 완료
- [ ] README.md 확인
- [ ] 라이선스 파일 추가
- [ ] 릴리스 태그 생성
- [ ] GitHub Pages 설정 (선택)
- [ ] 이슈/PR 템플릿 설정 (선택)

## 🆘 문제 해결

### 일반적인 오류
1. **Permission denied**: SSH 키 또는 토큰 확인
2. **Repository not found**: 저장소 이름 및 권한 확인
3. **Merge conflict**: `git pull` 후 충돌 해결

### 도움말 명령어
```bash
git help
git status
git log --oneline
```

---

🎉 **축하합니다!** 클라우드 용사 게임이 GitHub에 성공적으로 업로드되었습니다!

이제 다른 개발자들과 협업하고, 이슈를 관리하고, 지속적으로 게임을 개선해나갈 수 있습니다.
