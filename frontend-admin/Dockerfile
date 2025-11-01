# 1️⃣ Build stage
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all project files
COPY . .

# Build the app for production
RUN npm run build


# 2️⃣ Serve stage
FROM node:20-alpine

# Install a small static file server
RUN npm install -g serve

# Set working directory
WORKDIR /app

# Copy the built files from previous stage
COPY --from=build /app/dist ./dist

# Expose the port that 'serve' uses
EXPOSE 9080

# Command to run the web server
CMD ["serve", "-s", "dist", "-l", "9080"]
