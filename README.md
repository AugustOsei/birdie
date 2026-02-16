# Birdie 🐦

Birdie is a web-based bird identification game.

## 🎮 About

Players can:
- Identify birds from images
- Earn badges for achievements
- Learn fun facts about birds
- Track progress locally (no accounts)

## 🏗️ Architecture

```
Internet
  ↓
Reverse proxy / TLS
  ↓
Docker Compose
  ├── Frontend (React + Vite)
  └── Backend (Express.js + SQLite)
```

## 📁 Project Structure

```
Birdie/
├── birdie-app/          # Frontend
├── backend/             # Backend API
├── nginx/               # Reverse proxy config (optional)
├── docker-compose.yml   # Orchestration
├── deploy.sh            # Helper script (optional)
├── .env.example         # Environment template
├── DEPLOYMENT.md
├── SECURITY.md
└── README.md
```

## 🚀 Deployment

See [`DEPLOYMENT.md`](./DEPLOYMENT.md).

## 🛠️ Local Development

```bash
# backend
cd backend
npm install
npm run dev

# frontend (new terminal)
cd ../birdie-app
npm install
npm run dev
```

## 📝 API Endpoints

**Public**
- `GET /api/health`
- `POST /api/subscribe`

**Admin**
- `GET /api/admin/export` (requires server-side API key)

## 🔐 Security

See [`SECURITY.md`](./SECURITY.md).

## 📄 License

MIT
