FROM harbor.digital-solutions.saint-gobain.com/devops4sg/nginx:latest

## Copy our default nginx config
COPY ./.docker/default.conf /etc/nginx/conf.d/

## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

## From 'builder' stage copy over the artifacts in dist folder to default nginx public folder
COPY ./dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
