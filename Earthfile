VERSION 0.8

ci:
  BUILD +lint
  BUILD +image
  BUILD +build.frontend

node:
  FROM node:lts
  DO +SETUP_NPM_CACHE
  RUN npm i -g npm@latest
  WORKDIR /workspace

deps:
  FROM +node
  COPY package*.json .
  COPY packages/backend/package*.json packages/backend/
  COPY packages/frontend/package*.json packages/frontend/
  COPY packages/data/package*.json packages/data/

  DO +SETUP_NPM_CACHE
  RUN npm ci --workspaces

prepare:
  FROM +deps
  COPY packages packages

lint:
  FROM +build.data
  COPY .eslint* .prettier* .
  RUN npm run lint --workspaces

build.backend:
  FROM +build.data
  RUN npm run build --workspace packages/backend
  SAVE ARTIFACT packages/backend/dist AS LOCAL packages/backend/dist

build.frontend:
  FROM +build.data
  RUN npm run build --workspace packages/frontend

build.data:
  FROM +prepare
  RUN npm run build --workspace packages/data
  SAVE ARTIFACT packages/data/dist AS LOCAL packages/data/dist

image:
  ARG version=latest
  ARG TARGETARCH
  FROM +build.backend
  WORKDIR /workspace/packages/backend
  ENTRYPOINT node dist/index.js
  SAVE IMAGE glitter/backend:latest
  SAVE IMAGE --push ghcr.io/shepherdjerred/glitter-boys:$version

SETUP_NPM_CACHE:
  FUNCTION
  CACHE --sharing=shared --id=npm ~/.npm/_cacache/
