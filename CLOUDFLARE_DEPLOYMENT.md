# Cloudflare Pages Deployment Guide

## Quick Start

This app is ready to deploy to Cloudflare Pages. Follow these exact steps:

### 1. Build Settings in Cloudflare Pages Dashboard

When setting up your project in Cloudflare Pages, enter these **exact** values:

```
Framework preset: None
Build command: npm run build  
Build output directory: dist/public
```

⚠️ **CRITICAL:** The output directory MUST be `dist/public` (not just `dist`)

### 2. Why dist/public?

This project has two build outputs:
- `dist/index.js` - Backend server (NOT used on Cloudflare Pages)
- `dist/public/` - Frontend static files (USE THIS for Cloudflare Pages)

Cloudflare Pages only hosts static files, so we use the `dist/public` folder which contains:
- `index.html` - Main HTML file
- `assets/` - JavaScript and CSS bundles
- `_redirects` - SPA routing configuration

### 3. How SPA Routing Works

The `_redirects` file contains:
```
/* /index.html 200
```

This tells Cloudflare Pages to serve `index.html` for ALL routes, allowing the React app to handle navigation client-side.

### 4. Verify Build Locally

Before deploying, verify the build works:

```bash
npm run build
ls -la dist/public/
# Should show: index.html, assets/, _redirects
```

### 5. Deploy

1. Push code to GitHub/GitLab
2. Connect repository to Cloudflare Pages
3. Use the build settings from step 1
4. Deploy!

Your app will be live at: `your-project-name.pages.dev`

## Common Issues

**Blank page after deployment:**
- Double-check the build output directory is `dist/public` (not `dist`)
- Check browser console for errors (F12)

**Build fails on Cloudflare:**
- Verify Node.js version is 18+ in project settings
- Check all dependencies are in package.json

**App works locally but not on Cloudflare:**
- This app is pure static HTML/JS/CSS with localStorage
- No backend server required
- Make sure you're deploying the `dist/public` folder, not `dist`

## What This App Does

- 100% frontend - no backend server needed
- All data stored in browser localStorage
- Perfect for Cloudflare Pages static hosting
- Australian phone number validation
- Mobile-friendly soccer program participant tracking
