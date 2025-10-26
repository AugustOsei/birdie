# Multi-App Deployment Guide

## Architecture for Multiple Apps on One EC2 Instance

### Overview

You can host multiple applications on a single EC2 instance using:
- **One global nginx reverse proxy** (handles ALL domains)
- **One certbot instance** (manages ALL SSL certificates)
- **Separate Docker networks** for each app
- **No separate user accounts needed** (use ubuntu user for all)

---

## 📁 Recommended Directory Structure

```bash
/home/ubuntu/
│
├── nginx-proxy/              # Global reverse proxy
│   ├── docker-compose.yml
│   ├── nginx.conf
│   ├── conf.d/
│   │   ├── birdie.conf
│   │   ├── portfolio.conf
│   │   └── api.conf
│   └── certbot/              # All SSL certificates
│       ├── conf/
│       └── www/
│
├── birdie/                   # Birdie app
│   ├── docker-compose.yml
│   ├── backend/
│   ├── frontend/
│   └── data/
│
├── portfolio/                # Portfolio site
│   ├── docker-compose.yml
│   └── src/
│
└── api-service/              # Another service
    ├── docker-compose.yml
    └── src/
```

---

## 🔧 Setup Steps

### 1. Create Global Nginx Proxy

Create `/home/ubuntu/nginx-proxy/docker-compose.yml`:

```yaml
version: '3.8'

services:
  nginx:
    image: nginx:alpine
    container_name: global-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./conf.d:/etc/nginx/conf.d:ro
      - ./certbot/conf:/etc/letsencrypt:ro
      - ./certbot/www:/var/www/certbot:ro
    networks:
      - nginx-proxy
      - birdie-network
      - portfolio-network
      # Add more networks as needed

  certbot:
    image: certbot/certbot
    container_name: global-certbot
    volumes:
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
    entrypoint: "/bin/sh -c 'trap exit TERM; while :; do certbot renew; sleep 12h & wait $${!}; done;'"

networks:
  nginx-proxy:
    driver: bridge
  birdie-network:
    external: true
  portfolio-network:
    external: true
```

### 2. Create Domain-Specific Nginx Configs

`/home/ubuntu/nginx-proxy/conf.d/birdie.conf`:

