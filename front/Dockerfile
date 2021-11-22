
FROM node:10

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g @angular/cli@11.2.4 @angular-devkit/build-angular && npm install

EXPOSE 4200

CMD ["npm", "start"]
