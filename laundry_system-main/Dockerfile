# Use Node.js LTS (Alpine for smaller image size)
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend source code
COPY . .

# Expose Vite's default port
EXPOSE 5173

# Start the Vite development server and expose it to the network so the host can access it
CMD ["npm", "run", "dev", "--", "--host"]
