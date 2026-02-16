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


