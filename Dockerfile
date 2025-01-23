# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build the React application
RUN npm run build

# Serve the build using a simple HTTP server
RUN npm install -g serve

# Use the build output as the default directory for serve
CMD ["serve", "-s", "build"]

# Expose the port the app runs on
EXPOSE 3000
