FROM node:13.12.0-alpine
WORKDIR /client/src

COPY package.json package-lock.json .
RUN npm install 
RUN npm install react-scripts@4.0.1 -g 
COPY . ./
EXPOSE 3000