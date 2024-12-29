# Use Node.js as the base image
FROM node:alpine as builder

WORKDIR /app

EXPOSE 8000

COPY package*.json ./

# Copy the rest of the application source code
COPY . .

RUN rm package-lock.json

RUN npm --version

# Install dependencies
RUN npm install --verbose

# Build the application using Vite
ENTRYPOINT [ "npm", "start" ]