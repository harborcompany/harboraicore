#!/usr/bin/env python3
"""
Harbor ML - PSEO Content Seeder
Generates thousands of programmatic SEO pages for rapid indexation.

Target: 10,000+ unique, crawlable pages across tools, guides, and comparisons.
"""

import os
import json
import random
import hashlib
from datetime import datetime, timedelta
from typing import List, Dict

# ============================================
# CONTENT TEMPLATES
# ============================================

VERTICALS = [
    # Physical Hobbies
    "lego", "model-trains", "rc-cars", "drones", "robotics", "3d-printing",
    "arduino", "raspberry-pi", "electronics", "woodworking", "miniatures",
    "scale-models", "dioramas", "wargaming", "tabletop", "cosplay",
    # Expanded Verticals
    "gunpla", "model-kits", "rc-planes", "rc-boats", "fpv-drones", "quadcopters",
    "cnc-machines", "laser-cutting", "resin-printing", "fdm-printing",
    "mechanical-keyboards", "custom-pcs", "modding", "retro-gaming", "arcade-cabinets",
    "model-rockets", "slot-cars", "train-layouts", "n-scale", "ho-scale",
    "die-cast", "hot-wheels", "matchbox", "action-figures", "vinyl-toys",
    "plushies", "papercraft", "origami", "model-ships", "model-tanks",
    "model-aircraft", "military-models", "sci-fi-models", "fantasy-models",
    "terrain-building", "dungeon-tiles", "modular-terrain", "foam-crafting"
]

TOOL_TEMPLATES = [
    "{vertical}-assembly-tracker",
    "{vertical}-parts-inventory",
    "{vertical}-build-planner",
    "{vertical}-step-counter",
    "{vertical}-time-tracker",
    "{vertical}-cost-calculator",
    "{vertical}-difficulty-estimator",
    "{vertical}-compatibility-checker",
    "{vertical}-missing-parts-finder",
    "{vertical}-instruction-generator",
    "{vertical}-collection-manager",
    "{vertical}-wish-list",
    "{vertical}-price-tracker",
    "{vertical}-release-calendar",
    "{vertical}-community-finder"
]

GUIDE_TEMPLATES = [
    "how-to-photograph-{vertical}",
    "beginner-guide-to-{vertical}",
    "advanced-techniques-{vertical}",
    "best-practices-for-{vertical}",
    "{vertical}-lighting-setup",
    "{vertical}-video-recording-tips",
    "organizing-your-{vertical}",
    "storage-solutions-{vertical}",
    "display-ideas-for-{vertical}",
    "selling-{vertical}-builds-online"
]

COMPARISON_TEMPLATES = [
    "{v1}-vs-{v2}-for-beginners",
    "{v1}-vs-{v2}-price-comparison",
    "{v1}-vs-{v2}-quality-review",
    "best-{vertical}-brands-compared",
    "top-10-{vertical}-sets-reviewed"
]

KEYWORDS = [
    "tutorial", "guide", "how-to", "best", "top", "review", "comparison",
    "tips", "tricks", "hacks", "ideas", "inspiration", "community", "forum",
    "marketplace", "buy", "sell", "trade", "custom", "moc", "instructions",
    # Expanded Keywords
    "beginner", "advanced", "expert", "pro", "ultimate", "complete", "easy",
    "fast", "quick", "cheap", "budget", "premium", "luxury", "rare", "limited",
    "exclusive", "vintage", "classic", "modern", "new", "upcoming", "released",
    "discontinued", "retired", "sale", "discount", "deal", "bundle", "set",
    "collection", "series", "wave", "theme", "category", "type", "style",
    "color", "size", "scale", "material", "technique", "method", "process",
    "workflow", "setup", "config", "settings", "optimization", "performance"
]

# ============================================
# PAGE GENERATORS
# ============================================

def generate_tool_pages() -> List[Dict]:
    """Generate tool page entries"""
    pages = []
    for vertical in VERTICALS:
        for template in TOOL_TEMPLATES:
            slug = template.format(vertical=vertical)
            pages.append({
                "slug": slug,
                "type": "tool",
                "title": slug.replace("-", " ").title(),
                "description": f"Free online {slug.replace('-', ' ')} for {vertical} enthusiasts.",
                "vertical": vertical,
                "active": True
            })
    return pages


def generate_guide_pages() -> List[Dict]:
    """Generate guide page entries"""
    pages = []
    for vertical in VERTICALS:
        for template in GUIDE_TEMPLATES:
            slug = template.format(vertical=vertical)
            pages.append({
                "slug": slug,
                "type": "guide",
                "title": slug.replace("-", " ").title(),
                "description": f"Complete guide on {slug.replace('-', ' ')} for {vertical} builders.",
                "vertical": vertical,
                "active": True
            })
    return pages


