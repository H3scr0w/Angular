FROM registry.sedona.fr/csn/caf/docker/http:2.4

COPY ./dist/frontend-caf /var/www/csn

COPY docker-init-env-var.sh /docker-entrypoint-init.d/docker-init-env-var.sh

RUN chmod +x /docker-entrypoint-init.d/docker-init-env-var.sh
