FROM progrium/busybox

MAINTAINER CenturyLink Labs

RUN opkg-install nginx bash

RUN mkdir /var/lib/nginx
ADD nginx.conf /etc/nginx/nginx.conf

EXPOSE 80 443 9000

ADD /dist /data/dist

CMD ["/usr/sbin/nginx"]