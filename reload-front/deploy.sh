#!/bin/bash

# 디렉토리 설정
REPOSITORY=/home/ubuntu/Reload_F5/reload-front
BUILD_DIR=$REPOSITORY/build

# 기존 메모리 정리
echo "Clearing cache and freeing memory..."
sudo sync
sudo echo 3 | sudo tee /proc/sys/vm/drop_caches

# 스왑 메모리 설정 (16GB)
echo "Configuring swap memory..."
sudo swapoff -a
sudo dd if=/dev/zero of=/swapfile bs=1G count=16
sudo mkswap /swapfile
sudo swapon /swapfile
sudo chmod 600 /swapfile

# 디렉토리 이동
cd $REPOSITORY || { echo "Directory not found: $REPOSITORY"; exit 1; }

# 빌드 시작 (Node.js 메모리 30GB 설정)
echo "Starting build with increased memory..."
NODE_OPTIONS="--max-old-space-size=30720" npm run build || { echo "Build failed"; exit 1; }

# PM2로 애플리케이션 실행/재시작
if pm2 list | grep -q "F5"; then
  echo "Restarting existing PM2 process..."
  pm2 restart F5
else
  echo "Starting new PM2 process..."
  pm2 start npx --name F5 serve -s $BUILD_DIR -l 3000 --single
fi

# PM2 상태 저장
pm2 save || { echo "PM2 save failed"; exit 1; }

# 스왑 메모리 제거
echo "Removing swap memory..."
sudo swapoff -a
sudo rm /swapfile

echo "Deployment complete!"
