FROM node:12.16.3

WORKDIR /code

COPY . /code

RUN npm i -f && npm i -f node-sass

EXPOSE 8082

CMD ["npm","run","dockerdev"]
