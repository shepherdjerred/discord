VERSION 0.8

ci:
  ARG EARTHLY_GIT_HASH
  ARG version=$EARTHLY_GIT_HASH
  BUILD +check
  BUILD +build
  BUILD ./packages/backend+image --version=$version

build:
  BUILD ./packages/frontend+build

check:
  BUILD ./packages/backend+check
  BUILD ./packages/data+check

deno:
  FROM denoland/deno
  WORKDIR /workspace

prepare:
  FROM +deps
  COPY packages packages
