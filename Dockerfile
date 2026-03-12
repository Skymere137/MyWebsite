# Establish node
FROM node:20

# Set wprking directory
WORKDIR /app

# Copy package.json first (for caching)
COPY package*.json ./

# Install dependancies
RUN npm install

# Copy the rest of your project
COPY . .

# Expose the port your app runs on 
EXPOSE 8000

# Command to run app.json
CMD ["node", "app.js"]