```nginx
server {
    listen 80;
    server_name birdie.augustwheel.com;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl http2;
    server_name birdie.augustwheel.com;

    ssl_certificate /etc/letsencrypt/live/birdie.augustwheel.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/birdie.augustwheel.com/privkey.pem;

    # Backend API
    location /api/ {
        proxy_pass http://birdie-backend:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Frontend
    location / {
        proxy_pass http://birdie-frontend:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

`/home/ubuntu/nginx-proxy/conf.d/portfolio.conf`:

```nginx
server {
    listen 80;
    server_name portfolio.augustwheel.com;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl http2;
    server_name portfolio.augustwheel.com;

    ssl_certificate /etc/letsencrypt/live/portfolio.augustwheel.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/portfolio.augustwheel.com/privkey.pem;

    location / {
        proxy_pass http://portfolio-app:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 3. Update Each App's Docker Compose

Each app should:
1. **NOT expose ports 80/443** (nginx-proxy handles that)
2. **Join the nginx-proxy network**

Example for Birdie (`/home/ubuntu/birdie/docker-compose.yml`):

```yaml
version: '3.8'

services:
  frontend:
    build: ./frontend
    container_name: birdie-frontend
    restart: unless-stopped
    networks:
      - birdie-network
      - nginx-proxy  # Connect to nginx-proxy network
    # NO ports exposed!

  backend:
    build: ./backend
    container_name: birdie-backend
    restart: unless-stopped
    networks:
      - birdie-network
      - nginx-proxy  # Connect to nginx-proxy network
    # NO ports exposed!

networks:
  birdie-network:
    driver: bridge
  nginx-proxy:
    external: true  # Use global nginx-proxy network
```

---

## 🚀 Deployment Workflow

### First Time Setup

```bash
# 1. Create global nginx-proxy network
docker network create nginx-proxy

# 2. Start global nginx proxy
cd /home/ubuntu/nginx-proxy
docker-compose up -d

# 3. Get SSL certificates for all domains
docker-compose run --rm certbot certonly --webroot \
  --webroot-path /var/www/certbot \
  --email your-email@augustwheel.com \
  --agree-tos \
  --no-eff-email \
  -d birdie.augustwheel.com

docker-compose run --rm certbot certonly --webroot \
  --webroot-path /var/www/certbot \
  --email your-email@augustwheel.com \
  --agree-tos \
  --no-eff-email \
  -d portfolio.augustwheel.com

# 4. Restart nginx to load SSL certs
docker-compose restart nginx
```

### Deploying Individual Apps

```bash
# Deploy Birdie
cd /home/ubuntu/birdie
git pull origin main
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Deploy Portfolio (doesn't affect Birdie!)
cd /home/ubuntu/portfolio
git pull origin main
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Adding a New App

```bash
# 1. Clone new app
cd /home/ubuntu
git clone https://github.com/YOUR_USERNAME/new-app.git
cd new-app

# 2. Update docker-compose.yml to join nginx-proxy network

# 3. Add nginx config
sudo nano /home/ubuntu/nginx-proxy/conf.d/newapp.conf

# 4. Get SSL certificate
cd /home/ubuntu/nginx-proxy
docker-compose run --rm certbot certonly --webroot \
  --webroot-path /var/www/certbot \
  --email your-email@augustwheel.com \
  --agree-tos \
  --no-eff-email \
  -d newapp.augustwheel.com

# 5. Reload nginx
docker-compose restart nginx

# 6. Deploy the app
cd /home/ubuntu/new-app
docker-compose up -d
```

---

## 📊 DNS Setup for Multiple Apps

In GoDaddy, add A records for each subdomain:

| Type | Name      | Value (EC2 Public IP) | TTL |
|------|-----------|-----------------------|-----|
| A    | birdie    | 54.123.45.67         | 600 |
| A    | portfolio | 54.123.45.67         | 600 |
| A    | api       | 54.123.45.67         | 600 |

All point to the **same EC2 IP**. Nginx routes based on domain name.

---

## 🔐 User Accounts: Do You Need Separate Users?

**Short Answer: NO**

### For Docker-Based Apps:
- ✅ Use **one user** (ubuntu) for all apps
- ✅ Docker provides **isolation** between containers
- ✅ **Simpler management** (one set of SSH keys)
- ✅ **Easier permissions** (all in /home/ubuntu)

### When You MIGHT Want Separate Users:
- ❌ Running apps **without Docker** (direct on host)
- ❌ **Extremely sensitive** applications
- ❌ **Different teams** managing different apps
- ❌ **Compliance requirements** (audit trails)

**For your use case (personal projects), stick with ubuntu user + Docker isolation.**

---

## 📁 Example: Your EC2 After Adding Portfolio

```bash
/home/ubuntu/
│
├── nginx-proxy/
│   ├── docker-compose.yml
│   ├── nginx.conf
│   ├── conf.d/
│   │   ├── birdie.conf           ← birdie.augustwheel.com
│   │   └── portfolio.conf        ← portfolio.augustwheel.com
│   └── certbot/
│       ├── conf/
│       │   └── live/
│       │       ├── birdie.augustwheel.com/
│       │       └── portfolio.augustwheel.com/
│       └── www/
│
├── birdie/                        ← GitHub: AugustOsei/birdie
│   ├── docker-compose.yml
│   ├── backend/
│   ├── frontend/
│   └── data/
│       └── subscribers.db
│
└── portfolio/                     ← GitHub: AugustOsei/portfolio
    ├── docker-compose.yml
    ├── src/
    └── public/
```

---

## 🎯 Benefits of This Approach

✅ **One SSL management** - certbot handles all domains
✅ **Easy to add new apps** - just add nginx config
✅ **Independent deployments** - update one app without affecting others
✅ **Resource efficient** - one nginx serves all
✅ **Centralized logging** - all traffic goes through one proxy
✅ **Easy monitoring** - one place to check health

---

## 🔄 Common Commands

```bash
# View all running containers
docker ps

# View all logs
docker-compose logs -f

# Restart specific app
cd /home/ubuntu/birdie
docker-compose restart

# Restart nginx proxy
cd /home/ubuntu/nginx-proxy
docker-compose restart nginx

# View nginx access logs
docker logs global-nginx

# Check SSL certificate expiry
docker-compose exec certbot certbot certificates

# Manually renew SSL
docker-compose run --rm certbot renew
```

---

## 💡 Resource Considerations

### EC2 Instance Sizing

| Apps | Recommended Instance | RAM  | vCPUs |
|------|---------------------|------|-------|
| 1-2  | t2.small            | 2 GB | 1     |
| 3-4  | t2.medium           | 4 GB | 2     |
| 5+   | t2.large            | 8 GB | 2     |

**Monitor with:**
```bash
# Check memory usage
free -h

# Check disk usage
df -h

# Check Docker stats
docker stats
```

---

## 🆘 Troubleshooting

### Issue: New domain not accessible

```bash
# Check nginx config syntax
docker exec global-nginx nginx -t

# Reload nginx
docker-compose restart nginx

# Check DNS propagation
nslookup newapp.augustwheel.com
```

### Issue: SSL certificate error

```bash
# Check certificate exists
ls -la /home/ubuntu/nginx-proxy/certbot/conf/live/

# Re-obtain certificate
docker-compose run --rm certbot certonly --webroot \
  --webroot-path /var/www/certbot \
  -d yourdomain.com
```

---

This setup gives you maximum flexibility while keeping management simple! 🚀
