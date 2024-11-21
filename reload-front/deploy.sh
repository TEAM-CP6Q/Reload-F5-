#!/bin/bash

# 디렉토리 설정
REPOSITORY=/home/ubuntu/Reload_F5/reload-front
BUILD_DIR=$REPOSITORY/build

# 디렉토리 이동
cd $REPOSITORY || { echo "Directory not found: $REPOSITORY"; exit 1; }

# 최신 코드 가져오기
echo "Pulling latest code from develop branch..."
git pull origin develop || { echo "Git pull failed"; exit 1; }

# 빌드 시작
echo "Starting build..."
npm run build || { echo "Build failed"; exit 1; }

# PM2로 애플리케이션 재시작
echo "Restarting PM2 process..."
pm2 restart F5 || { echo "PM2 restart failed"; exit 1; }

echo "Deployment complete!"
