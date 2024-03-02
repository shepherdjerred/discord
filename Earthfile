VERSION 0.8

ci:
  BUILD +check
  BUILD +build
  BUILD ./packages/backend+image

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
