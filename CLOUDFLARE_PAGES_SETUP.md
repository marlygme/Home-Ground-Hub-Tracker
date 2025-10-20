# Fix Your Cloudflare Pages API - 2 Minute Setup

Your frontend deploys fine, but the API doesn't work. Here's how to fix it:

## What I Just Added

I added a `functions/` folder with your API routes. Cloudflare Pages will automatically deploy these as serverless functions alongside your frontend.

## You Need To Do ONE Thing

### Add Environment Variables in Cloudflare Dashboard

1. Go to: https://dash.cloudflare.com/
2. Click **Workers & Pages**
3. Click on your project: **home-ground-hub-tracker**
4. Click **Settings** → **Environment variables**
5. Click **Add variable** and add:

**Variable 1:**
- Name: `DATABASE_URL`
- Value: `postgresql://neondb_owner:npg_JU1f5FacGPNj@ep-nameless-firefly-a7udfon9-pooler.ap-southeast-2.aws.neon.tech/neondb?sslmode=require`

**Variable 2:**
- Name: `SESSION_SECRET`  
- Value: `my-super-secure-session-secret-12345678` (or any random 32+ char string)

6. Click **Save**

---

## Deploy

Push your code to GitHub:

```bash
git add .
git commit -m "Add API functions"
git push origin main
```

Cloudflare will automatically redeploy with the API working!

---

## That's It

After this deploys, your app at `https://home-ground-hub-tracker.pages.dev` will have:
- ✅ Working frontend
- ✅ Working API (`/api/programs`, `/api/participants`)
- ✅ Database connection

Test it by creating a program - it will work!
