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
  FROM ./packages/backend+build
  ENTRYPOINT deno run -A --unstable-ffi src/index.ts
  SAVE IMAGE glitter-boys:latest
  SAVE IMAGE --push ghcr.io/shepherdjerred/glitter-boys:$version
