FROM node:20-alpine

WORKDIR /app

# dependencies
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

EXPOSE 3000
ENV HOST=0.0.0.0

CMD ["npm", "start"]
