# Deploy via GitHub (Automatic & Simple)

This is the **easiest way** to deploy - just push to GitHub and everything deploys automatically!

## One-Time Setup (5 minutes)

### Step 1: Get Your Cloudflare API Token

1. Go to https://dash.cloudflare.com/profile/api-tokens
2. Click **"Create Token"**
3. Use the **"Edit Cloudflare Workers"** template
4. Click **"Continue to summary"** → **"Create Token"**
5. **Copy the token** (you'll only see it once!)

### Step 2: Get Your Cloudflare Account ID

1. Go to https://dash.cloudflare.com/
2. Click **"Workers & Pages"** in the left menu
3. Your **Account ID** is shown on the right side
4. Copy it!

### Step 3: Add Secrets to GitHub

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"** and add these 4 secrets:

**Secret 1:**
- Name: `CLOUDFLARE_API_TOKEN`
- Value: (paste the token from Step 1)

**Secret 2:**
- Name: `CLOUDFLARE_ACCOUNT_ID`
- Value: (paste the account ID from Step 2)

**Secret 3:**
- Name: `DATABASE_URL`
- Value: `postgresql://neondb_owner:npg_JU1f5FacGPNj@ep-nameless-firefly-a7udfon9-pooler.ap-southeast-2.aws.neon.tech/neondb?sslmode=require`

**Secret 4:**
- Name: `SESSION_SECRET`
- Value: (any random 32+ character string, like: `my-super-secure-session-secret-12345678`)

---

## That's It! Now Just Push to GitHub

Every time you push to the `main` branch, GitHub Actions will automatically:
1. ✅ Deploy your backend to Cloudflare Workers
2. ✅ Build your frontend
3. ✅ Deploy frontend to Cloudflare Pages

---

## How to Deploy

```bash
# In Replit Shell or your local terminal:
git add .
git commit -m "Deploy to Cloudflare"
git push origin main
```

Watch it deploy live at:
- GitHub Actions: https://github.com/YOUR-USERNAME/YOUR-REPO/actions

After deployment, your app will be live at:
- **Frontend**: https://home-ground-hub-tracker.pages.dev
- **Backend**: https://home-ground-hub-tracker.YOUR-SUBDOMAIN.workers.dev

---

## Update Frontend API URL

After your first deployment, you'll get a Workers URL. Update your frontend to use it:

1. Edit `client/src/lib/queryClient.ts` (line ~20)
2. Change:
   ```typescript
   const baseUrl = import.meta.env.VITE_API_URL || '';
   ```
   To:
   ```typescript
   const baseUrl = 'https://home-ground-hub-tracker.YOUR-SUBDOMAIN.workers.dev';
   ```
3. Commit and push again:
   ```bash
   git add .
   git commit -m "Update API URL"
   git push origin main
   ```

---

## Troubleshooting

**GitHub Actions failing?**
- Check you added all 4 secrets correctly
- Make sure secret names are EXACTLY as shown (case-sensitive!)
- Check the Actions tab for error details

**Can't find Workers URL?**
- Go to https://dash.cloudflare.com/ → Workers & Pages
- Your worker URL is listed there

---

## That's It!

No need to install anything locally. No need to run wrangler commands. Just:
1. Set up GitHub Secrets (one time)
2. Push to GitHub
3. Watch it deploy automatically! 🚀

Your app updates every time you push to GitHub!
