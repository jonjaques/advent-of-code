FROM mcr.microsoft.com/devcontainers/base:ubuntu-22.04

ENV NVM_DIR=/usr/local/share/nvm
ENV PROFILE=/etc/profile.d/nvm.sh
ENV NODE_EXTRA_CA_CERTS=/etc/ssl/certs/ca-certificates.crt

ARG CMAKE_VERSION=3.31.10
ARG TARGETARCH

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

RUN apt-get update \
	&& DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
	build-essential \
	ca-certificates \
	curl \
	git \
	libncursesw5-dev \
	libreadline-dev \
	python-is-python3 \
	python3 \
	python3-pip \
	wget \
	&& update-ca-certificates \
	&& rm -rf /var/lib/apt/lists/*


# Install CMake using the upstream binary installer https://cmake.org/download/
RUN TARGET_ARCH=${TARGETARCH:-amd64} \
	&& if [ "${TARGET_ARCH}" = "arm64" ]; then CMAKE_PLATFORM=linux-aarch64; else CMAKE_PLATFORM=linux-x86_64; fi \
	&& CMAKE_INSTALLER="cmake-${CMAKE_VERSION}-${CMAKE_PLATFORM}.sh" \
	&& wget -q "https://github.com/Kitware/CMake/releases/download/v${CMAKE_VERSION}/${CMAKE_INSTALLER}" -O "/tmp/${CMAKE_INSTALLER}" \
	&& chmod +x "/tmp/${CMAKE_INSTALLER}" \
	&& "/tmp/${CMAKE_INSTALLER}" --skip-license --prefix=/usr/local \
	&& rm -f "/tmp/${CMAKE_INSTALLER}"

COPY .nvmrc /tmp/.nvmrc

RUN mkdir -p "${NVM_DIR}" /etc/profile.d \
	&& curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash \
	&& NODE_VERSION=$(cat /tmp/.nvmrc | tr -d '\r') \
	&& source "${NVM_DIR}/nvm.sh" \
	&& nvm install "${NODE_VERSION}" \
	&& nvm use "${NODE_VERSION}" \
	&& nvm alias default "${NODE_VERSION}" \
	&& npm install -g corepack \
	&& ln -sf "${NVM_DIR}/versions/node/${NODE_VERSION}/bin/node" /usr/local/bin/node \
	&& ln -sf "${NVM_DIR}/versions/node/${NODE_VERSION}/bin/npm" /usr/local/bin/npm \
	&& ln -sf "${NVM_DIR}/versions/node/${NODE_VERSION}/bin/npx" /usr/local/bin/npx \
	&& ln -sf "${NVM_DIR}/versions/node/${NODE_VERSION}/bin/corepack" /usr/local/bin/corepack \
	&& corepack enable \
	&& rm -rf /tmp/.nvmrc

RUN if id vscode >/dev/null 2>&1; then chown -R vscode:root "${NVM_DIR}"; fi

RUN git clone --branch future https://github.com/justinmeza/lci.git /tmp/lci \
	&& cd /tmp/lci \
	&& chmod +x ./install.py \
	&& ./install.py --prefix /usr/local \
	&& rm -rf /tmp/lci
