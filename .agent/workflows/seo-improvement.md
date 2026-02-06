---
description: Continuous SEO improvement workflow - run every 3-5 days
---

# SEO Improvement Workflow

This workflow tracks SEO progress and suggests new improvements.

## Pre-requisites
- Backend running locally or deployed
- GSC credentials configured (optional but recommended)

## Steps

// turbo-all

### 1. Check Current Indexing Status
```bash
cd /Users/akeemojuko/.gemini/antigravity/scratch/harboraicore
# If GSC is configured:
python3 scripts/gsc_monitor.py --action sitemaps 2>/dev/null || echo "GSC not configured"

# Check sitemap accessibility (local):
curl -s http://localhost:3001/api/seo/sitemap-stats | python3 -m json.tool
```

### 2. Run IndexNow Submission
```bash
cd /Users/akeemojuko/.gemini/antigravity/scratch/harboraicore
source .venv/bin/activate
python3 scripts/aggressive_indexer.py --output scripts/blitz_results.json
```

### 3. Review Tracker
```bash
cat /Users/akeemojuko/.gemini/antigravity/scratch/harboraicore/docs/SEO_TRACKER.md
```

### 4. Suggest Next Improvement
Based on the tracker backlog, implement the next high-priority item:
- Schema markup
- Core Web Vitals optimization
- Internal linking improvements

### 5. Update Tracker
After implementing improvements, update `docs/SEO_TRACKER.md` with:
- Completed items moved to "Completed Improvements"
- New metrics if available
- Next review date

## Automation

To set up a reminder, add to crontab:
```bash
# Run SEO check every Monday at 9am
0 9 * * 1 cd /path/to/harboraicore && ./scripts/run_seo_blitz.sh >> logs/seo.log 2>&1
```
