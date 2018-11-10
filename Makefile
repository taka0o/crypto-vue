DC?= docker-compose

default: build start

build:
	$(DC) pull
	$(DC) build

restart: stop start

stop:
	$(DC) kill

start:
	$(DC) up -d nginx

ps:
	$(DC) ps

logs:
	docker-compose logs --follow --tail=100