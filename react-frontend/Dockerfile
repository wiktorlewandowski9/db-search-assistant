# Build stage
FROM node:18 as build
WORKDIR /usr/src/app
COPY package*.json ./
ARG REACT_APP_SPRING_URL
ENV REACT_APP_SPRING_URL=$REACT_APP_SPRING_URL
RUN npm install
COPY . .
RUN npm run build

# Serve stage
FROM nginx:alpine
COPY --from=build /usr/src/app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]