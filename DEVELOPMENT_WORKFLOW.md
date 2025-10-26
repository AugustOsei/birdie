# Birdie Development Workflow Guide

A systematic approach to developing, testing, and deploying new features.

---

## 🎯 The Professional Development Cycle

```
1. Local Development → 2. Local Testing → 3. Git Commit → 4. Deploy to Production → 5. Production Testing
```

---

## 🛠️ Part 1: Setting Up Local Development

### Step 1: Start Backend Locally

Open a terminal and run:

```bash
# Navigate to backend
cd /Users/aosei/Documents/Birdie/backend

# Install dependencies (first time only)
npm install

# Start the backend server
npm run dev
```

You should see:
```
🚀 Birdie Backend API running on port 3001
📊 Total subscribers: 0
```

**Keep this terminal open** - the backend is now running at `http://localhost:3001`

### Step 2: Start Frontend Locally

Open a **NEW terminal** (keep backend running) and run:

```bash
# Navigate to frontend
cd /Users/aosei/Documents/Birdie/birdie-app

# Install dependencies (first time only)
npm install

# Start the frontend dev server
npm run dev
```

You should see:
```
VITE v7.1.12  ready in XXX ms
➜  Local:   http://localhost:5173/
```

### Step 3: Test Local Setup

1. Open browser: `http://localhost:5173`
2. Click "About Game"
3. Try email subscription
4. Check backend terminal - should see: `✉️  New subscriber: your-email@example.com`

**If email still fails**, check browser console (F12) for errors.

---

## 📝 Part 2: Adding a New Feature (Example: New Bird + Badge)

Let's walk through adding a new bird and creating a new badge for it.

### Example: Adding "Blue Heron" Bird

#### Step 1: Create Feature Branch

```bash
# Make sure you're on main and it's up to date
cd /Users/aosei/Documents/Birdie
git checkout main
git pull origin main

# Create a new branch for your feature
git checkout -b feature/add-blue-heron

# You're now on the feature branch
git branch  # Should show * feature/add-blue-heron
```

**Why branches?**
- Keep main branch clean
- Test features without breaking production
- Easy to rollback if something goes wrong

#### Step 2: Add the Bird Image

```bash
# Add bird image to public/images/
cp ~/Downloads/blue-heron.png birdie-app/public/images/blue-heron.png
```

#### Step 3: Update birds.json

```bash
# Edit the bird data file
code birdie-app/public/data/birds.json
```

Add new bird to the JSON:

```json
{
  "birds": [
    // ... existing birds ...
    {
      "id": 28,
      "name": "Blue Heron",
      "image": "/images/blue-heron.png",
      "scientificName": "Ardea herodias",
      "habitat": "Wetlands and shorelines",
      "diet": "Fish and amphibians",
      "funFacts": [
        "Can stand motionless for hours while hunting",
        "Wingspan can reach 6 feet",
        "Often hunts at dawn and dusk"
      ]
    }
  ]
}
```

#### Step 4: Add a New Badge

Edit the badges file:

```bash
code birdie-app/src/data/badges.ts
```

Add new badge:

```typescript
export const AVAILABLE_BADGES = [
  // ... existing badges ...
  {
    id: 'heron-spotter',
    name: 'Heron Spotter',
    icon: '🦅',
    description: 'Successfully identified a Blue Heron',
    requirement: 'Identify Blue Heron correctly',
  },
];
```

---

## 🧪 Part 3: Testing Your Changes Locally

### Test Checklist

#### 1. Visual Test

```bash
# Make sure frontend is running
# Visit: http://localhost:5173

# Test these:
☐ Does the new bird appear in the game?
☐ Is the image loading correctly?
☐ Are the fun facts displaying?
☐ Does the badge appear in "My Badges"?
```

#### 2. Functional Test

```bash
# Play a game and check:
☐ Can you select the Blue Heron?
☐ Does it mark correct/incorrect properly?
☐ Does the score calculate correctly?
☐ Do the animations work?
```

#### 3. Browser Console Check

```bash
# Open browser console (F12)
# Check for:
☐ No red errors
☐ No 404s for missing images
☐ API calls succeed (Network tab)
```

#### 4. Mobile Test

```bash
# With dev server running:
npm run dev -- --host

# Visit on your phone:
http://YOUR_MAC_IP:5173

# Test:
☐ Responsive layout works
☐ Touch interactions work
☐ Images load on mobile
```

---

## ✅ Part 4: Committing Your Changes

Once everything works locally:

```bash
# Check what files changed
git status

# Add the changes
git add birdie-app/public/images/blue-heron.png
git add birdie-app/public/data/birds.json
git add birdie-app/src/data/badges.ts

# Commit with a clear message
git commit -m "Add Blue Heron bird and Heron Spotter badge

- Added Blue Heron to bird pool
- Added blue-heron.png image
- Created Heron Spotter achievement badge
- Updated birds.json with Blue Heron data"

# Push to GitHub
git push origin feature/add-blue-heron
```

---

## 🚀 Part 5: Deploying to Production

### Option A: Merge to Main First (Recommended)

```bash
# Switch to main branch
git checkout main

# Merge your feature branch
git merge feature/add-blue-heron

# Push to GitHub
git push origin main
```

### Option B: Direct Deploy from Feature Branch

```bash
# Just push your feature branch
git push origin feature/add-blue-heron
```

### Deploy to EC2

```bash
# SSH into your server
ssh -i your-key.pem ubuntu@YOUR_EC2_IP

# Navigate to project
cd birdie

# Pull latest changes
git pull origin main  # or your feature branch

# Rebuild and restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Check everything is running
docker ps

# Watch logs
docker-compose logs -f
```

