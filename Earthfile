VERSION 0.7

ci:
  BUILD +check
  BUILD +build

build:
  BUILD ./packages/frontend+build

check:
  BUILD ./packages/backend+check
  BUILD ./packages/data+check
  BUILD ./packages/frontend+check

deploy:
  ARG --required stage
  BUILD ./packages/backend+deploy --stage $stage
  BUILD ./packages/frontend+deploy --stage $stage

deno:
  FROM denoland/deno
  CACHE $DENO_DIR
  WORKDIR /workspace
