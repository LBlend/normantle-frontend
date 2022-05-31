FROM node:current-alpine3.12

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./

COPY yarn.lock ./

RUN yarn install

COPY . ./

ENV PORT=3000 VITE_API_URL=http://localhost:5000/mann-eller-kvinne

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start", "--host", "--port", "3000"]
