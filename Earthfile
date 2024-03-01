VERSION 0.8

ci:
  BUILD +check
  BUILD +build
  BUILD +image

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

image:
  ARG version=latest
  FROM +build.backend
  WORKDIR /workspace/packages/backend
  ENTRYPOINT node dist/index.js
  SAVE IMAGE glitter/backend:latest
  SAVE IMAGE --push ghcr.io/shepherdjerred/glitter-boys:$version
