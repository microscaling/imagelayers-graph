FROM nginx:1.10-alpine

MAINTAINER Ross Fairbanks <ross@microscaling.com>

RUN apk update && \
    apk upgrade && \
    rm -rf /var/cache/apk/*

EXPOSE 9000
EXPOSE 8080

# Metadata params
ARG BUILD_DATE
ARG VERSION
ARG VCS_REF

# Metadata
LABEL org.label-schema.url="https://imagelayers.io" \
      org.label-schema.build-date=$BUILD_DATE \
      org.label-schema.version=$VERSION \
      org.label-schema.vcs-url="https://github.com/microscaling/imagelayers-graph.git" \
      org.label-schema.vcs-ref=$VCS_REF \
      org.label-schema.docker.dockerfile="/Dockerfile" \
      org.label-schema.description="This utility provides a browser-based visualization of user-specified Docker Images and their layers." \
      org.label-schema.schema-version="1.0"

ADD nginx.conf /etc/nginx/nginx.conf
ADD /dist /data/dist
ADD Dockerfile /
