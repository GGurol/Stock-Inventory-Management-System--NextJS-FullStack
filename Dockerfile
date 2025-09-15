# Stage 1: Build the application
# CORRECTED: Pinned the Alpine version to 3.18 for stability and package availability
FROM node:18-alpine3.18 AS builder
WORKDIR /app

# Install OpenSSL 1.1 which is explicitly required by the Prisma engine in the error log
RUN apk add --no-cache openssl1.1-compat

# Copy dependency files AND the prisma schema first
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Explicitly run prisma generate to ensure the client is correctly generated
RUN npx prisma generate

# Copy the rest of the application code
COPY . .

# Build the Next.js application for production
RUN npm run build

# Stage 2: Create the final, smaller production image
# CORRECTED: Also pinned the final image to Alpine 3.18
FROM node:18-alpine3.18
WORKDIR /app

# Also install OpenSSL 1.1 in the final image for runtime
RUN apk add --no-cache openssl1.1-compat

# Create a non-root user for security
RUN addgroup -S appuser && adduser -S appuser -G appuser

# Copy only the necessary artifacts from the builder stage
# ... (geri kalan her şey aynı)
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json .
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

# Change ownership to the non-root user
RUN chown -R appuser:appuser /app

USER appuser

EXPOSE 3000

# Command to start the Next.js production server
CMD ["npm", "start"]