FROM mcr.microsoft.com/devcontainers/base:jammy

RUN apt update -y && \
  apt upgrade -y && \
  apt install -y \
    build-essential \
    software-properties-common \
    neovim \
    zip \
    unzip \
    curl \
    wget

RUN /bin/sh -c 'wget https://github.com/earthly/earthly/releases/latest/download/earthly-linux-amd64 -O /usr/local/bin/earthly && chmod +x /usr/local/bin/earthly && /usr/local/bin/earthly bootstrap --with-autocomplete'
