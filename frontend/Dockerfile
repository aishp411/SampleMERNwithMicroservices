FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Use build args to pass environment variables dynamically
ARG REACT_APP_HELLO_API
ARG REACT_APP_PROFILE_API
ENV REACT_APP_HELLO_API=$REACT_APP_HELLO_API
ENV REACT_APP_PROFILE_API=$REACT_APP_PROFILE_API

RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
