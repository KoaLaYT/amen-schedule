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
docker build -t koalayt/amen-schedule-nginx:latest -t koalayt/amen-schedule-nginx:1.0.0 ./nginx
# push to docker hub
docker push -a koalayt/amen-schedule-api
docker push -a koalayt/amen-schedule-nginx
```

## Push to remote server

```bash
scp -r docker-compose.yaml root@amen-alivps:/home
ssh amen-alivps
cd /home
docker compose up -d
```

## Let's encrypt with docker

This [tutorial](https://www.programonaut.com/setup-ssl-with-docker-nginx-and-lets-encrypt/) walk through a full configuration.

[MDN](https://ssl-config.mozilla.org/#server=nginx&version=1.17.7&config=modern&openssl=1.1.1k&ocsp=false&guideline=5.6) has a generator for ssl configs.

```bash
docker run -it --rm --name certbot \
    -v "/home/certbot/conf:/etc/letsencrypt" \
    -v "/home/certbot/www:/var/www/certbot" \
    certbot/certbot certonly --webroot -w /var/www/certbot --force-renewal --email hytohjen@gmail.com -d api.upnqhl.top --agree-tos
```
