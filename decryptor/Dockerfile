FROM mhart/alpine-node:6

WORKDIR /app
COPY /src /app/src
COPY /package.json /app

RUN npm install

CMD ["node", "src/index.js"]
