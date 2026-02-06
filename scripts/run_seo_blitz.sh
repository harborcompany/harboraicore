#!/bin/bash
# Harbor ML - Aggressive SEO Blitz Runner
# Executes full indexing pipeline: seed DB + submit to search engines

set -e

cd "$(dirname "$0")/.."
echo "🚀 HARBOR ML - AGGRESSIVE SEO BLITZ"
echo "===================================="
echo ""

# 1. Check dependencies
echo "1️⃣  Checking dependencies..."
pip install -q requests google-auth google-api-python-client 2>/dev/null || true

# 2. Generate fresh PSEO pages
echo "2️⃣  Generating PSEO content (15,000 pages)..."
python3 scripts/pseo_seeder.py --output scripts/pseo_seed.sql --format sql --limit 15000

# 3. Import to database (if DATABASE_URL set)
if [ -n "$DATABASE_URL" ]; then
    echo "3️⃣  Importing to database..."
    psql "$DATABASE_URL" -f scripts/pseo_seed.sql 2>/dev/null || echo "   ⚠️  DB import skipped (check connection)"
else
    echo "3️⃣  ⚠️  DATABASE_URL not set - SQL seed saved but not imported"
    echo "   Run: psql \$DATABASE_URL -f scripts/pseo_seed.sql"
fi

# 4. Generate URL list from seeded pages
echo "4️⃣  Generating URL list..."
python3 -c "
import json

SITE_URL = 'https://harborml.com'

# Load pages from SQL or generate from templates
verticals = [
    'lego', 'model-trains', 'rc-cars', 'drones', 'robotics', '3d-printing',
    'arduino', 'raspberry-pi', 'electronics', 'woodworking', 'miniatures',
    'scale-models', 'dioramas', 'wargaming', 'tabletop', 'cosplay',
    'gunpla', 'model-kits', 'rc-planes', 'rc-boats', 'fpv-drones', 'quadcopters'
]

urls = []

# Static pages
static = ['', '/about', '/pricing', '/product', '/docs', '/docs/quickstart', '/docs/api', '/contact']
urls.extend([f'{SITE_URL}{p}' for p in static])

# Tool pages
tools = ['assembly-tracker', 'parts-inventory', 'build-planner', 'cost-calculator', 'time-tracker']
for v in verticals:
    for t in tools:
        urls.append(f'{SITE_URL}/tools/{v}-{t}')

# Guide pages
guides = ['how-to-photograph', 'beginner-guide-to', 'advanced-techniques', 'best-practices-for', 'lighting-setup']
for v in verticals:
    for g in guides:
        urls.append(f'{SITE_URL}/guides/{g}-{v}')

# Comparisons
for i, v1 in enumerate(verticals[:10]):
    for v2 in verticals[i+1:i+4]:
        urls.append(f'{SITE_URL}/compare/{v1}-vs-{v2}')

print(f'Generated {len(urls)} URLs')
with open('scripts/urls_to_index.json', 'w') as f:
    json.dump(urls, f, indent=2)
"

# 5. Run aggressive indexer
echo "5️⃣  Executing multi-channel indexing blitz..."
python3 scripts/aggressive_indexer.py --output scripts/blitz_results.json 2>&1 | head -50

echo ""
echo "✅ BLITZ COMPLETE"
echo "   Results: scripts/blitz_results.json"
echo "   SQL Seed: scripts/pseo_seed.sql"
echo ""
echo "📊 Next Steps:"
echo "   1. Import SQL to production: psql \$DATABASE_URL -f scripts/pseo_seed.sql"
echo "   2. Submit sitemaps to GSC: https://search.google.com/search-console"
echo "   3. Monitor indexation: python3 scripts/gsc_monitor.py --action sitemaps"
