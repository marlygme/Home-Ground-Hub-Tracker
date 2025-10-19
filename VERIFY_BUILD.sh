#!/bin/bash

# This script verifies the build output is correct before deploying

echo "=========================================="
echo "  Verifying Home Ground Hub Build"
echo "=========================================="
echo ""

# Clean and build
echo "🔨 Building project..."
npm run build > /tmp/build.log 2>&1

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Check /tmp/build.log"
    tail -20 /tmp/build.log
    exit 1
fi

echo "✅ Build successful"
echo ""

# Check dist/public exists
echo "📁 Checking output directory..."
if [ ! -d "dist/public" ]; then
    echo "❌ ERROR: dist/public directory not found!"
    echo "The build should create dist/public/ folder"
    exit 1
fi
echo "✅ dist/public exists"
echo ""

# Check required files
echo "📄 Checking required files..."

REQUIRED_FILES=(
    "dist/public/index.html"
    "dist/public/_redirects"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ MISSING: $file"
        exit 1
    fi
done

# Check assets directory
if [ -d "dist/public/assets" ]; then
    JS_FILES=$(find dist/public/assets -name "*.js" | wc -l)
    CSS_FILES=$(find dist/public/assets -name "*.css" | wc -l)
    
    if [ "$JS_FILES" -gt 0 ] && [ "$CSS_FILES" -gt 0 ]; then
        echo "  ✅ dist/public/assets/ ($JS_FILES JS, $CSS_FILES CSS)"
    else
        echo "  ❌ No JS or CSS files in assets/"
        exit 1
    fi
else
    echo "  ❌ MISSING: dist/public/assets/"
    exit 1
fi

echo ""

# Verify _redirects content
echo "🔀 Checking _redirects file..."
REDIRECTS_CONTENT=$(cat dist/public/_redirects)
if [ "$REDIRECTS_CONTENT" = "/* /index.html 200" ]; then
    echo "  ✅ _redirects is correct"
else
    echo "  ❌ _redirects content is wrong!"
    echo "  Expected: /* /index.html 200"
    echo "  Got: $REDIRECTS_CONTENT"
    exit 1
fi

echo ""

# Show file structure
echo "📋 Build output structure:"
echo ""
find dist/public -type f | sort | sed 's/^/  /'
echo ""

# Show file sizes
echo "📊 File sizes:"
du -sh dist/public/* | sed 's/^/  /'
echo ""

echo "=========================================="
echo "  ✅ ALL CHECKS PASSED!"
echo "=========================================="
echo ""
echo "Ready to deploy to Cloudflare Pages with:"
echo "  Build command: npm run build"
echo "  Output directory: dist/public"
echo ""
