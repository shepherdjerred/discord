VERSION 0.7

deno:
  FROM denoland/deno
  CACHE $DENO_DIR
  WORKDIR /workspace

prep.backend:
  FROM +deno
  COPY --dir packages/backend packages/data packages
  WORKDIR packages/backend
  RUN deno cache src/index.ts

test.backend:
  FROM +prep.backend
  RUN deno check src/index.ts
  RUN deno lint
  RUN deno test -A --unstable

litefs:
  FROM flyio/litefs:0.5
  SAVE ARTIFACT /usr/local/bin/litefs

image.backend:
  ARG --required stage
  FROM +prep.backend
  # install litefs dependencies
  # these are used by fly.io for replicating our sqlite database
  RUN apt-get update -y && apt-get install -y ca-certificates fuse3 sqlite3
  COPY +litefs/litefs /usr/local/bin/litefs
  COPY litefs.yaml /etc/litefs.yml
  # TODO: check this
  # RUN deno install npm:@resvg/resvg-js-linux-x64-gnu
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
