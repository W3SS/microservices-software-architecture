FROM node:8
ADD . /client
WORKDIR /client
COPY package*.json ./
RUN npm install
COPY . .
CMD [ "npm", "start" ]