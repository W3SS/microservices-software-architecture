FROM node:8
ADD . /frontend
WORKDIR /frontend
COPY package*.json ./
RUN npm install
COPY . .
CMD [ "npm", "start" ]