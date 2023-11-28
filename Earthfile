VERSION 0.7

deno:
  FROM denoland/deno:lts
  WORKDIR /workspace

build.backend:
  FROM +deno
  COPY packages/backend/deno.json packages/backend/deno.lock packages/backend/
  RUN deno cache
  COPY packages/backend packages/backend
  COPY packages/data packages/data
  WORKDIR packages/backend
  RUN deno cache src/index.ts

build.frontend:
  FROM +deno
  COPY packages/backend/deno.json packages/backend/deno.lock packages/backend/
  RUN deno cache
  COPY packages/backend packages/backend
  COPY packages/data packages/data
  # TODO: build with Astro

litefs:
  FROM flyio/litefs:0.5
  SAVE ARTIFACT /usr/local/bin/litefs

image.backend:
  ARG --required stage
  FROM +build.backend
  # or for debian/ubuntu-based images
  RUN apt-get update -y && apt-get install -y ca-certificates fuse3 sqlite3
  COPY +litefs/litefs /usr/local/bin/litefs
  COPY litefs.yaml /etc/litefs.yml
  # TODO: check this
  RUN deno install npm:@resvg/resvg-js-linux-x64-gnu
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
