FROM node:alpine

ENV NODE_ENV production
WORKDIR /app

COPY conf/config.json /app/
COPY dist/prod/ /app/

EXPOSE 80
CMD [ "node", "server.js" ]