FROM python:3.9-slim

WORKDIR /app

# 필요한 패키지 설치
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 애플리케이션 파일 복사
COPY . .

# 포트 노출
EXPOSE 5001

# 환경 변수 설정
ENV FLASK_APP=app.py
ENV FLASK_ENV=production

# 애플리케이션 실행
CMD ["python", "app.py"]
