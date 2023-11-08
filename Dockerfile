FROM node:16.10

WORKDIR /usr/src/app

ENV PORT 3000

COPY package.json ./

RUN npm i

COPY . .

RUN npm run build

CMD npm start

#c244d7c2ee52