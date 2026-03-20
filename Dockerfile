FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG NEXT_PUBLIC_URL_BACKEND
ENV NEXT_PUBLIC_URL_BACKEND=$NEXT_PUBLIC_URL_BACKEND

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
