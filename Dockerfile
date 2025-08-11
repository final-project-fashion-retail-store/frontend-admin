# ---- Build stage ----
FROM node:20-slim AS builder
WORKDIR /app

# Install deps (cached)
COPY package*.json ./
RUN npm ci

# Build
COPY . .
RUN npm run build

# ---- Runtime stage ----
FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

# Lightweight static server
RUN npm install -g serve

# Only copy build output
COPY --from=builder /app/dist ./dist

EXPOSE 5173
# --single ensures SPA fallback to index.html
CMD ["serve", "-s", "dist", "-l", "5173", "--single"]
