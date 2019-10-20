FROM node:alpine

ARG package_version

WORKDIR /mylife-explorer

RUN echo "package_name = mylife-explorer" \
 && echo "package_version = $package_version" \
 && apk add --no-cache --virtual .build-deps git \
 && git clone https://github.com/vincent-tr/mylife-explorer.git --branch v$package_version --single-branch --depth 1 . \
 && npm install \
 && apk del .build-deps \
 && npm run bundle \
 && rm -rf node_modules \
 && npm install --production

EXPOSE 80
CMD [ "npm", "start" ]
