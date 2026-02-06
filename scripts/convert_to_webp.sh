#!/bin/bash
# Harbor ML - Image SEO Optimization Script
# Converts all JPEG/PNG images to WebP format with proper naming

set -e

cd "$(dirname "$0")/../frontend/public"

echo "🖼️  HARBOR ML - IMAGE SEO OPTIMIZATION"
echo "======================================="
echo ""

# Check for cwebp
if ! command -v cwebp &> /dev/null; then
    echo "❌ cwebp not found. Install with: brew install webp"
    exit 1
fi

# Create backup directory
mkdir -p ../image_backups

# Counter
converted=0
skipped=0

# Find all JPEG/PNG files
find . -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" \) | while read -r file; do
    # Skip if WebP version already exists
    webp_file="${file%.*}.webp"
    if [ -f "$webp_file" ]; then
        echo "  ⏭️  Skipping (exists): $file"
        ((skipped++)) || true
        continue
    fi
    
    # Backup original
    cp "$file" "../image_backups/$(basename "$file")"
    
    # Convert to WebP
    echo "  🔄 Converting: $file -> $webp_file"
    cwebp -q 80 "$file" -o "$webp_file" 2>/dev/null
    
    ((converted++)) || true
done

echo ""
echo "✅ Conversion complete!"
echo "   Converted: $converted files"
echo "   Skipped: $skipped files"
echo "   Backups: frontend/image_backups/"
echo ""
echo "📝 Next: Update image references in TSX files to use .webp extension"
