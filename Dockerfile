FROM node:current-alpine3.12

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./

COPY package-lock.json ./

RUN npm ci

COPY . ./

RUN npm run build

EXPOSE 3000

CMD ["npm", "start", "--", "--host", "--port", "3000"]
