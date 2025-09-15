# Stage 1: Build the application
FROM node:18-alpine AS builder
WORKDIR /app

# Copy dependency files AND the prisma schema first
COPY package*.json ./
COPY prisma ./prisma/

# Now that schema.prisma exists, npm install can successfully run the postinstall script
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js application for production
RUN npm run build

# Stage 2: Create the final, smaller production image
FROM node:18-alpine
WORKDIR /app

# Create a non-root user for security
RUN addgroup -S appuser && adduser -S appuser -G appuser

# Copy only the necessary artifacts from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json .
# Copy production node_modules and the generated prisma client
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

# Change ownership to the non-root user
RUN chown -R appuser:appuser /app

USER appuser

EXPOSE 3000

# Command to start the Next.js production server
CMD ["npm", "start"]