# Birdie - Daily Bird Guessing Game

A beautiful daily bird identification game built with React, TypeScript, and Vite. Test your bird knowledge by identifying 9 birds each day!

## Features

- **Daily Gameplay**: Play once per day with 9 different birds
- **Progressive Sets**: Birds are presented in 3 sets of 3 birds each
- **Streak Tracking**: Build your daily streak by playing every day
- **Local Storage**: Your progress and preferences are saved locally
- **Beautiful Animations**: Watch correct birds fly away with smooth animations
- **Sound Effects**: Synthesized bird chirps and whoosh sounds (can be muted)
- **Fun Facts**: Learn interesting facts about the birds you encounter
- **Responsive Design**: Works beautifully on desktop and mobile devices
- **Share & Invite**: Share your score and invite friends to play

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd birdie-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Docker Deployment

### Build and run with Docker:

```bash
docker build -t birdie .
docker run -p 80:80 birdie
```

### Or use Docker Compose:

```bash
docker-compose up -d
```

The application will be available at [http://localhost](http://localhost)

## Deploying to Ubuntu Server with Nginx

### Option 1: Using Docker (Recommended)

1. Install Docker on your Ubuntu server:
```bash
sudo apt update
sudo apt install docker.io docker-compose -y
sudo systemctl enable docker
sudo systemctl start docker
```

2. Copy your project to the server

3. Build and run:
```bash
cd birdie-app
sudo docker-compose up -d
```

4. Install Certbot for SSL:
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com
```

### Option 2: Manual Nginx Setup

1. Build the project locally:
```bash
npm run build
```

2. Copy the `dist` folder to your server:
```bash
scp -r dist/* user@yourserver:/var/www/birdie
```

3. Configure Nginx on your server:
```bash
sudo nano /etc/nginx/sites-available/birdie
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    root /var/www/birdie;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

4. Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/birdie /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

5. Install SSL certificate:
```bash
sudo certbot --nginx -d yourdomain.com
```

## Project Structure

```
birdie-app/
├── public/
│   ├── images/          # Bird PNG images
│   └── data/
│       └── birds.json   # Bird data with facts
├── src/
│   ├── components/      # React components
│   │   ├── SkyBackground.tsx
│   │   ├── Header.tsx
│   │   ├── Landing.tsx
│   │   ├── Game.tsx
│   │   ├── ScoreDisplay.tsx
│   │   └── Modal.tsx
│   ├── utils/          # Utility functions
│   │   ├── storage.ts  # Local storage management
│   │   ├── gameLogic.ts # Game logic
│   │   └── audio.ts    # Audio management
│   ├── types.ts        # TypeScript types
│   ├── App.tsx         # Main app component
│   ├── App.css         # Styles
│   └── main.tsx        # Entry point
├── Dockerfile
├── docker-compose.yml
├── nginx.conf
└── package.json
```

## Game Rules

1. A new game is available every day at midnight (based on your device timezone)
2. Each game consists of 9 birds divided into 3 sets
3. For each bird, select the correct name from 3 options
4. Submit your answers to see which ones are correct
5. Correct birds will fly away!
6. After all 3 sets, view your final score and fun bird facts
7. Build your daily streak by playing every day

## Technologies Used

- **React** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Web Audio API** - Sound effects
- **Local Storage API** - Progress tracking
- **CSS3** - Animations and styling
- **Docker** - Containerization
- **Nginx** - Web server

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for your own purposes.

## Acknowledgments

- Bird images and facts are educational resources
- Inspired by daily puzzle games like Wordle
- Built with love for nature and birds

## Support

For issues or questions, please open an issue on GitHub.

---

Happy birding! 🐦
