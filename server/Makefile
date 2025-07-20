build/api:
	docker build --platform=linux/amd64 -t koalayt/amen-schedule-api .
	docker save koalayt/amen-schedule-api > koalayt-amen-schedule-api.tar
	gzip koalayt-amen-schedule-api.tar
	scp koalayt-amen-schedule-api.tar.gz amen-alivps:/home
	rm -f koalayt-amen-schedule-api.tar koalayt-amen-schedule-api.tar.gz
	docker image prune -f

build/nginx:
	docker build --platform=linux/amd64 -t koalayt/amen-schedule-nginx nginx
	docker save koalayt/amen-schedule-nginx > koalayt-amen-schedule-nginx.tar
	gzip koalayt-amen-schedule-nginx.tar
	scp koalayt-amen-schedule-nginx.tar.gz amen-alivps:/home
	rm -f koalayt-amen-schedule-nginx.tar koalayt-amen-schedule-nginx.tar.gz
	docker image prune -f

