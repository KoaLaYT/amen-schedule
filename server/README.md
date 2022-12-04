# Rest api for amen schedule

## Develop

To run in develop mode:

```bash
docker compose -f docker-compose.dev.yaml up
```

## Build

```bash
# build image
docker build -t koalayt/amen-schedule-api:latest -t koalayt/amen-schedule-api:1.0.0 .
# push to docker hub
docker push koalayt/amen-schedule-api:latest
```

## Push to remote server

```bash
scp -r docker-compose.yaml root@amen-alivps:/home
ssh amen-alivps
cd /home
docker compose up -d
```