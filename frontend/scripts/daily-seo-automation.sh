#!/bin/bash
# =============================================================================
# Harbor SEO Daily Automation Script
# Run via cron: 0 9 * * * /path/to/harboraicore/frontend/scripts/daily-seo-automation.sh
# =============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
LOG_FILE="$PROJECT_DIR/logs/seo-automation.log"

# Ensure log directory exists
mkdir -p "$PROJECT_DIR/logs"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

log "=========================================="
log "Starting daily SEO automation..."
log "=========================================="

# 1. Ping search engines about sitemap
log "Step 1: Pinging search engines..."
cd "$PROJECT_DIR"
node scripts/ping-search-engines.cjs >> "$LOG_FILE" 2>&1

# 2. Submit to IndexNow (Bing/Yandex) - submits batches of new/updated URLs
log "Step 2: Submitting to IndexNow..."
node scripts/submit-indexnow.cjs >> "$LOG_FILE" 2>&1

# 3. Generate new blog articles
log "Step 3: Generating blog articles..."
node scripts/generate-blog-articles.cjs >> "$LOG_FILE" 2>&1

# 4. Commit and push new content (if any changes)
log "Step 4: Pushing updates to GitHub..."
cd "$(dirname "$PROJECT_DIR")"
if [[ -n $(git status --porcelain) ]]; then
    git add .
    git commit -m "Daily SEO automation: $(date '+%Y-%m-%d')"
    git push origin main >> "$LOG_FILE" 2>&1
    log "Changes pushed to GitHub"
else
    log "No changes to push"
fi

log "=========================================="
log "Daily SEO automation complete!"
log "=========================================="
