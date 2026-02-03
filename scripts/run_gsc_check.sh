#!/bin/bash
cd /Users/akeemojuko/.gemini/antigravity/scratch/harboraicore
source .env 2>/dev/null || true
python3 scripts/gsc_monitor.py --action check --output logs/gsc_report_$(date +%Y%m%d).json
