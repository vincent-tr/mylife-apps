FROM node:alpine

ARG package_name
ARG package_version

ENV NODE_ENV production

WORKDIR /usr/app

RUN echo "package_name = $package_name" \
 && echo "package_version = $package_version" \
 && npm install $package_name@$package_version --loglevel=error --no-audit --cache /tmp/temp-npm-cache \
 && rm -rf /tmp/temp-npm-cache

WORKDIR /usr/app/node_modules/$package_name

EXPOSE 80
CMD [ "./bin/server.js" ]
