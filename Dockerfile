FROM node:current-alpine3.12

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./

COPY yarn.lock ./

RUN yarn install

COPY . ./

ENV API_ROOT=http://127.0.0.1:5000

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start", "--host", "--port", "3000"]
