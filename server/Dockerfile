FROM node:16.17.0

RUN mkdir -p /home/node/app && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY --chown=node:node package*.json ./

USER node

RUN npm install

# .dockerignore exclude most files
# so only src / config will be included
COPY --chown=node:node . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]