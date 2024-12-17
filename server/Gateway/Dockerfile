FROM node:lts-alpine
WORKDIR /app
COPY . .
RUN npm install
CMD ["node", "gateway.js"]
EXPOSE 3000