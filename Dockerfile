# -------- Frontend Dockerfile for Expo --------

# 1. Base image
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# 2. Install dependencies (shared by dev/prod)
FROM base AS deps
COPY package*.json ./
# npm install kullan (package-lock.json senkronizasyon sorunlarını önlemek için)
RUN npm install --no-audit --no-fund
# ❌ KALDIRILDI: RUN npx expo install react-native-web react-dom

# 3. Development stage
FROM deps AS development
WORKDIR /app
COPY . .
# Expo ports
EXPOSE 8081
EXPOSE 19000
EXPOSE 19001
CMD ["npx", "expo", "start", "--host", "tunnel", "--port", "8081"]

# 4. Production builder stage (web export)
FROM deps AS builder
WORKDIR /app
COPY . .
ENV NODE_ENV=production
RUN npx expo export --platform web

# 5. Production runner stage (serve static)
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN npm install -g serve
COPY --from=builder /app/dist ./dist
EXPOSE 8081
CMD ["npx", "serve", "-s", "dist", "-l", "8081"]
