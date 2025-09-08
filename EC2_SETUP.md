# EC2 배포 가이드

## 1. EC2 인스턴스 생성
- **추천 사이즈**: t3.micro (1 vCPU, 1GB RAM)
- **OS**: Ubuntu 22.04 LTS
- **IPv6**: 활성화
- **보안그룹**: HTTP(80) 포트 열기

## 2. 배포 실행
```bash
# EC2 접속
ssh -i your-key.pem ubuntu@your-ipv6-address

# 배포 스크립트 실행
curl -O https://raw.githubusercontent.com/mjkim856/cloud-hero-game/main/deploy.sh
chmod +x deploy.sh
./deploy.sh
```

## 3. 서비스 관리 명령어
```bash
# 서비스 시작
sudo systemctl start cloud-hero

# 서비스 중지
sudo systemctl stop cloud-hero

# 서비스 재시작
sudo systemctl restart cloud-hero

# 서비스 상태 확인
sudo systemctl status cloud-hero

# 로그 확인
sudo journalctl -u cloud-hero -f
```

## 4. 접속
- http://[your-ipv6-address]
- IPv6 주소는 EC2 콘솔에서 확인

## 비용 예상 (IPv6 + t3.micro)
- **월 약 $8-10** (프리티어 없을 때)
- **프리티어**: 12개월 무료