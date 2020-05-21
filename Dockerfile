FROM node:12.16.3

WORKDIR /code

COPY . /code

RUN npm install && npm install node-sass

EXPOSE 8082

CMD ["npm","run","dockerdev"]
