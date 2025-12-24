# Analytics Setup Guide - Google Analytics 4

## Why Google Analytics?

✅ **Free** - No cost for most traffic levels
✅ **Powerful** - Track visitors, page views, events, conversions
✅ **Real-time** - See traffic as it happens
✅ **Easy to set up** - Just add a script tag
✅ **Industry standard** - Professional analytics platform

---

## Setup Steps

### Step 1: Create Google Analytics Account

1. Go to [Google Analytics](https://analytics.google.com)
2. Sign in with your Google account
3. Click **"Start measuring"**
4. Create an **Account**:
   - Account name: "August Wheel Projects" (or your name)
   - Click Next

5. Create a **Property**:
   - Property name: "Birdie Game"
   - Time zone: Your timezone
   - Currency: USD (or your preference)
   - Click Next

6. Add **Business Information**:
   - Industry: Entertainment/Gaming
   - Business size: Small
   - How you'll use Analytics: Measure user behavior
   - Click Create

7. Accept the Terms of Service

### Step 2: Set Up Data Stream

1. Choose platform: **Web**
2. Add website URL: `https://birdie.augustwheel.com`
3. Stream name: "Birdie Production"
4. Click **"Create stream"**

You'll see a **Measurement ID** like: `G-XXXXXXXXXX`

**📝 Copy this ID - you'll need it!**

---

## Step 3: Add Google Analytics to Your App

### Option 1: Using React Helmet (Recommended)

Install dependencies:

```bash
cd /Users/aosei/Documents/Birdie/birdie-app
npm install react-ga4
```

Create analytics utility file:

**File**: `birdie-app/src/utils/analytics.ts`

```typescript
import ReactGA from 'react-ga4';

const TRACKING_ID = import.meta.env.VITE_GA_TRACKING_ID || '';

export const initGA = () => {
  if (TRACKING_ID) {
    ReactGA.initialize(TRACKING_ID);
    console.log('📊 Google Analytics initialized');
  } else {
    console.warn('⚠️  Google Analytics tracking ID not set');
  }
};

export const trackPageView = (path: string) => {
  ReactGA.send({ hitType: 'pageview', page: path });
};

export const trackEvent = (category: string, action: string, label?: string) => {
  ReactGA.event({
    category,
    action,
    label,
  });
};
```

Update your `App.tsx`:

```typescript
import { useEffect } from 'react';
import { initGA, trackPageView } from './utils/analytics';

function App() {
  // ... existing code ...

  useEffect(() => {
    // Initialize Google Analytics
    initGA();
    trackPageView(window.location.pathname);
  }, []);

  // Track screen changes
  useEffect(() => {
    trackPageView(`/${screen}`);
  }, [screen]);

  // ... rest of your code ...
}
```

### Option 2: Direct Script Tag (Simpler)

Edit `birdie-app/index.html`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Birdie - Bird Identification Game</title>

    <!-- Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-XXXXXXXXXX');
    </script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Replace `G-XXXXXXXXXX` with your actual Measurement ID.

---

## Step 4: Add Environment Variable

### For Production Build:

Edit `birdie-app/.env.production`:

```env
VITE_API_URL=https://birdie.augustwheel.com
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
```

Replace `G-XXXXXXXXXX` with your actual tracking ID.

---

## Step 5: Track Custom Events

Add event tracking for user actions:

**In your game logic:**

```typescript
import { trackEvent } from './utils/analytics';

// When a game starts
trackEvent('Game', 'Start', 'Daily Game');

// When a user submits answers
trackEvent('Game', 'Submit', `Set ${currentSet + 1}`);

// When a user gets a perfect score
trackEvent('Achievement', 'Perfect Score', `Streak: ${streak}`);

// When a badge is earned
trackEvent('Badge', 'Earned', badgeName);

// When someone subscribes
trackEvent('Engagement', 'Email Subscribe', email);
```

---

## Step 6: Deploy to Production

```bash
# Commit changes
git add .
git commit -m "Add Google Analytics tracking"
git push origin main

# Deploy to EC2
ssh ubuntu@YOUR_EC2_IP
cd birdie
git pull origin main
docker-compose down
docker-compose build --no-cache frontend
docker-compose up -d
```

---

## Step 7: Verify It's Working

1. Visit your site: https://birdie.augustwheel.com
2. Go to Google Analytics → **Reports** → **Realtime**
3. You should see yourself as an active user!

---

## What You Can Track

### Automatic Tracking (Out of the Box):
- ✅ Page views
- ✅ Sessions
- ✅ Users (total, new, returning)
- ✅ Countries/cities
- ✅ Device types (desktop, mobile, tablet)
- ✅ Browsers
- ✅ Traffic sources (direct, social, search)
- ✅ Session duration
- ✅ Bounce rate

### Custom Events (You Add):
- 🎮 Games played
- 🏆 Perfect scores
- 🎯 Badge unlocks
- 📧 Email signups
- 🐦 Most identified birds
- 📱 Share button clicks

---

## Useful Analytics Queries

### In Google Analytics Dashboard:

**Traffic Overview:**
- Reports → Life Cycle → Acquisition → Traffic acquisition

**User Demographics:**
- Reports → User → Demographics → Overview

**Popular Pages:**
- Reports → Engagement → Pages and screens

**Real-time Users:**
- Reports → Realtime → Overview

**Event Tracking:**
- Reports → Engagement → Events

---

## Alternative: Simple Nginx Access Logs

If you want basic traffic stats without GA:

### On EC2 Server:

```bash
# View access logs
docker logs birdie-nginx --tail=100

# Count unique visitors today
docker logs birdie-nginx 2>&1 | grep "$(date +%d/%b/%Y)" | awk '{print $1}' | sort -u | wc -l

# Most visited pages
docker logs birdie-nginx 2>&1 | awk '{print $7}' | sort | uniq -c | sort -nr | head -10

# Traffic by hour
docker logs birdie-nginx 2>&1 | grep "$(date +%d/%b/%Y)" | awk '{print substr($4,14,2)}' | sort | uniq -c
```

**Pros**: Already available, no setup needed
**Cons**: Limited insights, no user tracking, no real-time dashboard

---

## Recommended Approach

**Use Google Analytics 4** because:

1. **Free** and comprehensive
2. **Real-time** dashboard
3. **User behavior** insights (what do people click, how long do they play)
4. **Conversion tracking** (email signups, badge achievements)
5. **Mobile vs Desktop** breakdown
6. **Traffic sources** (where are users coming from?)

Plus, it's industry standard for web analytics!

---

## Privacy Considerations

✅ Google Analytics respects user privacy
✅ No personal data collected without consent
✅ Compliant with GDPR (with proper config)
✅ Can add cookie consent banner if needed

For now, basic GA4 tracking is fine for a personal project.

---

## Quick Setup Checklist

- [ ] Create Google Analytics account
- [ ] Get Measurement ID (G-XXXXXXXXXX)
- [ ] Add tracking code to index.html OR install react-ga4
- [ ] Add VITE_GA_TRACKING_ID to .env.production
- [ ] Commit and deploy
- [ ] Verify in GA Real-time reports
- [ ] Add custom event tracking (optional)

---

**Next Steps**: Set up GA account and I'll help you integrate it! 🚀
