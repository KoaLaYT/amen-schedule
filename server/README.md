# Rest api for amen schedule

## Develop

To run in develop mode:

```bash
docker compose -f docker-compose.dev.yaml up --build
```

And then need to sync the database

```bash
# login into dev server
docker exec -it amen-schedule-server-1 sh

# run prisma migrate
npx prisma migrate reset
```

## Deploy

run Makefile, then login into server do deploy

## Let's encrypt with docker

This [tutorial](https://www.programonaut.com/setup-ssl-with-docker-nginx-and-lets-encrypt/) walk through a full configuration.

[MDN](https://ssl-config.mozilla.org/#server=nginx&version=1.17.7&config=modern&openssl=1.1.1k&ocsp=false&guideline=5.6) has a generator for ssl configs.

```bash
docker run -it --rm --name certbot \
    -v "/home/certbot/conf:/etc/letsencrypt" \
    -v "/home/certbot/www:/var/www/certbot" \
    certbot/certbot certonly --webroot -w /var/www/certbot --force-renewal --email hytohjen@gmail.com -d api.upnqhl.top --agree-tos
```
