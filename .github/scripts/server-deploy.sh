#! /usr/bin/env sh

# abort on errors
set -e

# 1. generate docker compose yaml
echo "docker compose template yaml: $1"
echo "build tag: $2"
cat $1 | sed "s/{{ NGINX_TAG }}/$2/g" | sed "s/{{ SERVER_TAG }}/$2/g" > docker-compose.yaml
cat docker-compose.yaml

# 2. upload yaml to server
scp docker-compose.yaml root@$3:/home

# 3. refresh docker compose
ssh root@$3 <<'HERE'
cd /home
docker compose up -d --no-deps
docker image prune -fa
HERE

# 4. clean up
rm -rf docker-compose.yaml