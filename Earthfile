VERSION 0.8

ci:
  ARG EARTHLY_GIT_SHORT_HASH
  ARG git_sha=$EARTHLY_GIT_SHORT_HASH
  ARG --required version
  BUILD +check
  BUILD +build
  BUILD ./packages/backend+image --version=$version --git_sha=$git_sha

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
