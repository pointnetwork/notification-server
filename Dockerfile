FROM node:16.14.2-stretch-slim

WORKDIR /app
COPY . /app
RUN npm i && npm run build

ENTRYPOINT [ "npm" ]
CMD [ "start" ]
