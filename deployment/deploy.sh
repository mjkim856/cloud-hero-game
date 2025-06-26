#!/bin/bash

echo "🚀 클라우드 용사 게임 AWS 배포 시작!"

# 변수 설정
BUCKET_NAME="cloud-hero-game-$(date +%s)"
REGION="us-east-1"

echo "📦 S3 버킷 생성: $BUCKET_NAME"

# S3 버킷 생성
aws s3 mb s3://$BUCKET_NAME --region $REGION

# 정적 웹사이트 호스팅 설정
aws s3 website s3://$BUCKET_NAME --index-document index.html --error-document index.html

# 퍼블릭 액세스 정책 설정
cat > bucket-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::$BUCKET_NAME/*"
        }
    ]
}
EOF

aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy file://bucket-policy.json

# 프론트엔드 파일 업로드
echo "📤 프론트엔드 파일 업로드"
aws s3 sync frontend/ s3://$BUCKET_NAME --delete

# 웹사이트 URL 출력
echo "✅ 배포 완료!"
echo "🌐 웹사이트 URL: http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com"

# 정리
rm bucket-policy.json

echo "🎉 클라우드 용사 게임이 성공적으로 배포되었습니다!"
