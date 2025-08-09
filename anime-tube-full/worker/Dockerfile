FROM node:20-alpine
WORKDIR /worker
COPY package*.json ./
RUN npm ci --production
COPY . .
CMD ["node","src/transcodeWorker.js"]
