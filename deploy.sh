#!/usr/bin/env bash

set -e
set -x

if [ ! -f ./.env ]; then
    echo ".env File not found!\n Please create one with:\nCORS_PROXY_URL\nJENKINS_URL\nSONARQUBE_URL"
    exit 1
fi

docker-compose stop
docker-compose rm -v -f

for image_id in $(docker images uob-dashboard:latest -q)
  do
    docker rmi uob-dashboard:latest -f
  done

npm run build
docker-compose up