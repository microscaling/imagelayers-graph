FROM centurylink/nginx:1.6.2

MAINTAINER CenturyLink Labs <ctl-labs-futuretech@centurylink.com>
EXPOSE 9000

ADD nginx.conf /etc/nginx/nginx.conf
ADD /dist /data/dist
