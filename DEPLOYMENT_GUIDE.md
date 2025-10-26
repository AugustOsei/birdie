# 🚀 Quick Deployment Guide for Birdie

## Pre-Deployment Checklist

- [ ] EC2 instance running Ubuntu 22.04+
- [ ] Security groups allow ports 80 and 443
- [ ] Domain `birdie.augustwheel.com` pointed to EC2 IP in GoDaddy DNS
- [ ] SSH access to EC2 instance

## 📋 Deployment Steps

### 1. Push to GitHub

On your local machine:

```bash
cd /Users/aosei/Documents/Birdie

# Initialize git repository (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Birdie game ready for deployment"

# Add remote (replace with your GitHub repo URL)
git remote add origin https://github.com/YOUR_USERNAME/Birdie.git

# Push to GitHub
git push -u origin main
```

### 2. DNS Setup (GoDaddy)

1. Log into GoDaddy
2. Go to your domain augustwheel.com
3. Click "DNS" or "Manage DNS"
4. Add an A Record:
   - **Type**: A
   - **Name**: birdie
   - **Value**: [Your EC2 Public IP]
   - **TTL**: 600 (or default)
5. Save

Wait 5-10 minutes for DNS to propagate. Test with:
```bash
nslookup birdie.augustwheel.com
```

### 3. EC2 Setup

SSH into your EC2 instance:

```bash
ssh -i your-key.pem ubuntu@YOUR_EC2_IP
```

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/Birdie.git
cd Birdie
```

### 4. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit the file
nano .env
```

Update these values:
```env
DOMAIN=birdie.augustwheel.com
LETSENCRYPT_EMAIL=your-email@augustwheel.com
VITE_API_URL=https://birdie.augustwheel.com
```

Save and exit (Ctrl+X, then Y, then Enter)

### 5. Deploy!

```bash
# Make deployment script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

The script will automatically:
- Install Docker and Docker Compose
- Set up SSL certificates
- Build and start all services
- Verify everything is working

### 6. Verify Deployment

1. **Check services are running:**
   ```bash
   docker-compose ps
   ```
   All services should show "Up"

2. **Test the API:**
   ```bash
   curl https://birdie.augustwheel.com/api/health
   ```
   Should return: `{"status":"ok","timestamp":"...","subscriberCount":0}`

3. **Visit your site:**
   Open in browser: `https://birdie.augustwheel.com`

## ✅ Post-Deployment

### Test Email Subscription

1. Go to https://birdie.augustwheel.com
2. Click "About Game"
3. Scroll down to "Get Updates"
4. Enter an email and click "Sign Up"
5. Should see "Thanks for signing up!"

### Verify Email in Database

```bash
docker-compose exec backend sqlite3 /app/data/subscribers.db "SELECT * FROM subscribers;"
```

### Export Subscribers

```bash
docker-compose exec backend wget -qO- http://localhost:3001/api/admin/export > subscribers.csv
cat subscribers.csv
```

## 🔄 Future Updates

When you make changes to the code:

```bash
# On your local machine
git add .
git commit -m "Description of changes"
git push origin main

# On EC2
cd ~/Birdie
git pull origin main
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## 🆘 Troubleshooting

### Problem: SSL Certificate Error

**Solution:**
```bash
cd ~/Birdie
./init-ssl.sh
./deploy.sh
```

### Problem: Site Not Loading

**Check 1:** Is DNS propagated?
```bash
nslookup birdie.augustwheel.com
```

**Check 2:** Are containers running?
```bash
docker-compose ps
```

**Check 3:** Check nginx logs
```bash
docker-compose logs nginx
```

### Problem: Email Subscriptions Not Working

**Check backend logs:**
```bash
docker-compose logs backend
```

**Test API directly:**
```bash
curl -X POST https://birdie.augustwheel.com/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

## 📊 Monitoring

### View Logs (Live)
```bash
docker-compose logs -f
```

### Check Health
```bash
curl https://birdie.augustwheel.com/api/health
```

### View Subscriber Count
```bash
docker-compose exec backend sqlite3 /app/data/subscribers.db "SELECT COUNT(*) FROM subscribers;"
```

## 🎉 Success!

Your Birdie game is now live at:
**https://birdie.augustwheel.com**

Share it with friends and start collecting feedback!

---

Need help? Check the main [README.md](README.md) for detailed documentation.
