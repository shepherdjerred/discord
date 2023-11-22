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

lint:
  FROM +prepare
  RUN npm run lint --workspace packages/backend
  RUN npm run lint --workspace packages/lint
  RUN npm run lint --workspace packages/data

litefs:
  FROM flyio/litefs:0.5
  SAVE ARTIFACT /usr/local/bin/litefs

build.backend:
  FROM +build.data
  RUN npm run build --workspace packages/backend
  SAVE ARTIFACT packages/backend/dist AS LOCAL packages/backend/dist

build.frontend:
  FROM +prepare
  RUN npm run build --workspace packages/frontend

build.data:
  FROM +prepare
  RUN npm run build --workspace packages/data
  SAVE ARTIFACT packages/data/dist AS LOCAL packages/data/dist

image.backend:
  FROM +build.backend
  WORKDIR /workspace/packages/backend
  # or for debian/ubuntu-based images
  RUN apt-get update -y && apt-get install -y ca-certificates fuse3 sqlite3
  COPY +litefs/litefs /usr/local/bin/litefs
  COPY litefs.yaml /etc/litefs.yml
  ENTRYPOINT litefs mount
  SAVE IMAGE glitter/backend:latest

deploy.backend:
  ARG --required stage
  FROM earthly/dind:ubuntu
  RUN curl -L https://fly.io/install.sh | sh
  ENV PATH=$PATH:/root/.fly/bin
  COPY fly.$stage.toml .
  COPY players.$stage.json players.json
  WITH DOCKER --load=(+image.backend )
    RUN --no-cache --secret FLY_API_TOKEN fly deploy --local-only --config fly.$stage.toml
  END
