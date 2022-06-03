FROM dtr.central.docker4sg.saint-gobain.net/dipl-generic/nginx:1.19

WORKDIR /app

## Copy our default nginx config
COPY ./.docker/default.conf /etc/nginx/conf.d/

RUN curl -k -u jenkins:nexus_pwd --output app.tgz nexus_url

RUN tar -xzvf app.tgz

## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

## From 'builder' stage copy over the artifacts in dist folder to default nginx public folder
RUN mv package/* /usr/share/nginx/html

RUN rm app.tgz

ENTRYPOINT []

CMD ["nginx", "-g", "daemon off;"]
