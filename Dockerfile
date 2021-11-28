FROM node:14

WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./usr/src/app

RUN npm install

# Bundle app source
COPY . .

EXPOSE 3000
CMD [ "npm", "run", "start" ]