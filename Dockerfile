FROM node:18-slim as base
    ENV APPDIR /usr/dev

    WORKDIR $APPDIR

    COPY . .

    RUN apt-get update && \
        apt-get upgrade -y && \
        apt-get install -y build-essential curl make python3 git openssl && \
        apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

FROM base as development
    ENV SERVER_PORT 80
    EXPOSE ${SERVER_PORT}
    ENV NODE_ENV development

    ENTRYPOINT ["./Dockerfile_entrypoint.sh"]

FROM base as production
    ENV SERVER_PORT 8080
    EXPOSE ${SERVER_PORT}
    ENV NODE_ENV production

    ENV TINI_VERSION v0.18.0
    ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /sbin/tini
    RUN chmod +x /sbin/tini

    ENTRYPOINT ["/sbin/tini", "--"]

    RUN addgroup --gid 1001 --system dev && \
        adduser --uid 1001 --system --gid 1001 dev && \
        chown -R dev:dev $APPDIR

    COPY --chown=dev:dev . $APPDIR

    RUN yarn install

    USER dev

    CMD ${CMD}