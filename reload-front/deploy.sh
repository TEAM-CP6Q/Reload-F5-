#!/bin/bash

# 디렉토리 설정
REPOSITORY=/home/ubuntu/Reload_F5/reload-front
BUILD_DIR=$REPOSITORY/build

# 애플리케이션 디렉토리로 이동
cd $REPOSITORY || { echo "디렉토리를 찾을 수 없습니다: $REPOSITORY"; exit 1; }

# 의존성 설치
npm ci --only=production || { echo "의존성 설치 실패"; exit 1; }

# 기존 빌드 파일 삭제 (필요한 경우)
rm -rf $BUILD_DIR || { echo "기존 빌드 파일 삭제 실패"; exit 1; }

# 새 코드로 빌드
npm run build || { echo "빌드 실패"; exit 1; }

# PM2로 애플리케이션 실행/재시작
if pm2 list | grep -q "F5"; then
  echo "기존 PM2 프로세스 재시작 중..."
  pm2 restart F5
else
  echo "새로운 PM2 프로세스 시작 중..."
  pm2 start npx --name F5 serve -s $BUILD_DIR -l 3000 --single
fi

# PM2 상태 저장
pm2 save || { echo "PM2 상태 저장 실패"; exit 1; }

echo "배포 완료"
