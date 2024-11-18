#!/bin/bash

REPOSITORY=/home/ubuntu/deploy
BUILD_DIR=/home/ubuntu/deploy/build

# 이동
cd $REPOSITORY

# 의존성 설치
npm ci --only=production

# PM2로 애플리케이션 실행/재시작
if pm2 list | grep -q "F5"; then
  pm2 reload F5
else
  pm2 start npx --name F5 serve -s $BUILD_DIR -l 3000
fi

# PM2 상태 저장
pm2 save
