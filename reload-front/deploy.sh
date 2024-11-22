#!/bin/bash

# 로그 파일 설정
LOG_FILE=/home/ubuntu/deploy/deploy.log
exec > >(tee -i $LOG_FILE)
exec 2>&1

# 디렉토리 설정
REPOSITORY=/home/ubuntu/Reload_F5/reload-front
BUILD_DIR=$REPOSITORY/build

echo "Starting deployment..."

# 디렉토리 이동
echo "Navigating to repository..."
cd $REPOSITORY || { echo "Directory not found: $REPOSITORY"; exit 1; }

# 최신 코드 가져오기
echo "Pulling latest code from develop branch..."
git pull origin develop || {
    echo "Pull failed. Attempting to resolve conflicts with merge --no-ff..."
    git merge --no-ff || { echo "Merge failed."; exit 1; }
    echo "Merge conflicts resolved using merge --no-ff."
}

# 의존성 설치
echo "Installing dependencies..."
npm install || { echo "Dependency installation failed"; exit 1; }

# 빌드 시작
echo "Building application..."
npm run build || { echo "Build failed"; exit 1; }

# PM2 프로세스 재시작
echo "Restarting PM2 process..."
pm2 restart F5 || { echo "PM2 restart failed"; exit 1; }

echo "Deployment complete!"
