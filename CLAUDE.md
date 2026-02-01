# Birdie Project - Claude Context File

> **Last Updated:** 2026-02-01
> **Project Status:** ✅ Live in Production

---

## 🚨 CRITICAL RULES - READ THIS FIRST

### ⛔ DEPLOYMENT RULE (MANDATORY)
**🔴 NEVER commit or push to GitHub without explicit user permission 🔴**

- **Hosting:** Railway (auto-deploys on push to `main` branch)
- **⚠️ WARNING:** Any push to `main` = INSTANT production deployment
- **Deployment Time:** ~2-5 minutes after push

### How to Handle Commits/Pushes
✅ **DO:** Make code changes locally and wait for user instruction
✅ **DO:** Ask "Would you like me to commit and push these changes?"
✅ **DO:** Only commit/push when user explicitly says:
   - "commit and push"
   - "deploy this"
   - "push to production"
   - "yes, commit"

❌ **DON'T:** Auto-commit after making changes
❌ **DON'T:** Assume user wants changes deployed
❌ **DON'T:** Push without explicit confirmation

### Production Deployment Pipeline
- **Git Branch:** `main`
- **Live URL:** [Add your Railway URL here]
- **Pipeline:** GitHub push → Railway detects change → Auto-deploy → Live in ~2-5 min

---

## 📋 Project Overview

**Birdie** is a bird identification learning game inspired by Duolingo's visual style and gamification approach.

### Tech Stack
- **Frontend:** React + TypeScript + Vite
- **Styling:** Vanilla CSS (App.css)
- **State Management:** React hooks (useState, useEffect)
- **Audio:** Custom audio manager (`utils/audio.ts`)
- **Storage:** Browser localStorage for persistence
- **Deployment:** Railway (production)

### Key Directories
```
/Users/aosei/Documents/Birdie/
├── birdie-app/                 # Main application
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── utils/              # Helper functions
│   │   ├── data/               # Game data (birds, badges)
│   │   ├── types.ts            # TypeScript definitions
│   │   └── App.tsx             # Main app component
│   ├── public/
│   │   └── images/             # Bird images (PNG files)
│   └── dist/                   # Build output
```

---

## 🎮 Game Modes

### 1. Classic Mode (Original)
- Multiple choice bird identification
- 3 birds per question
- Progressive difficulty
- Achievements and badges
- Sound effects and ambient audio

### 2. Birdie Pro Mode
- Extended game (50 birds)
- Cooldown system (24 hours between attempts)
- Premium scoring system
- Special gold theme

### 3. Love Birds Challenge (Valentine's Feature)
- **Added:** Recent feature addition
- 14 questions about birds that mate for life
- Special pink/romantic theme
- Heart animations and Valentine's facts
- **Known Issue (FIXED 2026-01-31):** Bird images were cropping - fixed by changing `object-fit: cover` to `object-fit: scale-down`

---

## 🗂️ Important Files to Know

### Core Application Files
- `birdie-app/src/App.tsx` - Main app component, game mode routing
- `birdie-app/src/App.css` - **ALL STYLING** (2400+ lines, single CSS file)
- `birdie-app/src/types.ts` - TypeScript type definitions

### Game Components
- `components/Landing.tsx` - Landing page with game mode selection
- `components/LoveBirdsGame.tsx` - Love Birds game mode
- `components/LoveBirdsResults.tsx` - Love Birds results screen
- `components/BirdieProGame.tsx` - Pro mode game
- `components/BirdieProResults.tsx` - Pro mode results

### Utilities
- `utils/loveBirdsLogic.ts` - Love Birds game logic (bird IDs that mate for life)
- `utils/gameLogic.ts` - Classic game logic
- `utils/audio.ts` - Audio management
- `utils/storage.ts` - localStorage persistence

### Data
- `data/birds.ts` - All bird data (names, images, fun facts)
- `data/badges.ts` - Achievement/badge definitions

---

## 🎨 Styling Architecture

**IMPORTANT:** All styles are in a single `App.css` file (not component-scoped CSS)

### Love Birds Specific Styles
- Lines 2140-2459: Love Birds Challenge styles
- `.love-birds-game` - Main game container
- `.birds-grid` - Grid layout for bird options
- `.bird-option` - Individual bird card
- `.bird-option img` - Bird image styling **(Recently fixed - see line 2263)**

### Common Patterns
- Pink/romantic colors for Love Birds: `#FF69B4`, `#C2185B`, `#FFE4E1`
- Gold colors for Pro mode: `#FFD700`, `#FFA500`
- Green for correct answers: `#4CAF50`
- Red for incorrect: `#E74C3C`

---

## 🐛 Recent Issues & Fixes

### 2026-01-31: Love Birds Image Cropping Issue
**Problem:** Bird images in Love Birds game were cropping at top/bottom
**Root Cause:** CSS `object-fit: cover` was cropping images to fill container
**Solution:** Changed to `object-fit: scale-down` with `height: auto` and `max-height: 300px`
**File Changed:** `birdie-app/src/App.css` (lines 2263-2272)
**Status:** ✅ Fixed and deployed to production

---

## 📝 Development Notes

### Things to Remember
1. Bird images are in `public/images/` as PNG files with transparent backgrounds
2. Images vary in size - flamingo is tall/vertical, sunbird is compact
3. localStorage is used for game state persistence
4. Audio files should be in `public/` directory
5. The app uses a cloud background with animated elements

### Common Tasks
- **Add new bird:** Update `data/birds.ts` and add image to `public/images/`
- **Modify Love Birds list:** Edit `LOVE_BIRD_IDS` in `utils/loveBirdsLogic.ts`
- **Style changes:** Edit `App.css` (search for relevant class names)
- **New game mode:** Create component in `components/` and add routing in `App.tsx`

### Testing Locally
```bash
cd birdie-app
npm run dev
# Opens at http://localhost:5173
```

### Building for Production
```bash
cd birdie-app
npm run build
# Output in dist/
```

---

## 🚀 Future Improvements / To-Do

### Suggested Improvements
- [ ] Consider splitting App.css into component-specific CSS modules
- [ ] Add a staging environment to test before production
- [ ] Create a `dev` branch for experimental features
- [ ] Add unit tests for game logic
- [ ] Optimize bird images (compress PNGs)
- [ ] Add more game modes
- [ ] Improve mobile responsiveness

### Known Issues
- None currently logged

---

## 💡 Tips for Future Claude Conversations

When starting a new conversation, Claude should:
1. ✅ Read this file first to understand project context
2. ✅ Check production status before making changes
3. ✅ ALWAYS ask before committing/pushing to avoid accidental deployments
4. ✅ Reference this file for tech stack and architecture decisions
5. ✅ Update this file when making significant changes

---

## 📞 Project Contacts & Links

- **Repository:** https://github.com/AugustOsei/birdie.git
- **Production URL:** [Add Railway URL]
- **Developer:** @AugustOsei

---

**Note:** This file should be updated whenever significant changes are made to the project structure, deployment pipeline, or major features are added/removed.
