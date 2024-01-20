VERSION 0.7

ci:
  BUILD +lint
  BUILD +image.backend --stage=beta
  BUILD +build.frontend

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
  RUN npm i --workspaces

prepare:
  FROM +deps
  COPY packages packages

lint:
  FROM +prepare
  COPY .eslint* .prettier* .
  RUN npm run lint --workspaces

litefs:
  FROM flyio/litefs:0.5
  SAVE ARTIFACT /usr/local/bin/litefs

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

image.backend:
  ARG TARGETARCH
  ARG --required stage
  FROM +build.backend
  WORKDIR /workspace/packages/backend
  RUN apt-get update -y && apt-get install -y ca-certificates fuse3 sqlite3
  COPY +litefs/litefs /usr/local/bin/litefs
  COPY litefs.yaml /etc/litefs.yml
  # this library doesn't seem to be installed by the package.json for some reason
  IF [ $TARGETARCH = "amd64" ]
    RUN npm i @resvg/resvg-js-linux-x64-gnu
  ELSE
    RUN npm i @resvg/resvg-js-linux-$TARGETARCH-gnu
  END
  COPY packages/backend/players.$stage.json players.json
  ENTRYPOINT litefs mount
  SAVE IMAGE glitter/backend:latest

deploy.backend:
  ARG --required stage
  FROM earthly/dind:ubuntu
  RUN curl -L https://fly.io/install.sh | sh
  ENV PATH=$PATH:/root/.fly/bin
  COPY fly.$stage.toml .
  WITH DOCKER --load=(+image.backend --stage=$stage)
    RUN --no-cache --secret FLY_API_TOKEN fly deploy --local-only --config fly.$stage.toml
  END