def generate_comparison_pages() -> List[Dict]:
    """Generate comparison page entries"""
    pages = []
    for i, v1 in enumerate(VERTICALS):
        for v2 in VERTICALS[i+1:]:
            for template in COMPARISON_TEMPLATES[:3]:  # First 3 comparison templates
                slug = template.format(v1=v1, v2=v2, vertical=v1)
                pages.append({
                    "slug": slug,
                    "type": "compare",
                    "title": slug.replace("-", " ").title(),
                    "description": f"Detailed comparison of {v1} vs {v2} for hobbyists.",
                    "vertical": f"{v1},{v2}",
                    "active": True
                })
    return pages


def generate_long_tail_pages() -> List[Dict]:
    """Generate additional long-tail keyword pages"""
    pages = []
    for vertical in VERTICALS:
        for kw in KEYWORDS:
            # Generate unique combinations
            for suffix in ["2024", "2025", "free", "online", "pro", "expert"]:
                slug = f"{vertical}-{kw}-{suffix}"
                pages.append({
                    "slug": slug,
                    "type": "guide",
                    "title": f"{vertical.title()} {kw.title()} {suffix.title()}",
                    "description": f"Comprehensive {kw} resource for {vertical} - {suffix} edition.",
                    "vertical": vertical,
                    "active": True
                })
    return pages


# ============================================
# DATABASE SEEDER
# ============================================

def generate_prisma_seed_sql(pages: List[Dict]) -> str:
    """Generate raw SQL for Prisma seeding"""
    sql_lines = []
    sql_lines.append("-- PSEO Content Seed")
    sql_lines.append(f"-- Generated: {datetime.now().isoformat()}")
    sql_lines.append(f"-- Total Pages: {len(pages)}")
    sql_lines.append("")
    sql_lines.append("INSERT INTO \"SeoPage\" (id, slug, type, title, description, active, \"createdAt\", \"updatedAt\") VALUES")
    
    values = []
    for i, page in enumerate(pages):
        page_id = hashlib.md5(page["slug"].encode()).hexdigest()[:24]
        escaped_title = page["title"].replace("'", "''")
        escaped_desc = page["description"].replace("'", "''")
        created_at = (datetime.now() - timedelta(days=random.randint(1, 30))).isoformat()
        values.append(
            f"('{page_id}', '{page['slug']}', '{page['type']}', '{escaped_title}', '{escaped_desc}', true, '{created_at}', '{created_at}')"
        )
    
    sql_lines.append(",\n".join(values))
    sql_lines.append("ON CONFLICT (slug) DO NOTHING;")
    
    return "\n".join(sql_lines)


def generate_jsonl(pages: List[Dict]) -> str:
    """Generate JSONL for flexible import"""
    return "\n".join(json.dumps(p) for p in pages)


# ============================================
# MAIN
# ============================================

def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='Generate PSEO content for Harbor ML')
    parser.add_argument('--output', '-o', default='pseo_seed.sql', help='Output file')
    parser.add_argument('--format', '-f', choices=['sql', 'jsonl', 'json'], default='sql')
    parser.add_argument('--limit', '-l', type=int, default=10000, help='Max pages to generate')
    
    args = parser.parse_args()
    
    print("🚀 Generating PSEO Content...")
    
    # Generate all page types
    all_pages = []
    all_pages.extend(generate_tool_pages())
    print(f"  ✓ Tools: {len(generate_tool_pages())}")
    
    all_pages.extend(generate_guide_pages())
    print(f"  ✓ Guides: {len(generate_guide_pages())}")
    
    all_pages.extend(generate_comparison_pages())
    print(f"  ✓ Comparisons: {len(generate_comparison_pages())}")
    
    all_pages.extend(generate_long_tail_pages())
    print(f"  ✓ Long-tail: {len(generate_long_tail_pages())}")
    
    # Deduplicate by slug
    seen_slugs = set()
    unique_pages = []
    for page in all_pages:
        if page["slug"] not in seen_slugs:
            seen_slugs.add(page["slug"])
            unique_pages.append(page)
    
    # Apply limit
    unique_pages = unique_pages[:args.limit]
    
    print(f"\n📊 Total Unique Pages: {len(unique_pages)}")
    
    # Output
    if args.format == 'sql':
        output = generate_prisma_seed_sql(unique_pages)
    elif args.format == 'jsonl':
        output = generate_jsonl(unique_pages)
    else:
        output = json.dumps(unique_pages, indent=2)
    
    with open(args.output, 'w') as f:
        f.write(output)
    
    print(f"✅ Saved to {args.output}")
    
    # Stats
    types = {}
    for p in unique_pages:
        types[p["type"]] = types.get(p["type"], 0) + 1
    print("\n📈 Breakdown by Type:")
    for t, count in types.items():
        print(f"  • {t}: {count}")


if __name__ == '__main__':
    main()
