FROM node:22

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package.json package-lock.json ./

# Install dependencies using npm
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the application for production
RUN npm run build

# Expose the port that the application will run on
EXPOSE 5173

# Run the Vite preview server
CMD ["npm", "run", "preview"]