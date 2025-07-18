#!/bin/bash

echo "🚀 Starting deployment..."

# Pull latest changes
git pull origin main

# Install dependencies
npm ci

# Run migrations
npm run migrate

# Build client
cd client && npm run build && cd ..

# Restart application
pm2 restart ecosystem.config.js

echo "✅ Deployment completed!"