FROM node:16.16
WORKDIR ./app
COPY . .
EXPOSE 3000
RUN npm install
CMD ["npm", "run", "dev"]


