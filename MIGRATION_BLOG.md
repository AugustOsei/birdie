# From AWS to Railway: Rebuilding Birdie and Redesigning Mobile

When AWS's free tier ended, my bird identification game, Birdie, went offline. Instead of paying $10-15/month for EC2, I decided to migrate to Railway—a simpler, cheaper platform. But the migration taught me more than just infrastructure. It forced me to actually *test* the app on mobile, exposing UX problems I'd overlooked.

## Why Railway?

My original Birdie setup was deployed on AWS EC2 using Docker Compose, Nginx, and Let's Encrypt. It worked, but when the free tier expired, the costs added up:
- EC2 t2.micro: $8.47/month
- EBS storage: $2-3/month
- Data transfer: variable

**Railway offered**: A simpler pricing model (~$5-15/month depending on usage), automatic Docker support, and zero infrastructure management. Plus, I could deploy directly from GitHub.

## The Migration Challenge

Deploying to Railway seemed straightforward—connect my GitHub repo and let it build. But I hit a problem: my repo structure had `/frontend`, `/backend`, and other directories at the root. Railway's auto-detection couldn't figure out which Dockerfile to use.

**The fix**: Update the Dockerfiles to reference subdirectories explicitly:

```dockerfile
# Old - looked for files in root
COPY package*.json ./

# New - references subdirectory
COPY birdie-app/package*.json ./
```

Simple, but crucial. After adjusting both frontend and backend Dockerfiles, everything deployed smoothly. The app was live in 30 minutes.

## Then I Tested on Mobile...

With the app live, I finally tested it on my phone. That's when reality hit.

On desktop, Birdie displays 3 birds horizontally for users to identify. No problem—clean, spacious layout. But on mobile? The birds stacked vertically, and users had to scroll down to see all three options. More frustratingly, there was **no indication** of how to navigate between birds. The dots below the submit button? Not intuitive at all.

I realized I'd built a feature without testing it on the actual device users would use. Lesson learned.

## Mobile Redesign: One Bird at a Time

I redesigned the mobile experience from scratch:

**Before:**
- 3 birds stacked vertically
- Confusing navigation dots below submit
- No progress indicator

**After:**
- Show one bird at a time on mobile (< 768px)
- **← PREV** and **NEXT →** arrow buttons (clear, directional)
- **"Bird 1 of 3"** counter (shows progress instantly)
- Buttons auto-disable at boundaries (greyed out, can't click past bird 3)
- Navigation dots appear below submit (for review after submission)

The implementation was straightforward:
1. Added `mobileCurrentBird` state to track which bird is visible
2. Used CSS media queries to show/hide birds based on screen size
3. Styled arrow buttons with hover effects and disabled states

Desktop remains unchanged—all 3 birds still display horizontally.

## What I Learned

**1. Test early on the actual device.** Responsive design isn't just about making things fit the screen; it's about the user experience. I could've discovered this months earlier if I'd tested on mobile before deployment.

**2. Intuitive navigation matters more than novelty.** The dots looked nice, but arrows are immediately clear. Users understand "NEXT →" without thinking.

**3. Progress indicators reduce friction.** Knowing "Bird 1 of 3" makes users feel less lost. It's a small detail with big impact.

**4. Railway makes deployment friction-free.** By removing the complexity of manual EC2 management, I could focus on the actual product and user experience.

## The Numbers

- **Migration time**: 30 minutes
- **Mobile redesign**: 2 hours (implementation + CSS)
- **New monthly cost**: ~$5-10 (vs $10-15 on EC2)
- **User experience improvement**: Huge

## What's Next?

The mobile experience is solid now, but there's more to come:
- Background music during gameplay
- Expanded bird collection (beyond 9 birds)
- Better landing page visuals
- Optional: persistent data storage for user progress

## The Bigger Picture

This migration wasn't just about saving money or moving to a new host. It was a reminder that **building in public and iterating based on real usage is non-negotiable**. The best infrastructure means nothing if users can't navigate your app on their phones.

Railway handled the infrastructure beautifully. Now I can focus on what matters—the experience.

---

**Birdie is live at [birdie.augustwheel.com](https://birdie.augustwheel.com). Try it on desktop and mobile, and let me know what you think.**

Have you migrated a project recently? Hit me up on [Twitter](https://twitter.com) or check out my other posts on building in public.
