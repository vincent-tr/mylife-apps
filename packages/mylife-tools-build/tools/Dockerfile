FROM node:alpine

ARG package_name
ARG package_version

WORKDIR /$package_name

RUN echo "package_name = $package_name" \
 && echo "package_version = $package_version" \
 && apk add --no-cache --virtual .build-deps git \
 && git clone https://github.com/vincent-tr/$package_name.git --branch v$package_version --single-branch --depth 1 . \
 && apk del .build-deps \
 && npm install \
 && ./node_modules/.bin/mylife-build-web \
 && rm -rf node_modules \
 && npm install --production

EXPOSE 80
CMD [ "npm", "start" ]
