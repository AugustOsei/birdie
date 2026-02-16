# Birdie 🐦

A fun bird identification game where players collect badges by demonstrating their birding skills!

## 🎮 About

Birdie is a web-based game that challenges users to identify birds correctly. Players can:
- Identify birds from images
- Earn badges for achievements
- Build streaks with perfect scores
- Learn fun facts about birds
- Track their progress locally

## 🏗️ Architecture

```
birdie.augustwheel.com
    ↓
Docker Compose Stack:
├── Frontend (React + Vite + Nginx)
├── Backend (Express.js + SQLite)
├── Nginx Reverse Proxy (SSL termination)
└── Certbot (SSL certificate management)
```

## 📁 Project Structure

```
Birdie/
├── birdie-app/          # Frontend React application
│   ├── src/
│   ├── public/
│   ├── Dockerfile
│   └── nginx.conf
├── backend/             # Backend API
│   ├── src/
│   │   ├── server.js
│   │   └── database.js
│   ├── package.json
│   └── Dockerfile
├── nginx/              # Nginx reverse proxy config
│   ├── nginx.conf
│   └── conf.d/
│       └── birdie.conf
├── docker-compose.yml  # Orchestration
├── deploy.sh          # Deployment script
├── .env.example       # Environment template
└── README.md          # This file
```

## 🚀 Deployment

See [`DEPLOYMENT.md`](./DEPLOYMENT.md).

3. Obtain SSL certificate from Let's Encrypt
4. Build and start all containers
5. Verify service health

### Step 5: Verify Deployment

1. Check if services are running:
   ```bash
   docker-compose ps
   ```

2. Test the API:
   ```bash
   curl https://birdie.augustwheel.com/api/health
   ```

3. Visit your site:
   ```
   https://birdie.augustwheel.com
   ```

## 🔧 Management Commands

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f nginx
```

### Restart Services
```bash
# All services
docker-compose restart

# Specific service
docker-compose restart backend
```

### Stop/Start
```bash
# Stop all
docker-compose down

# Start all
docker-compose up -d
```

### Rebuild After Code Changes
```bash
git pull origin main
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## 📊 Email Subscribers Management

### Export Subscribers to CSV
```bash
docker-compose exec backend wget -qO- http://localhost:3001/api/admin/export > subscribers.csv
```

### View Subscriber Count
```bash
docker-compose exec backend sqlite3 /app/data/subscribers.db "SELECT COUNT(*) FROM subscribers;"
```

### View All Subscribers
```bash
docker-compose exec backend sqlite3 /app/data/subscribers.db "SELECT * FROM subscribers;"
```

### Import to Mailchimp

1. Export subscribers:
   ```bash
   docker-compose exec backend wget -qO- http://localhost:3001/api/admin/export > subscribers.csv
   ```

2. In Mailchimp:
   - Go to Audience → Import contacts
   - Upload `subscribers.csv`
   - Map email column
   - Complete import

## 🔐 SSL Certificate Renewal

Certbot automatically renews certificates every 12 hours. Manual renewal:

```bash
docker-compose run --rm certbot renew
docker-compose restart nginx
```

## 🐛 Troubleshooting

### Issue: Site not accessible

1. Check if containers are running:
   ```bash
   docker-compose ps
   ```

2. Check nginx logs:
   ```bash
   docker-compose logs nginx
   ```

3. Verify domain DNS:
   ```bash
   nslookup birdie.augustwheel.com
   ```

### Issue: SSL certificate error

1. Check certificate files:
   ```bash
   ls -la certbot/conf/live/birdie.augustwheel.com/
   ```

2. Verify domain is pointed correctly
3. Re-run certificate generation:
   ```bash
   ./deploy.sh
   ```

### Issue: Email subscriptions not working

1. Check backend logs:
   ```bash
   docker-compose logs backend
   ```

2. Test API directly:
   ```bash
   curl -X POST https://birdie.augustwheel.com/api/subscribe \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com"}'
   ```

3. Check database:
   ```bash
   docker-compose exec backend ls -la /app/data/
   ```

## 📈 Monitoring

### Check Service Health
```bash
curl https://birdie.augustwheel.com/api/health
```

### View Resource Usage
```bash
docker stats
```

### Database Size
```bash
docker-compose exec backend du -sh /app/data/subscribers.db
```

## 🔄 Updates and Maintenance

### Update Application Code

```bash
cd ~/Birdie
git pull origin main
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Backup Database

```bash
# Create backup
docker-compose exec backend cp /app/data/subscribers.db /app/data/subscribers-backup-$(date +%Y%m%d).db

# Copy to host
docker cp birdie-backend:/app/data/subscribers-backup-$(date +%Y%m%d).db ./backup/
```

### Regular Maintenance Tasks

1. **Weekly**: Check logs for errors
   ```bash
   docker-compose logs --tail=100
   ```

2. **Monthly**: Backup database
   ```bash
   ./backup-database.sh
   ```

3. **Monthly**: Check disk space
   ```bash
   df -h
   ```

4. **Quarterly**: Review and clean old Docker images
   ```bash
   docker system prune -a
   ```

## 🛠️ Local Development

### Frontend
```bash
cd birdie-app
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
npm run dev
```

### Environment Variables (Local)
Create `birdie-app/.env.local`:
```
VITE_API_URL=http://localhost:3001
```

## 📝 API Endpoints

### Public Endpoints

- `GET /api/health` - Health check
- `POST /api/subscribe` - Subscribe email
  ```json
  {
    "email": "user@example.com"
  }
  ```

### Admin Endpoints

- `GET /api/admin/export` - Export subscribers as CSV (**requires server-side API key**)

## 🔮 Future Features

- [ ] User authentication and accounts
- [ ] Cloud sync for progress
- [ ] Mailchimp direct API integration
- [ ] Admin dashboard
- [ ] Analytics integration
- [ ] Social sharing improvements

## 📄 License

MIT

## 👤 Author

August Wheel - [augustwheel.com](https://www.augustwheel.com)

## 🤝 Contributing

This is a personal project, but feedback and suggestions are welcome!

---

Made with care
