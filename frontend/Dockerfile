# Use an official Node.js runtime as base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Install Angular CLI globally
RUN npm install -g @angular/cli

# Copy the entire project
COPY . .

# Expose port 4200 for Angular development server
EXPOSE 4200

# Start the Angular application with correct binding
CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "4200"]
