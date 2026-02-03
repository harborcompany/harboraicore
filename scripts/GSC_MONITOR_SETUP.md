# GSC Monitor Setup Guide

## Prerequisites

1. **Google Cloud Project** with Search Console API enabled
2. **Service Account** with GSC access
3. Python 3.9+

---

## Step 1: Google Cloud Setup

### 1.1 Create Project & Enable API
```bash
# Go to: https://console.cloud.google.com/
# Create a new project (e.g., "harbor-gsc-monitor")
# Navigate to: APIs & Services > Library
# Search for "Google Search Console API" and ENABLE it
```

### 1.2 Create Service Account
```bash
# Go to: APIs & Services > Credentials
# Click "+ CREATE CREDENTIALS" > "Service Account"
# Name: "gsc-monitor"
# Role: (skip for now)
# Click "DONE"
```

### 1.3 Download Key
```bash
# Click on the service account you just created
# Go to "KEYS" tab
# Add Key > Create new key > JSON
# Save the file as: gsc-credentials.json
```

### 1.4 Add to GSC
```bash
# Go to: https://search.google.com/search-console
# Select your property (harborml.com)
# Settings > Users and permissions > Add User
# Enter the service account email (e.g., gsc-monitor@harbor-gsc-monitor.iam.gserviceaccount.com)
# Permission: "Full" or "Restricted"
```

---

## Step 2: Local Setup

### 2.1 Install Dependencies
```bash
cd /Users/akeemojuko/.gemini/antigravity/scratch/harboraicore
pip install google-auth google-api-python-client
```

### 2.2 Configure Environment
```bash
# Add to your .env or shell profile:
export GSC_CREDENTIALS_PATH="/path/to/gsc-credentials.json"
export GSC_SITE_URL="sc-domain:harborml.com"
# OR for URL prefix property:
# export GSC_SITE_URL="https://harborml.com/"
```

### 2.3 Test Connection
```bash
python scripts/gsc_monitor.py --action sitemaps
```

---

## Step 3: Daily Automation (Cron)

### 3.1 Create wrapper script
```bash
cat > scripts/run_gsc_check.sh << 'EOF'
#!/bin/bash
cd /Users/akeemojuko/.gemini/antigravity/scratch/harboraicore
source .env 2>/dev/null || true
python scripts/gsc_monitor.py --action check --output logs/gsc_report_$(date +%Y%m%d).json
EOF
chmod +x scripts/run_gsc_check.sh
```

### 3.2 Add to crontab
```bash
# Run daily at 9am
crontab -e
# Add this line:
0 9 * * * /Users/akeemojuko/.gemini/antigravity/scratch/harboraicore/scripts/run_gsc_check.sh
```

---

## Usage

```bash
# Full daily health check
python scripts/gsc_monitor.py --action check

# Check sitemap index ratio only
python scripts/gsc_monitor.py --action sitemaps

# Get 7-day search analytics
python scripts/gsc_monitor.py --action analytics

# Inspect a specific URL
python scripts/gsc_monitor.py --action inspect --url "https://harborml.com/tools/lego-ideas"

# Save report to file
python scripts/gsc_monitor.py --action check --output report.json
```

---

## Interpreting Results

### Index Ratio Health

| Ratio | Status | Action |
|-------|--------|--------|
| > 70% | ✅ GOOD | Safe to add next sitemap batch |
| 40-70% | ⚠️ WARNING | HOLD - Do not add new pages |
| < 40% | 🚨 CRITICAL | STOP - Review content quality |

### Key Metrics to Watch
- **total_submitted**: URLs in your sitemaps
- **total_indexed**: URLs Google has indexed
- **impressions**: Are your pages appearing in search?
- **average_position**: Is your ranking improving?
