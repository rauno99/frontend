FROM node:16.17.0
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
COPY ./ ./
RUN npm install --force
CMD ["npm", "start"]
