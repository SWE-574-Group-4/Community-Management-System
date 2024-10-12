# Use Node.js 18 LTS (Stable version)
FROM node:22

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package.json package-lock.json ./

# Install dependencies using npm
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port that Vite's development server will run on
EXPOSE 5173

# Run the Vite development server
CMD ["npm", "run", "start"]
