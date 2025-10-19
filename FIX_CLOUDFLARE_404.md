# Fix Cloudflare Pages 404 Error

Your site shows 404 because Cloudflare Pages has the WRONG build settings. Follow these steps:

## Step 1: Check Your Cloudflare Pages Dashboard

1. Go to: https://dash.cloudflare.com/
2. Navigate to **Workers & Pages**
3. Click on your project: **home-ground-hub-tracker**
4. Click **Settings** tab

## Step 2: Fix Build Configuration

Under "Build & deployments" → "Build configurations":

**You probably have one of these WRONG settings:**

❌ **WRONG:** Build output directory = `dist`  
✅ **CORRECT:** Build output directory = `dist/public`

❌ **WRONG:** Build command = missing or wrong  
✅ **CORRECT:** Build command = `npm run build`

❌ **WRONG:** Framework preset = "Vite" or "React"  
✅ **CORRECT:** Framework preset = `None`

## Step 3: Update Settings

1. Click **Edit configuration** button
2. Change these fields to EXACTLY:

```
Production branch: main (or master)
Build command: npm run build
Build output directory: dist/public
Root directory: (leave empty)
Framework preset: None
```

3. Click **Save**

## Step 4: Redeploy

After saving the settings:

1. Go to **Deployments** tab
2. Click the three dots (...) on the latest deployment
3. Select **Retry deployment** or **Redeploy**

OR just push a new commit to trigger a rebuild with the correct settings.

## Step 5: Check Build Logs

While it's building:

1. Click on the active deployment
2. Watch the build logs
3. Look for these success indicators:

```
✓ 1733 modules transformed.
✓ built in XX.XXs
../dist/public/index.html
../dist/public/assets/index-XXXXX.css
../dist/public/assets/index-XXXXX.js
```

## Common Mistakes

### Mistake 1: Wrong Output Directory
If you see in logs: `Finished. Output: 0 files`  
→ You used `dist` instead of `dist/public`

### Mistake 2: Build Failed
If build logs show errors about missing dependencies:
→ Make sure Node version is 18 or higher in Settings

### Mistake 3: Still 404 After Fixing
→ Wait 2-3 minutes for Cloudflare's CDN to update
→ Try in incognito/private browsing mode
→ Clear your browser cache

## Verify It Works

After deployment succeeds, test:

1. Visit: https://home-ground-hub-tracker.pages.dev/
2. You should see "Home Ground Hub" header
3. Click "Add Participant" button should work
4. Page should not be blank or show 404

## If Still Broken

Check the **Deployment Details** in Cloudflare Pages:

1. Does it say "Success" with a green checkmark?
2. Click on the deployment
3. Look at "Build logs" - does it show the files were created?
4. Look at "Deploy logs" - does it show files were uploaded?

The build creates these files in `dist/public/`:
- index.html
- assets/index-[hash].js  
- assets/index-[hash].css
- _redirects

If you don't see these in the logs, the output directory is wrong.
