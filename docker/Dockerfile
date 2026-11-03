# Dev/test image for Código Dinero.
# Base: official Playwright image, pinned to the same version as @playwright/test so
# browsers, system deps and fonts are identical for every visual-regression run.
FROM mcr.microsoft.com/playwright:v1.64.1-noble

ARG PNPM_VERSION=12.16.1
ARG AGENT_BROWSER_VERSION=0.41.1

ENV PNPM_HOME=/home/ubuntu/.local/share/pnpm \
    NPM_CONFIG_PREFIX=/home/ubuntu/.npm-global \
    NEXT_TELEMETRY_DISABLED=1 \
    CI_IMAGE=codigo-dinero-dev
ENV PATH=$PNPM_HOME:$NPM_CONFIG_PREFIX/bin:$PATH

# The base image's uid 1000 ("ubuntu") matches the WSL host user, so files written
# to the bind-mounted repo keep the host owner.
USER ubuntu
WORKDIR /app

# Pre-create the named-volume mount points as ubuntu: Docker copies this ownership into
# a fresh volume; otherwise the volume is root-owned and pnpm can't write its store.
RUN mkdir -p /home/ubuntu/.pnpm-store /home/ubuntu/.cache

RUN npm install -g pnpm@${PNPM_VERSION} agent-browser@${AGENT_BROWSER_VERSION} \
 && pnpm config set store-dir /home/ubuntu/.pnpm-store --global \
 && agent-browser --version

EXPOSE 3000 3001 3002
CMD ["bash"]
