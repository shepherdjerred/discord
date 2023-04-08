VERSION 0.7

node:
  FROM node:lts
  RUN npm install -g npm@9.6.4
  WORKDIR /workspace

deps:
  FROM +node
  COPY package*.json .
  RUN npm install

build:
  FROM +deps
  COPY packages packages
  COPY tsconfig.json .
  RUN npm run build --workspace=data --workspace=backend --workspace=frontend
