FROM node:20.17

WORKDIR /usr/src/app

ENV PORT 8080

COPY package.json ./

RUN npm ci

COPY . .

RUN npm run build

CMD npm start

#c244d7c2ee52