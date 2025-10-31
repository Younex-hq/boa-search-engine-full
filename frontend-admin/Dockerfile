# Stage 1: Build the application
FROM node:20 as build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .
ARG VITE_API_BASE_URL
ARG VITE_API_BASE_LOGIN_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_API_BASE_LOGIN_URL=${VITE_API_BASE_LOGIN_URL}

RUN npm run build

# Stage 2: Serve the application
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

# Add SPA-friendly Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
