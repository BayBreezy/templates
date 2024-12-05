# Use the official Node.js image as the base image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the Prisma schema and generate the Prisma client
COPY prisma ./prisma
RUN npx prisma generate

# Copy the rest of the application code
COPY . .

# Build the Nuxt 3 application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the Nuxt 3 application
CMD ["node", ".output/server/index.mjs"]