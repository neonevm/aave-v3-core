FROM ethereum/solc:0.6.12 as build-deps

FROM node:16

COPY --from=build-deps /usr/bin/solc /usr/bin/solc

WORKDIR /app

ADD ./ /app/
RUN chmod +x *.sh
RUN npm ci
COPY hardhat-deploy.patch /tmp/
RUN cd ./node_modules/hardhat-deploy/dist/src && patch -p0 < /tmp/hardhat-deploy.patch

