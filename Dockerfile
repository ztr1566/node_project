# ---- Base Stage ----
    FROM node:18-alpine AS base
    WORKDIR /app
    COPY package*.json ./
    
    # ---- Dependencies Stage ----
    FROM base AS dependencies
    RUN npm install --production
    COPY . .
    
    # ---- Release Stage ----
    FROM base AS release
    COPY --from=dependencies /app .
    EXPOSE 5000
    CMD [ "node", "app.js" ]