VERSION 0.7

node:
  FROM node:lts
  RUN npm install -g npm@latest
  WORKDIR /workspace

deps:
  FROM +node
  COPY package*.json .
  COPY packages/backend/package*.json packages/backend/
  COPY packages/frontend/package*.json packages/frontend/
  COPY packages/data/package*.json packages/data/
  RUN npm ci --workspaces

prepare:
  FROM +deps
  COPY packages packages
  COPY tsconfig.json .

build.backend:
  FROM +prepare
  RUN npm run build --workspace packages/backend
  SAVE ARTIFACT packages/backend/dist AS LOCAL packages/backend/dist

build.frontend:
  FROM +prepare
  RUN npm run build --workspace packages/frontend
  SAVE ARTIFACT packages/frontend/.svelte-kit/output AS LOCAL packages/frontend/.svelte-kit/output

build.data:
  FROM +prepare
  RUN npm run build --workspace packages/data
  SAVE ARTIFACT packages/data/dist AS LOCAL packages/data/dist

image.backend:
  FROM +build.backend
  ENTRYPOINT node packages/backend/dist/index.js
  SAVE IMAGE glitter/backend

deploy.backend:
  LOCALLY
  ARG --required stage
  WITH DOCKER --load=+image.backend
    RUN flyctl deploy --local-only -f fly.$stage.yml
  END
