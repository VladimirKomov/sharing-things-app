# Use node:18 as the base image for building the application
FROM node:18 AS build

ARG API_URL

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json/yarn.lock to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files to the working directory
COPY . .

# Set environment variables and run the build script


RUN REACT_APP_API_URL=${API_URL} \
  npm run build

# Use nginx:alpine as the base image for serving the built application
FROM nginx:alpine

# Copy the build output from the previous stage to the Nginx HTML folder
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
#
## Expose port 80 to the outside world
#EXPOSE 80
#
## Start Nginx
#CMD ["nginx", "-g", "daemon off;"]
