FROM node:16.16
WORKDIR ./app
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]


