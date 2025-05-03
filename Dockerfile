FROM node:18-alpine as build

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code
COPY . .

# Build for production
RUN npm run build

# Production stage
FROM node:18-alpine as production

WORKDIR /app

# Copy build artifacts from build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./
COPY --from=build /app/package-lock.json ./

# Install only production dependencies
RUN npm ci --production

# Serve static files
RUN npm install -g serve

# Run the app
CMD ["serve", "-s", "dist", "-l", "5000"]