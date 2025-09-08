#!/bin/bash

echo "🚀 Cloud Hero Game EC2 배포 시작"

# 시스템 업데이트
sudo apt update
sudo apt install -y python3 python3-pip git

# 프로젝트 클론 (이미 있으면 업데이트)
if [ -d "cloud-hero-game" ]; then
    cd cloud-hero-game
    git pull
else
    git clone https://github.com/mjkim856/cloud-hero-game.git
    cd cloud-hero-game
fi

# Python 의존성 설치
pip3 install -r requirements.txt

# systemd 서비스 파일 복사
sudo cp cloud-hero.service /etc/systemd/system/

# 서비스 등록 및 시작
sudo systemctl daemon-reload
sudo systemctl enable cloud-hero
sudo systemctl start cloud-hero

# 상태 확인
sudo systemctl status cloud-hero

echo "✅ 배포 완료!"
echo "🌐 접속: http://your-ec2-ipv6-address"
echo "📊 상태 확인: sudo systemctl status cloud-hero"
echo "📝 로그 확인: sudo journalctl -u cloud-hero -f"