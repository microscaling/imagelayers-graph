FROM nginx:1.8.1

MAINTAINER Nathan Franzen <nathan.franzen@ctl.io>
EXPOSE 9000

ADD nginx.conf /etc/nginx/nginx.conf
ADD /dist /data/dist
