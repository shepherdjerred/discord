VERSION 0.7

deno:
  FROM denoland/deno
  CACHE $DENO_DIR
  WORKDIR /workspace

build:
  RUN ./packages/backend+build
  RUN ./packages/frontend+build

test:
  RUN ./packages/backend+test
  RUN ./packages/frontend+test

deploy:
  ARG --required stage
  RUN ./packages/backend+deploy --stage $stage
  RUN ./packages/frontend+deploy --stage $stage
