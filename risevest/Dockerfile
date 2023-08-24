# Dockerfile
FROM node:18-alpine as common-build-stage

ENV HOST=0.0.0.0
# create destination directory
# RUN mkdir -p /usr/src/nuxt-app
WORKDIR /app

# update and install dependency
RUN apk update && apk upgrade
RUN apk add git

# copy both 'package.json' and 'package-lock.json' (if available)
COPY package.json tsconfig.json ecosystem.config.js swagger.yaml ./
COPY src /app/src

# install curl
RUN apk --no-cache add curl

# install project dependencies
RUN npm install --legacy-peer-deps

FROM common-build-stage as development-build-stage

# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY . .

ENV NODE_ENV development

# # run DB migrations
# RUN npm run migrate

EXPOSE 3030

CMD [ "npm", "run", "dev" ]

FROM common-build-stage as production-build-stage

RUN npm install pm2@latest -g

RUN npm run build

ENV NODE_ENV production

EXPOSE 6000

CMD [ "npm", "start" ]