FROM node:alpine

WORKDIR /usr/src/alligator_client

COPY package.json .

RUN npm install

COPY . .
RUN npm run build