FROM node:12.16.3

WORKDIR /code

COPY . /code

RUN npm install -f node-sass && npm i -f
EXPOSE 8082

CMD ["npm","run","dockerdev"]
