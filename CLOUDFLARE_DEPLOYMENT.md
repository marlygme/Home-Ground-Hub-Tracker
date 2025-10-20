# Deploy to Cloudflare Pages + Workers

This guide shows you how to deploy your **Home Ground Hub Tracker** to Cloudflare with both frontend and backend working.

## Architecture

- **Frontend (React)** → Cloudflare Pages (static hosting)
- **Backend (Express + PostgreSQL)** → Cloudflare Workers (serverless)
- **Database** → Neon PostgreSQL (already configured with HTTP driver)

---

## Prerequisites

1. **Cloudflare account** (free tier works!)
2. **Wrangler CLI** (already installed)
3. **Your Neon database connection string**

---

## Step 1: Configure Environment Variables

You need to set up your secrets in Cloudflare Workers:

```bash
# Login to Cloudflare
npx wrangler login

# Add your DATABASE_URL secret
npx wrangler secret put DATABASE_URL
# When prompted, paste your Neon connection string:
# postgres://user:password@ep-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require

# Add your SESSION_SECRET
npx wrangler secret put SESSION_SECRET
# When prompted, paste a random secure string (at least 32 characters)
# You can generate one with: openssl rand -base64 32
```

---

## Step 2: Test Locally with Wrangler

Before deploying, test that your backend works with Cloudflare Workers:

```bash
# Start local Cloudflare Workers development server
npx wrangler dev

# This will start your Express backend at http://localhost:8787
# Test the API endpoints:
# - http://localhost:8787/api/programs
# - http://localhost:8787/api/participants
```

If everything works, you'll see your API routes responding!

---

## Step 3: Deploy Backend to Cloudflare Workers

Deploy your Express backend:

```bash
# Deploy to Cloudflare Workers
npx wrangler deploy

# You'll get a URL like:
# https://home-ground-hub-tracker.YOUR-SUBDOMAIN.workers.dev
```

**Save this URL** - you'll need it for the frontend!

---

## Step 4: Configure Frontend API URL

Your frontend needs to know where the backend is located.

Edit `client/src/lib/queryClient.ts` and update line ~20:

```typescript
// Change this:
const baseUrl = import.meta.env.VITE_API_URL || '';

// To your Workers URL:
const baseUrl = 'https://home-ground-hub-tracker.YOUR-SUBDOMAIN.workers.dev';
```

---

## Step 5: Build & Deploy Frontend to Cloudflare Pages

Build the frontend:

```bash
npm run build
```

Deploy to Cloudflare Pages using Wrangler:

```bash
npx wrangler pages deploy dist/public

# When prompted:
# - Project name: home-ground-hub-tracker
# - Production branch: main
```

Your app will be live at: `https://home-ground-hub-tracker.pages.dev`

---

## Alternative: Deploy via GitHub

1. Push your code to GitHub
2. Go to https://dash.cloudflare.com/
3. Click **Workers & Pages** → **Create application** → **Pages**
4. Connect your GitHub repository
5. Build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist/public`
6. Deploy!

---

## Step 6: Update CORS (Important!)

Since your frontend (pages.dev) and backend (workers.dev) are on different domains, you need CORS.

Edit `server/worker.ts` and add this right after `const app = express();`:

```typescript
// Add CORS support
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});
```

Redeploy the worker:
```bash
npx wrangler deploy
```

---

## Verification Checklist

✅ Workers backend deployed: `https://home-ground-hub-tracker.YOUR-SUBDOMAIN.workers.dev`  
✅ Pages frontend deployed: `https://home-ground-hub-tracker.pages.dev`  
✅ DATABASE_URL secret set  
✅ SESSION_SECRET secret set  
✅ Frontend configured to use Workers backend URL  
✅ CORS headers added  
✅ Can create programs (test this!)  
✅ Can add participants  
✅ Multi-user data works across devices

---

## Quick Deploy Commands (Summary)

```bash
# 1. Set secrets (one-time)
npx wrangler login
npx wrangler secret put DATABASE_URL
npx wrangler secret put SESSION_SECRET

# 2. Update frontend API URL in client/src/lib/queryClient.ts

# 3. Add CORS to server/worker.ts

# 4. Deploy backend
npx wrangler deploy

# 5. Build and deploy frontend
npm run build
npx wrangler pages deploy dist/public
```

---

## Troubleshooting

### "Failed to create program" error

**Cause**: Frontend can't reach backend  
**Fix**: 
1. Check that `queryClient.ts` has the correct Workers URL
2. Make sure CORS is enabled in `server/worker.ts`
3. Test backend directly: `curl https://your-worker.workers.dev/api/programs`

### Database connection errors

**Cause**: DATABASE_URL not set or incorrect  
**Fix**: Run `npx wrangler secret put DATABASE_URL` again with correct Neon connection string

### CORS errors in browser console

**Cause**: Missing CORS headers  
**Fix**: Add CORS middleware to `server/worker.ts` (see Step 6)

### Build errors

**Cause**: Missing dependencies  
**Fix**: Run `npm install` first

---

## Cost

- **Cloudflare Workers**: Free tier (100k requests/day)
- **Cloudflare Pages**: Free tier (500 builds/month)
- **Neon Database**: Free tier (3GB storage)

**Total**: $0/month for most use cases! 🎉

---

## Support

If you run into issues:
1. Check Cloudflare Workers logs: `npx wrangler tail`
2. Check Neon database logs in your Neon dashboard
3. Test API directly: `curl https://your-worker.workers.dev/api/programs`
4. Check browser console (F12) for errors

---

**Your app is now deployed globally on Cloudflare's edge network!** 🚀
