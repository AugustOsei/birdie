#!/bin/bash

# Birdie Deployment Script
# Run this on your EC2 instance after cloning the repo

set -e

echo "🚀 Starting Birdie deployment..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
    echo "Please don't run as root. Run as ubuntu user."
    exit 1
fi

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Install Docker if not present
if ! command_exists docker; then
    echo "${YELLOW}Installing Docker...${NC}"
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
    echo "${GREEN}✓ Docker installed${NC}"
fi

# Install Docker Compose if not present
if ! command_exists docker-compose; then
    echo "${YELLOW}Installing Docker Compose...${NC}"
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    echo "${GREEN}✓ Docker Compose installed${NC}"
fi

# Create necessary directories
echo "${YELLOW}Creating directories...${NC}"
mkdir -p data certbot/conf certbot/www

# Set proper permissions
sudo chown -R $USER:$USER .

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "${YELLOW}Creating .env file from .env.example...${NC}"
    cp .env.example .env
    echo "${YELLOW}⚠️  Please edit .env file with your settings${NC}"
    read -p "Press enter to continue after editing .env..."
fi

# Get SSL certificate (first time only)
if [ ! -d "certbot/conf/live/birdie.augustwheel.com" ]; then
    echo "${YELLOW}Obtaining SSL certificate...${NC}"
    
    # Start nginx temporarily for HTTP challenge
    docker-compose up -d nginx
    
    # Get certificate
    docker-compose run --rm certbot certonly --webroot \
        --webroot-path /var/www/certbot \
        --email your-email@augustwheel.com \
        --agree-tos \
        --no-eff-email \
        -d birdie.augustwheel.com
    
    echo "${GREEN}✓ SSL certificate obtained${NC}"
fi

# Build and start all services
echo "${YELLOW}Building and starting services...${NC}"
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Wait for services to be healthy
echo "${YELLOW}Waiting for services to start...${NC}"
sleep 10

# Check service health
echo "${YELLOW}Checking service health...${NC}"
if curl -f http://localhost/api/health > /dev/null 2>&1; then
    echo "${GREEN}✓ Backend API is healthy${NC}"
else
    echo "⚠️  Backend API health check failed"
fi

# Show logs
echo ""
echo "${GREEN}========================================${NC}"
echo "${GREEN}🎉 Deployment complete!${NC}"
echo "${GREEN}========================================${NC}"
echo ""
echo "Your app should be running at: https://birdie.augustwheel.com"
echo ""
echo "Useful commands:"
echo "  docker-compose logs -f           # View all logs"
echo "  docker-compose logs -f backend   # View backend logs"
echo "  docker-compose logs -f frontend  # View frontend logs"
echo "  docker-compose restart           # Restart all services"
echo "  docker-compose down              # Stop all services"
echo ""
echo "Database location: ./data/subscribers.db"
echo "Export subscribers: docker-compose exec backend wget -qO- http://localhost:3001/api/admin/export > subscribers.csv"
echo ""

read -p "Do you want to view the logs now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    docker-compose logs -f
fi