### Verify Production

```bash
# Test the live site
curl https://birdie.augustwheel.com/api/health

# Visit in browser
open https://birdie.augustwheel.com

# Test the new feature
# - Play a game
# - Check if Blue Heron appears
# - Test badge unlocking
```

---

## 🔄 Part 6: The Complete Workflow (Quick Reference)

```bash
# 1. CREATE FEATURE BRANCH
git checkout main
git pull origin main
git checkout -b feature/your-feature-name

# 2. MAKE CHANGES
# Edit files, add features...

# 3. TEST LOCALLY
cd backend && npm run dev  # Terminal 1
cd birdie-app && npm run dev  # Terminal 2
# Visit http://localhost:5173 and test

# 4. COMMIT CHANGES
git add .
git commit -m "Description of changes"
git push origin feature/your-feature-name

# 5. MERGE TO MAIN
git checkout main
git merge feature/your-feature-name
git push origin main

# 6. DEPLOY TO PRODUCTION
ssh ubuntu@YOUR_EC2_IP
cd birdie
git pull origin main
docker-compose down
docker-compose build --no-cache
docker-compose up -d
docker ps

# 7. VERIFY
# Test on https://birdie.augustwheel.com
```

---

## 🐛 Debugging Tips

### Frontend Issues

```bash
# Check browser console
F12 → Console tab

# Common errors:
- "Failed to fetch" → Backend not running
- "404" → Image path wrong
- "CORS error" → Backend CORS settings
```

### Backend Issues

```bash
# Check backend terminal output
# Look for errors in red

# Common issues:
- Port 3001 already in use → Kill the process
- Database locked → Restart backend
- Module not found → Run npm install
```

### Kill Stuck Processes

```bash
# Find process on port 3001
lsof -ti :3001 | xargs kill -9

# Find process on port 5173
lsof -ti :5173 | xargs kill -9
```

---

## 📚 Common Tasks

### Adding a New Bird

1. Add image to `birdie-app/public/images/`
2. Update `birdie-app/public/data/birds.json`
3. Test locally
4. Commit and deploy

### Adding a New Badge

1. Edit `birdie-app/src/data/badges.ts`
2. Add badge logic in `utils/storage.ts` (if needed)
3. Test badge unlocking
4. Commit and deploy

### Updating Styles

1. Edit `birdie-app/src/App.css`
2. Save and see changes immediately (hot reload)
3. Test on different screen sizes
4. Commit and deploy

### Fixing Bugs

1. Create branch: `git checkout -b bugfix/description`
2. Fix the bug
3. Test thoroughly
4. Commit: `git commit -m "Fix: description"`
5. Deploy

---

## 🎓 Best Practices

### DO ✅

- **Test locally first** - Never push untested code
- **Use branches** - Keep main branch stable
- **Write clear commits** - Future you will thank you
- **Test on mobile** - Many users on phones
- **Check console** - Always look for errors
- **Backup database** - Before major changes

### DON'T ❌

- **Don't commit to main** - Use feature branches
- **Don't skip testing** - Always test locally
- **Don't push secrets** - Check .gitignore
- **Don't deploy without backup** - Save database first
- **Don't ignore errors** - Fix console warnings

---

## 🆘 Getting Help

### Check Logs

```bash
# Local backend logs
# Just look at the terminal where backend is running

# Production backend logs
docker logs birdie-backend

# Production nginx logs
docker logs birdie-nginx
```

### Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| `Failed to fetch` | Backend not running | Start backend server |
| `EADDRINUSE` | Port already in use | Kill process on that port |
| `404 Not Found` | Wrong file path | Check path in code |
| `CORS error` | Cross-origin issue | Add CORS headers |
| `Module not found` | Missing dependency | Run `npm install` |

---

## 🎯 Example: Complete Feature Addition

Let's add 5 new birds step-by-step:

```bash
# 1. Create branch
git checkout -b feature/add-5-new-birds

# 2. Add images
cp ~/Downloads/bird-*.png birdie-app/public/images/

# 3. Edit birds.json
code birdie-app/public/data/birds.json
# Add 5 new bird objects

# 4. Test locally
cd backend && npm run dev &
cd birdie-app && npm run dev
# Visit http://localhost:5173
# Play game, verify new birds appear

# 5. Commit
git add .
git commit -m "Add 5 new bird species

- Added Bald Eagle
- Added Flamingo
- Added Pelican
- Added Crane
- Added Stork

Expands bird pool from 27 to 32 species"

# 6. Push
git push origin feature/add-5-new-birds

# 7. Merge to main
git checkout main
git merge feature/add-5-new-birds
git push origin main

# 8. Deploy
ssh ubuntu@YOUR_EC2_IP
cd birdie
git pull origin main
docker-compose down
docker-compose build
docker-compose up -d

# 9. Test production
curl https://birdie.augustwheel.com/api/health
# Visit and play a game
```

---

## 📊 Development Tools

### Useful Commands

```bash
# View all branches
git branch -a

# Delete feature branch (after merge)
git branch -d feature/your-feature

# Undo last commit (keep changes)
git reset --soft HEAD~1

# See what changed
git diff

# See commit history
git log --oneline

# Test build locally
npm run build
```

### IDE Extensions (VS Code)

Recommended:
- ESLint - Catch errors
- Prettier - Format code
- GitLens - Git history
- Thunder Client - Test API
- Error Lens - Inline errors

---

This workflow ensures you **never break production** and can **confidently add features**! 🚀

Start with small changes, test thoroughly, and gradually build confidence. You've got this! 💪
