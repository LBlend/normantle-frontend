FROM node:26-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . ./

ARG API_ROOT
RUN npm run build

FROM node:26-alpine

WORKDIR /app

ENV NODE_ENV=production

RUN apk add --no-cache tini

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /app/dist ./dist
COPY docker-entrypoint.sh ./
RUN chown node:node dist/config.js

USER node

EXPOSE 3000

ENTRYPOINT ["/sbin/tini", "--", "./docker-entrypoint.sh"]
CMD ["node_modules/.bin/sirv", "dist", "--host", "0.0.0.0", "--port", "3000"]
