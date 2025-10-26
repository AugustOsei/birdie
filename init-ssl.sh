#!/bin/bash

# SSL Certificate Initialization Script
# Run this ONCE before first deployment to get SSL certificate

set -e

DOMAIN="birdie.augustwheel.com"
EMAIL="your-email@augustwheel.com"

echo "🔐 Initializing SSL certificate for $DOMAIN..."

# Create directories
mkdir -p certbot/conf certbot/www

# Start nginx in HTTP mode temporarily
echo "Starting nginx temporarily..."
docker-compose up -d nginx

# Wait for nginx to start
sleep 5

# Get certificate
echo "Requesting SSL certificate..."
docker-compose run --rm certbot certonly --webroot \
    --webroot-path /var/www/certbot \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    --force-renewal \
    -d $DOMAIN

echo "✅ SSL certificate obtained!"
echo "Now run: ./deploy.sh"

# Stop nginx
docker-compose down
